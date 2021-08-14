import React from "react";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Breadcrumbs,
  Grid,
  Typography,
  Button,
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";

import Logo from "../images/logo.png";

const useStyles = makeStyles((theme) => ({
  link: {
    display: "flex",
    color: "black",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

function AboutUs() {
  const classes = useStyles();

  return (
    <>
      <Header />
      <Container>
        <Breadcrumbs
          aria-label="breadcrumb"
          style={{ marginBottom: "25px", marginTop: "25px" }}
        >
          <Link to="/" className={classes.link}>
            <HomeIcon className={classes.icon} />
            Home
          </Link>

          <Typography color="textPrimary" className={classes.link}>
            About Us
          </Typography>
        </Breadcrumbs>
        <div
          style={{
            backgroundColor: "white",
            marginBottom: "50px",
            marginTop: "50px",

            padding: "40px",
            boxShadow: "0px 10px 38px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Grid item md={4} sm={4} xs={12} style={{ margin: "auto" }}>
            <img
              style={{
                width: "100%",
                height: "100%",
              }}
              src={Logo}
              alt="adf"
            />
          </Grid>

          <Typography
            variant="h4"
            color="initial"
            style={{
              fontSize: "25px",
              marginTop: "50px",
              // fontFamily: "Airbnb Cereal App",
            }}
          >
            <b>About Jewelleryistic</b>
          </Typography>

          <p
            style={{
              fontSize: "20px",
              // fontFamily: "Airbnb Cereal App",
            }}
          >
            Jewelleryistic (Pvt) Ltd is designed with the intention of sparking
            a desire to delve into the milestones of the jewellery industry;
            from the history of the gemstones to the entire production, prior to
            becoming a gift of love, a family heirloom, or an indulgence to the
            customer. As a premium jewellery manufacturer, we are driven by our
            collective vision and indistinguishable passion for high quality and
            specialist workmanship. Every individual gemstone and piece of
            jewellery you’ll find at Jewelleryistic represents our commitment
            towards upholding our tradition of creativity, rarity, and quality
            without compromise. Being one of Sri Lanka’s leading contemporary
            jewellers, Jewelleryistic is not only a jewellery store with a
            reputation to match. It is also an engaging and hands-on learning
            experience. It inspires that ethereal feel of being ensconced in a
            world of one’s own, in which gems and jewellery take precedence. A
            step into our showrooms will lure you to luxuriate in the story of
            every sparkle uniquely created just for you.
          </p>

          <Typography
            variant="h4"
            color="initial"
            style={{
              fontSize: "25px",
              marginTop: "50px",
              // fontFamily: "Airbnb Cereal App",
            }}
          >
            <b>Mission </b>
          </Typography>

          <p
            style={{
              fontSize: "20px",
              // fontFamily: "Airbnb Cereal App",
            }}
          >
            To source, design, and curate jewellery using only the finest,
            ethically sourced gem stones and precious metals to give our valued
            clientele only the best. To be the benchmark for jewellery, locally
            and internationally. To actively help uplift the local gem industry
            and in doing so, contribute to the economic, social and cultural
            upliftment of the nation.
          </p>

          <Typography
            variant="h4"
            color="initial"
            style={{
              fontSize: "25px",
              marginTop: "50px",
              // fontFamily: "Airbnb Cereal App",
            }}
          >
            <b>Our Vision</b>
          </Typography>

          <p
            style={{
              fontSize: "20px",
              // fontFamily: "Airbnb Cereal App",
            }}
          >
            To be the premier high quality gems and jewellery supplier to Sri
            Lanka and the world
          </p>
          <NavLink to={"/contactus"} style={{ textDecoration: "none" }}>
            <Button
              size="large"
              variant="contained"
              style={{
                borderRadius: "20px",
                backgroundColor: "black",
                color: "white",
                marginTop: "50px",
              }}
            >
              <b>Contact Us</b>
            </Button>
          </NavLink>
        </div>
      </Container>

      <Footer />
    </>
  );
}

export default AboutUs;
