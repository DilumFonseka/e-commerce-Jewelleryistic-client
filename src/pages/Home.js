import React, { useState, useEffect } from "react";
import Slider from "react-slick";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import img1 from "../images/1.png";
import img2 from "../images/2.png";
import img3 from "../images/3.png";
import mImage1 from "../images/4.jpeg";
import mImage2 from "../images/5.jpg";

import fea from "../images/featuredICON.png";
import tes from "../images/testimonialasICON.png";
import tre from "../images/tendingICON.png";

import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Grid,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";

import ProductCard from "../components/ProductCard";
import CommentSlider from "../components/CommentSlider";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import TestiminialsSlider from "../components/TestiminialsSlider";
import FeaturesSection from "../components/FeaturesSection";

import { db } from "../util/config";
import ProductSlider from "../components/ProductSlider";
import { NavLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  slideHeight: {
    backgroundSize: "cover",
    backgroundPositionX: "center",
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    // width: "100vw",
    // height: "auto",
    // height: `calc(100vh - 64px)`,
    // [theme.breakpoints.down("sm")]: {
    //   height: `calc(100vh - 48px)`,
    // },
  },
  middleImages1: {
    backgroundSize: "cover",
    backgroundImage: "url(" + mImage1 + ")",
  },
  middleImages2: {
    backgroundSize: "cover",
    backgroundImage: "url(" + mImage2 + ")",
  },
}));

export default function Home() {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [trending, SetTrending] = useState([]);
  const [featured, setFeatured] = useState([]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const trending = await db
        .collection("products")
        .where("type.label", "==", "trending")
        .limit(5)
        .get();
      const featured = await db
        .collection("products")
        .where("type.label", "==", "featured")
        .limit(5)
        .get();
      const data = await db.collection("products").limit(5).get();

      let productsList = [];
      let trendingList = [];
      let featuredList = [];

      data.docs.map((doc) => {
        console.log(doc.data());
        productsList.push(doc.data());
      });

      trending.docs.map((doc) => {
        console.log(doc.data());
        trendingList.push(doc.data());
      });

      featured.docs.map((doc) => {
        console.log(doc.data());
        featuredList.push(doc.data());
      });

      setProducts(productsList);
      SetTrending(trendingList);
      setFeatured(featuredList);
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

  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    className: "slides",
    autoplaySpeed: 5000,
    autoplay: true,
    cssEase: "linear",
  };

  console.log(products);

  return (
    <>
      <Header />
      <div
        style={{
          width: "100vw",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Slider {...settings}>
          <div>
            <img style={{ width: "100vw" }} src={img1} alt="img1" />
            {/* <div
              className={classes.slideHeight}
              style={{
                backgroundSize: "cover",
                height: "",
                backgroundPositionX: "center",
                backgroundImage: `url(${img1})`,
              }}
            ></div> */}
          </div>

          <div>
            <img style={{ width: "100vw" }} src={img2} alt="img2" />
            {/* <div
              className={classes.slideHeight}
              style={{
                backgroundSize: "cover",
                height: "70vh",
                backgroundPositionX: "center",
                backgroundImage: `url(${img2})`,
              }}
            ></div> */}
          </div>
          <div>
            <img style={{ width: "100vw" }} src={img3} alt="img3" />
            {/* <div
              className={classes.slideHeight}
              style={{
                backgroundSize: "cover",
                height: "70vh",
                backgroundPositionX: "center",
                backgroundImage: `url(${img3})`,
              }}
            ></div> */}
          </div>
        </Slider>
      </div>

      <Container
        maxWidth="lg"
        style={{ marginTop: "50px", marginBottom: "50px" }}
      >
        <FeaturesSection />
      </Container>

      {loading ? (
        <Spinner type="propagate" />
      ) : (
        <>
          <Container
            maxWidth="lg"
            style={{ marginTop: "50px", marginBottom: "50px" }}
          >
            <Typography
              variant="h4"
              color="initial"
              style={{ marginBottom: "25px" }}
            >
              <img
                src={fea}
                alt="df"
                style={{ width: "32px", height: "32px", marginRight: "16px" }}
              />
              <b>Featured Products</b>
            </Typography>

            {products.length === 0 ? (
              <Typography variant="body1" color="initial">
                Please add products to featured collection
              </Typography>
            ) : (
              <ProductSlider products={featured} />
            )}
          </Container>

          <Container
            maxWidth="lg"
            style={{ marginTop: "100px", marginBottom: "50px" }}
          >
            <Typography
              variant="h4"
              color="initial"
              style={{ marginBottom: "25px" }}
            >
              {" "}
              <img
                src={tre}
                alt="df"
                style={{ width: "32px", height: "32px", marginRight: "16px" }}
              />
              <b>Top Trending</b>
            </Typography>

            {products.length === 0 ? (
              <Typography variant="body1" color="initial">
                Please add products to trending collection
              </Typography>
            ) : (
              <ProductSlider products={trending} />
            )}
          </Container>

          <Grid container direction="row" style={{ minHeight: "250px" }}>
            <Grid item md={6} xs={12} sm={6} className={classes.middleImages1}>
              <NavLink to="/Jewels/necklaces">
                <Button
                  size="large"
                  variant="contained"
                  style={{
                    marginTop: "24px",
                    marginBottom: "40px",
                    float: "left",
                    marginLeft: "20px",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  <b>View Collection</b>
                </Button>
              </NavLink>
            </Grid>
            <Grid item md={6} xs={12} sm={6} className={classes.middleImages2}>
              <NavLink to="/Jewels/engagement rings">
                <Button
                  size="large"
                  variant="contained"
                  style={{
                    marginTop: "24px",
                    marginBottom: "40px",
                    float: "right",
                    marginRight: "20px",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  <b>View Collection</b>
                </Button>
              </NavLink>
            </Grid>
          </Grid>
        </>
      )}

      <Container
        maxWidth="lg"
        style={{
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <Grid container direction="row" alignItems="center">
          <Grid item md={12} xs={12} sm={12}>
            <Typography variant="h4" color="initial">
              <img
                src={tes}
                alt="df"
                style={{ width: "32px", height: "32px", marginRight: "16px" }}
              />
              <b>Testimonials</b>
            </Typography>
            <Typography
              variant="h6"
              style={{
                marginBottom: "24px",
                color: "#4D4C4C",
                marginTop: "16px",
              }}
            >
              Our Customers say
            </Typography>

            <TestiminialsSlider />
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
}
