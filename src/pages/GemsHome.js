import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
import img1 from "../images/womens.png";

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

  middleImages2: {
    backgroundSize: "cover",
    backgroundImage: "url(" + img1 + ")",
  },
}));

export default function WomensHome(props) {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { sub } = props.match.params;

  const [products, setProducts] = useState([]);
  const [lastProduct, setLastProduct] = useState({});

  const getProducts = async () => {
    setLoading(true);
    try {
      const data = await db
        .collection("sub-categories")
        .where("main", "==", "Gems")
        .get();

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
            {products.length > 0 ? (
              <>
                <Grid container direction="row">
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={12}
                    className={classes.middleImages2}
                  >
                    <img
                      src={img1}
                      alt="cover"
                      style={{ width: "100%", size: "cover" }}
                    />
                  </Grid>
                </Grid>

                <Grid container direction="row">
                  <Breadcrumbs
                    aria-label="breadcrumb"
                    style={{ marginBottom: "25px", marginTop: "25px" }}
                  >
                    <Link to="/" className={classes.link}>
                      <HomeIcon className={classes.icon} />
                      Home
                    </Link>

                    <Link to="/gems-home" className={classes.link}>
                      <Typography color="textPrimary" className={classes.link}>
                        Gems
                      </Typography>
                    </Link>
                  </Breadcrumbs>
                </Grid>

                <Grid container direction="row">
                  {products.map((product) => (
                    <CategoryCard
                      name={product.label}
                      link={product.value}
                      url={product.url}
                      main="gems"
                    />
                  ))}
                </Grid>
              </>
            ) : (
              <Grid container direction="row">
                <Grid item xs={12} md={12} lg={12}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "60vh",
                      marginTop: "50px",
                      marginBottom: "50px",
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        maxWidth: "500px",
                      }}
                      src={error}
                      alt="Error"
                    />
                  </div>
                </Grid>
              </Grid>
            )}
          </Container>

          <Footer />
        </>
      )}
    </>
  );
}
