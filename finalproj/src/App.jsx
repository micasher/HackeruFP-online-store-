import { useEffect, useState } from "react";
import {
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
} from "@mui/material";

/* toast */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import MuiNavbar from "./components/Navbar/MuiNavbar";
import Router from "./routes/Router";
import { useDispatch, useSelector } from "react-redux";
import useLoggedIn from "./hooks/useLoggedIn";
import Footer from "./components/Footer";
import axios from "axios";
import { authActions } from "./store/auth";

const light = {
  palette: {
    mode: "light",
  },
};

const dark = {
  palette: {
    mode: "dark",
  },
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const loggedIn = useLoggedIn();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        await axios.get("http://localhost:8181/");
        await loggedIn();
        document.addEventListener("wheel", checkUserInactivity);
        document.addEventListener("click", checkUserInactivity);
        checkUserInactivity();
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    })();
  }, []);

  const isDarkTheme = useSelector(
    (bigPie) => bigPie.darkThemeSlice.isDarkTheme
  );
  let inactivityTimer; // This will store the timer ID
  const hours = 4;
  const milliseconds = hours * 60 * 60 * 1000;

  const checkUserInactivity = async () => {
    try {
      if (await loggedIn()) {
        // Clear the previous timer, if any
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
          // User has been inactive for 4 hours, so trigger your action here
          toast.warning(
            "You've been logged out due to inactivity (click to hide)",
            {
              autoClose: false,
            }
          );
          localStorage.clear();
          dispatch(authActions.logout());
        }, milliseconds); // 4 hours in milliseconds
      }
    } catch (error) {}
  };
  return (
    <ThemeProvider theme={isDarkTheme ? createTheme(dark) : createTheme(light)}>
      <CssBaseline />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Container maxWidth="xl">
        <header>
          <MuiNavbar />
        </header>
        <main style={{ minHeight: "74.5vh" }}>
          {isLoading ? <CircularProgress /> : <Router />}
        </main>
        <footer>
          <Footer />
        </footer>
      </Container>
    </ThemeProvider>
  );
}

export default App;
