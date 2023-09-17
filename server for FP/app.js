const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const apiRouter = require("./routes/api");
const initialData = require("./initialData/initialData");
const fs = require("fs");
const chalk = require("chalk");
const app = express();
const usersModelService = require("./model/usersService/usersService");
const session = require("express-session");
const bodyParser = require("body-parser");

//extending image file upload
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));

app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

/* app.get("/", function (req, res) {
  res.render("pages/auth");
}); */

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://localhost:8181",
    ],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  const publicFilePath = path.join(__dirname, "public", req.path);
  if (req.path.startsWith("/public/") && !fs.existsSync(publicFilePath)) {
    res.status(404).json({ err: "File not found" });
  } else {
    next();
  }
});
//bonus logger
const logsDirectory = path.join(__dirname, "logs");

const writeLogs = (logData, res) => {
  if (res && res.statusCode >= 400) {
    const currentDate = new Date().toISOString().split("T")[0];

    fs.mkdir(logsDirectory, { recursive: true }, (err) => {
      if (err) {
        console.error("Error Adding new `logs` Folder", err);
        return;
      }
      const logFilePath = path.join(logsDirectory, `${currentDate}.log`);
      fs.appendFile(logFilePath, logData + "\n", (errSecond) => {
        if (errSecond) {
          console.error("Error writing logs:", errSecond);
        }
      });
    });
  }
};
logger.token("time", () => {
  let a = new Date();
  return a.toTimeString().split(" ")[0];
});

let colorOfLoggerTopics = "#347354";
app.use(
  logger((tokens, req, res) => {
    const morganLoggerTokens = {
      time: tokens.time(req, res),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      httpVersion: tokens["http-version"](req, res),
      status: tokens.status(req, res),
      userAgent: tokens["user-agent"](req, res),
      respondTime: tokens["response-time"](req, res),
    };
    let logData = "";
    const morganData =
      chalk.hex("#fff").bold.underline("Request DETAILS:") +
      " " +
      chalk.hex("#ff0000")(
        `${chalk.bold.hex(colorOfLoggerTopics)("\nTIME:")} ${chalk.bgBlue.bold(
          morganLoggerTokens.time
        )} ${chalk.bold.hex(colorOfLoggerTopics)("\nREST:")}${
          morganLoggerTokens.method
        }, ${chalk.bold.hex(colorOfLoggerTopics)("\nURL:")}${
          morganLoggerTokens.url
        },${chalk.bold.hex(colorOfLoggerTopics)("\nHTTP:")}${
          morganLoggerTokens.httpVersion
        }, ${chalk.bold.hex(colorOfLoggerTopics)("\nSTATUS:")} ${
          morganLoggerTokens.status
        }, ${chalk.bold.hex(colorOfLoggerTopics)("\nREQUESTED WITH:")}${
          morganLoggerTokens.userAgent
        }, ${chalk.bold.hex(colorOfLoggerTopics)("\nRESPOND TIME:")}${
          morganLoggerTokens.respondTime
        } ms`
      );
    for (let morganToken of Object.keys(morganLoggerTokens)) {
      logData += morganLoggerTokens[morganToken] + " ";
    }
    writeLogs(logData, res);
    return morganData;
  })
);
// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use("/api", apiRouter);

/*  PASSPORT SETUP  */

const passport = require("passport");
const normalizeUserFromGoogle = require("./model/mongodb/google/normalizeGoogleUser");
const { generateHash } = require("./utils/hash/bcrypt");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/success", async (req, res) => {
  try {
    let normalUser = normalizeUserFromGoogle.normalizeUserFromGoogle(req.user);
    let userFromDB = await usersModelService.getUserByEmail(normalUser.email);
    if (!userFromDB || userFromDB == {}) {
      normalUser.password = await generateHash(normalUser.password);
      await usersModelService.registerUser(normalUser);
    }
    res.render("pages/success", { user: normalUser });
  } catch (err) {
    res.status(400).json(err);
  }
});
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle any errors that occur during logout
      console.error("Logout error:", err);
      // Redirect or send an error response
      res.status(500).send("Logout failed");
      return;
    }
    // Logout successful, redirect to the home page or any other desired page
    res.redirect("/");
  });
});
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
  "134044080273-r70slcpeo41gpsb0hl4ofvpanavomspu.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const PORT = 8181;
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect("/success");
  }
);

app.use((req, res, next) => {
  res.status(404).json({ err: "page not found" });
});

initialData();

module.exports = app;
