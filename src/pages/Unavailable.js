import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import error from "../images/error.jpeg";

export default function Unavailable() {
  return (
    <>
      <Header />
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
      <Footer />
    </>
  );
}
