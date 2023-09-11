import React from "react";
import logoPic from "../assets/imgs/logoTrans.png";
import whatsappPic from "../assets/imgs/WhatsApp.png";
import callusPic from "../assets/imgs/callus.png";

import { Box, Paper, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@emotion/react";
const Footer = () => {
  const theme = useTheme();
  const mediaQ = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component={Paper}
      sx={{
        padding: "20px",
        textAlign: "center",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Box
        component="img"
        sx={{ width: "12vw" }}
        src={logoPic}
        alt="Logo Of Company"
      />
      <Box sx={{ display: "flex", flexDirection: "column", width: "30%" }}>
        <Typography color="primary" sx={{ fontWeight: "bolder" }}>
          Contact us!
        </Typography>
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Box
            component="a"
            target="_blank"
            href="https://api.whatsapp.com/send?phone=9720546132005 &text=Hey I came from a link of your web site!"
          >
            <Box
              component="img"
              sx={{ width: { xs: "80%", sm: "10%" } }}
              src={whatsappPic}
              alt="Whatsapp Button"
            />
          </Box>
          {!mediaQ ? (
            ""
          ) : (
            <Box component="a" target="_blank" href="tel:+9720546132005">
              <Box
                component="img"
                sx={{ width: { xs: "80%", sm: "10%" } }}
                src={callusPic}
                alt="Whatsapp Button"
              />
            </Box>
          )}
        </Box>
      </Box>
      <p>© {new Date().getFullYear()} My Pet Store. All rights reserved.</p>
    </Box>
  );
};

export default Footer;
