import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

import CheckoutCard from "../components/CheckoutCard";
import SubHeading from "../components/SubHeading";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Box from "../components/Box";

import {
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//icons
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import HomeIcon from "@material-ui/icons/Home";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";

import { AuthContext } from "../util/AuthProvider";
import Paragraph from "../components/Paragraph";
import Label from "../components/Label";
import Payment from "../components/Payment";

import { db } from "../util/config";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px",
  },
  papal: {
    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(2),
    },
  },
  credit: {
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(2),
    },
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
  image: {
    [theme.breakpoints.up("md")]: {
      maxWidth: 150,
      maxHeight: 67,
    },
    [theme.breakpoints.down("md")]: {
      maxWidth: 150,
      maxHeight: 100,
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: 100,
      maxHeight: 100,
    },
  },
}));

export default function Checkout() {
  const classes = useStyles();

  const { cart, dispatch, currentUser } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const removeItem = (id, price) => {
    setLoading(true);
    console.log(id);
    const item = {
      itemId: id,
      price: price,
    };

    dispatch({
      type: "REMOVE_PRODUCT",
      product: item,
    });
    setLoading(false);
  };

  const getFees = async () => {
    try {
      setLoading(true);

      const cat = await db.collection("fees").orderBy("district").get();

      let feesList = [];

      console.log(cat.docs);

      cat.docs.map((doc) => {
        feesList.push(doc.data());
        console.log(doc.data());
      });

      console.log(currentUser.district.value);

      let cost = 0;

      feesList.map((f) => {
        console.log(f.district);

        if (currentUser.district.value === f.district) {
          cost = f.fees;
          setFee(f.fees);
        }

        console.log(cost);
      });

      setTotal(parseInt(cart.total) + parseInt(cost));

      setFees(feesList);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFees();
  }, []);

  console.log(cart);
  console.log(currentUser);

  return (
    <>
      <Header />

      <Container
        maxWidth="md"
        style={{ marginTop: "50px", marginBottom: "50px" }}
      >
        <Breadcrumbs
          aria-label="breadcrumb"
          style={{ marginBottom: "50px", marginTop: "25px" }}
        >
          <Link to="/" className={classes.link}>
            <HomeIcon className={classes.icon} />
            Home
          </Link>

          <Typography color="textPrimary" className={classes.link}>
            <ShoppingCartOutlinedIcon className={classes.icon} />
            Checkout and Payment
          </Typography>
        </Breadcrumbs>

        <Box>
          {loading ? (
            <p>loading</p>
          ) : (
            <Grid container style={{ padding: "25px" }}>
              {/* Topic */}

              <Grid Item md={12} xs={12} sm={12} style={{ textAlign: "left" }}>
                <SubHeading text="Shopping cart" />
              </Grid>

              {cart.products.length > 0 ? (
                <Grid
                  container
                  component="main"
                  spacing={2}
                  style={{
                    marginBottom: "25px",
                  }}
                >
                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    align="center"
                    style={{ marginTop: "-8px", marginBottom: "-8px" }}
                  >
                    <TableContainer
                      style={{
                        maxHeight: 600,
                      }}
                    >
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                        stickyHeader
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <Typography variant="overline" color="initial">
                                <b>Item Details</b>
                              </Typography>
                            </TableCell>
                            {/* <TableCell>
                   <Typography variant="overline" color="initial">
                     <b>Title</b>
                   </Typography>
                 </TableCell> */}
                            <TableCell>
                              <Typography variant="overline" color="initial">
                                <b>Quantity</b>
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="overline" color="initial">
                                <b>Color</b>
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="overline" color="initial">
                                <b>Size</b>
                              </Typography>
                            </TableCell>
                            <TableCell style={{ align: "right" }}>
                              <Typography variant="overline" color="initial">
                                <b>Price</b>
                              </Typography>
                            </TableCell>
                            <TableCell style={{ align: "right" }}></TableCell>
                            <TableCell style={{ align: "right" }}></TableCell>
                          </TableRow>
                        </TableHead>
                        {cart.products.map((product) => {
                          return (
                            <TableBody>
                              <TableRow key={product.product.itemId}>
                                <TableCell component="th" scope="product">
                                  <TableCell component="th" scope="product">
                                    <img
                                      style={{ maxWidth: "100px" }}
                                      src={product.product.image}
                                      alt="product_image"
                                    />
                                  </TableCell>
                                </TableCell>

                                {/* <TableCell component="th" scope="product">
                       {product.title}
                     </TableCell> */}

                                <TableCell component="th" scope="product">
                                  {product.quantity}
                                </TableCell>

                                <TableCell component="th" scope="product">
                                  {product.product.colors.label}
                                </TableCell>

                                <TableCell component="th" scope="product">
                                  {product.product.size.label}
                                </TableCell>

                                <TableCell component="th" scope="product">
                                  {product.price}
                                </TableCell>

                                <TableCell component="th" scope="product">
                                  <NavLink
                                    to={`/product/${product.product.productId}`}
                                  >
                                    <IconButton>
                                      <Typography
                                        variant="body2"
                                        color="initial"
                                        style={{ marginRight: "16px" }}
                                      >
                                        VIEW
                                      </Typography>
                                      <VisibilityOutlinedIcon />
                                    </IconButton>
                                  </NavLink>
                                </TableCell>

                                <TableCell component="th" scope="product">
                                  <IconButton
                                    onClick={() =>
                                      removeItem(
                                        product.product.itemId,
                                        product.price
                                      )
                                    }
                                  >
                                    <Typography
                                      variant="body2"
                                      color="initial"
                                      style={{ marginRight: "16px" }}
                                    >
                                      REMOVE
                                    </Typography>
                                    <HighlightOffOutlinedIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          );
                        })}
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  Item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ textAlign: "left" }}
                >
                  <Typography variant="body2" color="initial">
                    There are no products to display
                  </Typography>
                </Grid>
              )}

              {/* <Grid
                Item
                md={12}
                xs={12}
                sm={12}
                style={{ textAlign: "left", marginTop: "25px" }}
              >
                <SubHeading text="Payment Methods" />
              </Grid>

              <Grid item container>
                <Grid md={6} sm={6} xs={12}>
                  <img
                    className={classes.image}
                    src={credit}
                    alt="payment method"
                  />
                </Grid>

                <Grid md={6} sm={6} xs={12}>
                  <img
                    className={classes.image}
                    src={paypal}
                    alt="payment method"
                  />
                </Grid>
              </Grid> */}

              {currentUser.district ? (
                <>
                  {cart.total && cart.total > 0 ? (
                    <Grid
                      Item
                      md={12}
                      xs={12}
                      sm={12}
                      style={{ textAlign: "right" }}
                    >
                      Item Cost : {cart.total.toLocaleString()} LKR
                    </Grid>
                  ) : null}

                  {cart.total &&
                  cart.total > 0 &&
                  fees.length > 0 &&
                  currentUser.district ? (
                    <Grid
                      Item
                      md={12}
                      xs={12}
                      sm={12}
                      style={{ textAlign: "right" }}
                    >
                      Delivery Fee : {fee.toLocaleString()} LKR
                    </Grid>
                  ) : null}

                  {cart.total && cart.total > 0 ? (
                    <Grid
                      Item
                      md={12}
                      xs={12}
                      sm={12}
                      style={{ textAlign: "right" }}
                    >
                      <b>Total : {total.toLocaleString()} LKR</b>
                    </Grid>
                  ) : null}
                </>
              ) : (
                <p style={{ color: "red" }}>
                  <Typography variant="body1" color="initial">
                    <b>Please fill out the delivery information to proceed</b>
                  </Typography>
                </p>
              )}

              <Grid
                Item
                md={12}
                xs={12}
                sm={12}
                style={{ textAlign: "right", marginTop: "25px" }}
              >
                <Divider />
              </Grid>

              <Grid
                Item
                md={12}
                xs={12}
                sm={12}
                style={{ textAlign: "left", marginTop: "50px" }}
              >
                <SubHeading text="Delivery Information" />
              </Grid>

              <Grid item md={12} sm={12} xs={12} style={{ textAlign: "left" }}>
                <Label text="First Name" />
              </Grid>

              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ textAlign: "left", marginBottom: "25px" }}
              >
                {currentUser.firstname ? (
                  <Typography variant="body2" color="initial">
                    {currentUser.firstname}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="initial">
                    -
                  </Typography>
                )}
              </Grid>

              <Grid item md={12} sm={12} xs={12} style={{ textAlign: "left" }}>
                <Label text="Last Name" />
              </Grid>

              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ textAlign: "left", marginBottom: "25px" }}
              >
                {currentUser.lastname ? (
                  <Typography variant="body2" color="initial">
                    {currentUser.lastname}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="initial">
                    -
                  </Typography>
                )}
              </Grid>

              <Grid item md={12} sm={12} xs={12} style={{ textAlign: "left" }}>
                <Label text="Delivery Address" />
              </Grid>

              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ textAlign: "left", marginBottom: "25px" }}
              >
                {currentUser.addressOne && currentUser.addressTwo ? (
                  <>
                    <Typography variant="body2" color="initial">
                      {currentUser.addressOne}
                    </Typography>
                    <Typography variant="body2" color="initial">
                      {currentUser.addressTwo}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="initial">
                    -
                  </Typography>
                )}
              </Grid>

              <Grid item md={12} sm={12} xs={12} style={{ textAlign: "left" }}>
                <Label text="District" />
              </Grid>
              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ textAlign: "left", marginBottom: "25px" }}
              >
                {currentUser.district ? (
                  <Typography variant="body2" color="initial">
                    {currentUser.district.value}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="initial">
                    -
                  </Typography>
                )}
              </Grid>

              <Grid item md={12} sm={12} xs={12} style={{ textAlign: "left" }}>
                <Label text="Province" />
              </Grid>

              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ textAlign: "left", marginBottom: "25px" }}
              >
                {currentUser.province ? (
                  <Typography variant="body2" color="initial">
                    {currentUser.province.value}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="initial">
                    -
                  </Typography>
                )}
              </Grid>

              <Grid item md={12} sm={12} xs={12} style={{ textAlign: "left" }}>
                <Label text="Mobile Number" />
              </Grid>

              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ textAlign: "left", marginBottom: "25px" }}
              >
                {currentUser.mobile ? (
                  <Typography variant="body2" color="initial">
                    {currentUser.mobile}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="initial">
                    -
                  </Typography>
                )}
              </Grid>

              <Grid item md={12} sm={12} xs={12} style={{ textAlign: "left" }}>
                <Label text="Email Address" />
              </Grid>

              <Grid
                item
                md={12}
                sm={12}
                xs={12}
                style={{ textAlign: "left", marginBottom: "25px" }}
              >
                {currentUser.email ? (
                  <Typography variant="body2" color="initial">
                    {currentUser.email}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="initial">
                    -
                  </Typography>
                )}
              </Grid>

              <Grid item md={12} sm={12} xs={12} style={{ textAlign: "left" }}>
                <Typography
                  style={{
                    fontFamily: "AirbnbCerealBook",
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#2196f3",
                    marginTop: "20px",
                  }}
                >
                  <NavLink to="/settings">EDIT INFORMATION</NavLink>
                </Typography>
              </Grid>

              <Grid
                Item
                md={4}
                xs={12}
                sm={12}
                style={{ textAlign: "left", marginTop: "50px" }}
              >
                <Payment
                  amount={cart.total}
                  total={total}
                  delivery={fee}
                  currency="LKR"
                  products={cart.products}
                  first_name={currentUser.firstname}
                  last_name={currentUser.lastname}
                  email={currentUser.email}
                  phone={currentUser.mobile}
                  addressOne={currentUser.addressOne}
                  addressTwo={currentUser.addressTwo}
                  district={currentUser.district}
                  province={currentUser.province}
                  country="Sri Lanka"
                  uid={currentUser.uid}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
}
