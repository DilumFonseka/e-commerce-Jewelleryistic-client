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

import Spinner from "../components/Spinner";

import ProductCardSlider from "../components/ProductCardSlider";
import { makeStyles } from "@material-ui/core/styles";

//icons
import ExtensionIcon from "@material-ui/icons/Extension";
import HomeIcon from "@material-ui/icons/Home";

import { db } from "../util/config";

import error from "../images/notFound.jpeg";

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

export default function Mens(props) {
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
        .collection("products")
        .where("category.label", "==", "Gems")
        .where("subcategory.value", "==", sub)
        .orderBy("date", "desc")
        .limit(8)
        .get();

      //set last document
      let last = data.docs[data.docs.length - 1];
      console.log(data.docs);
      console.log(last);
      setLastProduct(last);

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

  const fetchMoreData = async () => {
    setLoadingMore(true);
    console.log(loading);

    console.log(loadingMore);

    try {
      let lastDocument = lastProduct;
      let nextDocument = db
        .collection("products")
        .where("category.value", "==", "women")
        .where("subcategory.value", "==", sub)
        .orderBy("date", "desc")
        .startAfter(lastDocument)
        .limit(8);

      const querySnapshots = await nextDocument.get();

      console.log(querySnapshots);

      let productsList = [];

      //set last document
      if (!querySnapshots.empty) {
        let lastDocument = querySnapshots.docs[querySnapshots.docs.length - 1];
        console.log(lastDocument);
        setLastProduct(lastDocument);

        console.log(querySnapshots.docs);
        querySnapshots.docs.map((doc) => {
          console.log(doc.data());
          productsList.push(doc.data());
        });

        console.log(products);
        let allNews = products.concat(productsList);
        console.log(allNews);

        const unique = Array.from(new Set(allNews.map((a) => a.productId))).map(
          (productId) => {
            return allNews.find((a) => a.productId === productId);
          }
        );

        setProducts(unique);
      }
      setLoadingMore(false);
    } catch (e) {
      console.log(e);
      setLoadingMore(false);
    }
  };

  const capitalizeFLetter = () => {
    let text = sub[0].toUpperCase() + sub.slice(1);

    return (
      <Typography color="textPrimary" className={classes.link}>
        {text}
      </Typography>
    );
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
              marginTop: "50px",
              marginBottom: "50px",
              //   boxShadow: "0px 10px 38px rgba(0, 0, 0, 0.1)",
              //   backgroundColor: "#FFFFFF",
            }}
          >
            {products.length > 0 ? (
              <>
                <Grid container direction="row">
                  <Breadcrumbs
                    aria-label="breadcrumb"
                    style={{ marginBottom: "50px", marginTop: "25px" }}
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

                    {capitalizeFLetter()}
                  </Breadcrumbs>
                </Grid>

                <Grid container direction="row">
                  {products.map((product) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      style={{ marginBottom: "30px" }}
                    >
                      <ProductCardSlider
                        id={product.productId}
                        title={product.title}
                        price={product.price}
                        discount={product.discount}
                        image={product.images[0]}
                        label={product.label}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Grid container direction="row" style={{ marginTop: "50px" }}>
                  <Grid item xs={12} md={12} lg={12}>
                    {loadingMore ? (
                      <Button
                        disabled
                        variant="contained"
                        color="primary"
                        onClick={fetchMoreData}
                      >
                        LOADING ...
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={fetchMoreData}
                      >
                        <b>LOAD MORE</b>
                      </Button>
                    )}
                  </Grid>
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
