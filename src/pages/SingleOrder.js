import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";

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
import CheckIcon from "@material-ui/icons/Check";

import { AuthContext } from "../util/AuthProvider";
import Paragraph from "../components/Paragraph";
import Label from "../components/Label";
import Payment from "../components/Payment";

import { db } from "../util/config";
import LabelAndDetail from "../components/LabelAndDetail";
import Spinner from "../components/Spinner";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0px",
  },
  spinner: {
    display: "flex",
    direction: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
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

export default function SingleOrder(props) {
  const classes = useStyles();

  const { id } = props.match.params;

  const { cart, dispatch, currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  //   const updateOrderStatus = async () => {
  //     try {
  //       let orderStatus = await axios.get(
  //         `http://localhost:5001/e-commerce-58b70/us-central1/api/get-order-status?order_id=${id}`
  //       );

  //       console.log(orderStatus);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  const getOrder = async () => {
    try {
      const data = await db.collection("orders").doc(id).get();

      console.log(data.data());

      setOrder(data.data());
      // setLoading(false);
    } catch (err) {
      setOrder(null);
      // setLoading(false);
    }
  };

  const getPayment = async () => {
    try {
      const data = await db.collection("payments").doc(id).get();

      console.log(data.data());

      setPayment(data.data());
      // setLoading(false);
    } catch (err) {
      setPayment(null);
      // setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const orders = await getOrder();
      const payment = await getPayment();
      setLoading(false);
    })();
  }, []);

  const confirm = async (order_id) => {
    setLoading(true);

    try {
      const data = await db.collection("orders").doc(order_id).update({
        order_status: "RECIEVED",
      });

      console.log(data);
      await getOrder();
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  console.log(order);

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
                View Order Details
              </Typography>
            </Breadcrumbs>

            <Box>
              <Grid container style={{ padding: "25px" }}>
                {/* Topic */}

                <Grid
                  Item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{ textAlign: "left" }}
                >
                  <SubHeading text="Products" />
                </Grid>

                {order && payment ? (
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
                            </TableRow>
                          </TableHead>
                          {order.items.map((product) => {
                            return (
                              <TableBody>
                                <TableRow key={product.items.itemId}>
                                  <TableCell component="th" scope="product">
                                    <TableCell component="th" scope="product">
                                      <img
                                        style={{ maxWidth: "100px" }}
                                        src={product.items.image}
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
                                    {product.items.colors.label}
                                  </TableCell>

                                  <TableCell component="th" scope="product">
                                    {product.items.size.label}
                                  </TableCell>

                                  <TableCell component="th" scope="product">
                                    {product.price}
                                  </TableCell>

                                  <TableCell component="th" scope="product">
                                    <NavLink
                                      to={`/product/${product.productId}`}
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
                                </TableRow>
                              </TableBody>
                            );
                          })}
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid
                      Item
                      md={12}
                      xs={12}
                      sm={12}
                      style={{ textAlign: "left", marginTop: "50px" }}
                    >
                      <SubHeading text="Order Details" />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Order ID"
                        detail={order.order_id}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Amount"
                        detail={`${order.amount} LKR`}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Delivery Fee"
                        detail={`${order.fees} LKR`}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Total"
                        detail={`${order.total} LKR`}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Payment Status"
                        detail={payment.status}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Order Status"
                        detail={order.order_status}
                        marginBottom="15px"
                      />
                    </Grid>

                    {order.order_status === "RECIEVED" ? null : (
                      <Grid container item md={4} sm={12} xs={12}>
                        <Button
                          style={{
                            color: "white",
                            height: "48px",
                            // border: "2px solid #3699ff",
                          }}
                          fullWidth
                          onClick={() => confirm(order.order_id)}
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          startIcon={<CheckIcon />}
                        >
                          <Typography
                            variant="overline"
                            color="initial"
                            style={{ fontSize: "14px" }}
                          >
                            <b>CONFIRM GOODS RECIEVED</b>
                          </Typography>

                          {/* set checkout error when no items */}
                        </Button>
                      </Grid>
                    )}

                    <Grid
                      Item
                      md={12}
                      xs={12}
                      sm={12}
                      style={{ textAlign: "left", marginTop: "50px" }}
                    >
                      <SubHeading text="User Details" />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="First Name"
                        detail={order.first_name}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Last Name"
                        detail={order.last_name}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Delivery Address"
                        detail={order.address}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Mobile Number"
                        detail={order.phone}
                        marginBottom="15px"
                      />
                    </Grid>

                    <Grid container item md={6} sm={12} xs={12}>
                      <LabelAndDetail
                        label="Email Address"
                        detail={order.email}
                        marginBottom="15px"
                      />
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
                      There are no order to display
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Container>
          <Footer />
        </>
      )}
    </>
  );
}
