import React from "react";
import { Container, Typography, Box } from "@mui/material";
import imageOfCard from "../assets/imgs/card.jpg";
const AboutPage = () => {
  return (
    <Container
      maxWidth="lg"
      style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Your Pet Store - Your Ultimate Destination for Pet
        Essentials!
      </Typography>
      <Typography variant="body1" paragraph>
        At Your Pet Store, we understand that pets are cherished members of our
        families, bringing joy and companionship into our lives. As dedicated
        pet enthusiasts ourselves, we are committed to providing the very best
        for your beloved companions. Our online emporium is a haven of
        top-notch, practical, and stylish products tailored to meet the needs
        and preferences of pets and their loving owners.
      </Typography>
      <Typography variant="body1" paragraph>
        Our mission is to enrich the lives of pets and their guardians by
        offering a meticulously curated array of pet merchandise that seamlessly
        combines functionality, durability, and style. We strive to be a trusted
        partner, where every pet owner can discover exceptional products that
        contribute to the well-being and happiness of their furry friends.
      </Typography>

      <Typography variant="body1" paragraph>
        *Why Choose Your Pet Store:*
      </Typography>
      <Typography variant="body1" paragraph>
        1. **Commitment to Quality:** We partner with reputable brands that
        share our dedication to excellence and pet welfare. Every item is
        thoughtfully assessed before it joins our selection.
      </Typography>
      <Typography variant="body1" paragraph>
        2. **Customer-Centric Philosophy:** You, our valued customers, are at
        the center of our universe. We're devoted to ensuring a seamless
        shopping experience, swift customer support, and easy returns to
        guarantee your satisfaction.
      </Typography>
      <Typography variant="body1" paragraph>
        3. **Expert Guidance:** As fellow pet aficionados, we possess deep
        knowledge about pet care and are delighted to assist you with queries or
        concerns about our offerings.
      </Typography>
      <Typography variant="body1" paragraph>
        4. **Secure and Convenient Shopping:** Our website offers a secure and
        user-friendly shopping environment, empowering you to explore and shop
        with confidence.
      </Typography>
      <Typography variant="body1" paragraph>
        5. **Prompt Delivery:** Recognizing your eagerness to receive our
        fantastic products, we provide swift and dependable shipping to swiftly
        bring your orders to your doorstep.
      </Typography>
      <Typography variant="body1" paragraph>
        Thank you for selecting Your Pet Store as your preferred online hub for
        all things pet-related. Whether you're a first-time pet parent or a
        seasoned caregiver, we eagerly anticipate serving you and your cherished
        companions with exceptional pet items and unparalleled customer service.
        Together, let's create a Paw-sitive life for your pets!
      </Typography>
      <Box
        component="div"
        sx={{ w: "100%", display: "flex", justifyContent: "space-around" }}
      >
        <img
          alt="Card Of Item Example"
          src={imageOfCard}
          style={{ width: "20vw" }}
        />
      </Box>
    </Container>
  );
};

export default AboutPage;
