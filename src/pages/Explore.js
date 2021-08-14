import React, { useState, useEffect } from "react";

import { Container, Grid } from "@material-ui/core";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";

import { db } from "../util/config";
import SidebarLabel from "../components/SidebarLabel";
import ProductCardSlider from "../components/ProductCardSlider";

export default function Explore() {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const data = await db.collection("products").limit(5).get();

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

  const setSearchResult = (data) => {
    console.log(data);
    setProducts(data);
  };

  return (
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
        <Grid container direction="row">
          {products.map((product) => (
            <Grid item xs={12} md={6} lg={3}>
              <ProductCardSlider
                id={product.productId}
                title={product.title}
                price={product.price}
                discount={product.discount}
                image={product.images[0]}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </>
  );
}
