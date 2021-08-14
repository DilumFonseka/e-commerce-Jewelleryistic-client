import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

import {
  Container,
  Grid,
  Button,
  Breadcrumbs,
  Typography,
} from "@material-ui/core";

import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryCard from "../components/CategoryCard";

import Spinner from "../components/Spinner";

import ProductCardSlider from "../components/ProductCardSlider";
import { makeStyles } from "@material-ui/core/styles";

//icons
import ExtensionIcon from "@material-ui/icons/Extension";
import HomeIcon from "@material-ui/icons/Home";

import { db } from "../util/config";

import error from "../images/error.jpeg";
import brand1 from "../images/brand1.jpeg";
import brand2 from "../images/brand2.jpeg";
import brand3 from "../images/brand3.jpeg";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    direction: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
  link: {
    display: "flex",
    color: "black",
    textDecoration: "none",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}));

export default function BrandsHome(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { sub } = props.match.params;

  const [products, setProducts] = useState([]);
  const [lastProduct, setLastProduct] = useState({});

  const getProducts = async () => {
    setLoading(true);
    try {
      const data = await db.collection("brands").get();

      let productsList = [];

      data.docs.map((doc) => {
        console.log(doc.data());
        productsList.push(doc.data());
      });

      setProducts(productsList);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setProducts({});
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      {loading ? (
        <Grid container component="main" spacing={3}>
          <Grid className={classes.spinner} item md={12} sm={12} xs={12}>
            <Spinner type="propagate" />
          </Grid>
        </Grid>
      ) : (
        <>
          <Header />

          <Container
            maxWidth="lg"
            style={{
              marginBottom: "50px",
              //   boxShadow: "0px 10px 38px rgba(0, 0, 0, 0.1)",
              //   backgroundColor: "#FFFFFF",
            }}
          >
            <Grid container direction="row">
              <Breadcrumbs
                aria-label="breadcrumb"
                style={{ marginBottom: "25px", marginTop: "25px" }}
              >
                <Link to="/" className={classes.link}>
                  <HomeIcon className={classes.icon} />
                  Home
                </Link>

                <Link to="/brands-home" className={classes.link}>
                  <Typography color="textPrimary" className={classes.link}>
                    Brands
                  </Typography>
                </Link>
              </Breadcrumbs>
            </Grid>

            <Grid container direction="row">
              <Grid
                container
                justify="center"
                item
                xs={12}
                md={3}
                sm={6}
                lg={3}
                style={{
                  padding: "25px",
                  marginBottom: "25px",
                }}
              >
                <Grid
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    boxShadow: "0px 10px 38px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <NavLink to="/brands/summergrace">
                    <Grid item md={12} sm={12} lg={12}>
                      <img src={brand1} alt="cov" style={{ width: "100%" }} />
                    </Grid>
                    <Grid
                      item
                      md={12}
                      sm={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <Typography
                        variant="overline"
                        style={{ fontSize: "18px", color: "black" }}
                      >
                        <b>Summer Grace</b>
                      </Typography>
                    </Grid>
                  </NavLink>
                </Grid>
              </Grid>

              <Grid
                container
                justify="center"
                item
                xs={12}
                md={3}
                sm={6}
                lg={3}
                style={{
                  padding: "25px",
                  marginBottom: "25px",
                }}
              >
                <Grid
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    boxShadow: "0px 10px 38px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <NavLink to="/brands/giss 73">
                    <Grid item md={12} sm={12} lg={12}>
                      <img src={brand2} alt="cov" style={{ width: "100%" }} />
                    </Grid>
                    <Grid
                      item
                      md={12}
                      sm={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <Typography
                        variant="overline"
                        style={{ fontSize: "18px", color: "black" }}
                      >
                        <b>Giss 73</b>
                      </Typography>
                    </Grid>
                  </NavLink>
                </Grid>
              </Grid>

              <Grid
                container
                justify="center"
                item
                xs={12}
                md={3}
                sm={6}
                lg={3}
                style={{
                  padding: "25px",
                  marginBottom: "25px",
                }}
              >
                <Grid
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    boxShadow: "0px 10px 38px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <NavLink to="/brands/feather">
                    <Grid item md={12} sm={12} lg={12}>
                      <img src={brand3} alt="cov" style={{ width: "100%" }} />
                    </Grid>
                    <Grid
                      item
                      md={12}
                      sm={12}
                      lg={12}
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <Typography
                        variant="overline"
                        style={{ fontSize: "18px", color: "black" }}
                      >
                        <b>Feather</b>
                      </Typography>
                    </Grid>
                  </NavLink>
                </Grid>
              </Grid>
            </Grid>
          </Container>

          <Footer />
        </>
      )}
    </>
  );
}
