import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import AuthContext from "./util/AuthProvider";
import AuthRoute from "./util/AuthRoute";

import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import SingleProductView from "./pages/SingleProductView";
import WishList from "./pages/WishList";
import Unavailable from "./pages/Unavailable";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { grey, yellow, red, green } from "@material-ui/core/colors";
import Checkout from "./pages/Checkout";
import Explore from "./pages/Explore";

import Jewels from "./pages/Jewels";
import JewelsHome from "./pages/JewelsHome";
import Gems from "./pages/Gems";
import GemsHome from "./pages/GemsHome";
import Brands from "./pages/Brands";
import BrandsHome from "./pages/BrandsHome";
import Promotions from "./pages/Promotions";

import Contact from "./pages/Contact";
import MyOrders from "./pages/MyOrders";
import SingleOrder from "./pages/SingleOrder";
import AboutUs from "./pages/AboutUs";
import EmailVerification from "./pages/EmailVerification";

const THEME = createMuiTheme({
  shadows: ["none"],
  typography: {
    h1: {
      fontFamily: "AirbnbCerealMedium",
    },
    h2: {
      fontFamily: "AirbnbCerealBook",
    },
    h3: {
      fontFamily: "AirbnbCerealBook",
    },
    h4: {
      fontFamily: "AirbnbCerealMedium",
    },
    h5: {
      fontFamily: "AirbnbCerealMedium",
    },
    h6: {
      fontFamily: "AirbnbCerealMedium",
    },
    body1: {
      fontFamily: "AirbnbCerealBook",
    },
    body2: {
      fontFamily: "AirbnbCerealBook",
    },
    p: {
      fontFamily: "AirbnbCerealBook",
    },
    overline: {
      fontFamily: "AirbnbCerealBook",
    },
    button: { fontFamily: "AirbnbCerealBook" },
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: {
      main: "#CC997C",
    },
    secondary: {
      main: "#8326D0",
    },
    error: {
      main: "#b2102f",
    },
  },
});

function App() {
  return (
    <div className="App">
      <AuthContext>
        <ThemeProvider theme={THEME}>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/email-veification" component={EmailVerification} />
              <AuthRoute path="/settings" component={Settings} />
              <AuthRoute path="/wishlist" component={WishList} />
              <AuthRoute path="/checkout" component={Checkout} />
              <AuthRoute path="/orders" component={MyOrders} />
              <AuthRoute path="/order/:id" component={SingleOrder} />
              <Route path="/explore" component={Explore} />
              <Route path="/jewels/:sub" component={Jewels} />
              <Route path="/jewels-home" component={JewelsHome} />
              <Route path="/gems/:sub" component={Gems} />
              <Route path="/gems-home" component={GemsHome} />

              <Route path="/brands/:sub" component={Brands} />
              <Route path="/brands-home" component={BrandsHome} />
              <Route path="/promotions" component={Promotions} />
              <Route path="/aboutus" component={AboutUs} />
              <Route path="/contactus" component={Contact} />
              <Route path="/product/:id" component={SingleProductView} />
              <Route component={Unavailable} />
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </AuthContext>
    </div>
  );
}

export default App;
