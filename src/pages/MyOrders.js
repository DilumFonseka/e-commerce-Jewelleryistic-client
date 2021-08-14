import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import firebase from "firebase/app";
import axios from "axios";

//materialui
import {
  Button,
  Grid,
  Typography,
  Container,
  Breadcrumbs,
  TableContainer,
  TableHead,
  Table,
  TableCell,
  TableRow,
  TableBody,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//icons
import SettingsIcon from "@material-ui/icons/Settings";
import HomeIcon from "@material-ui/icons/Home";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";

import SettingsSideBar from "../components/SettingsSideBar";
import Label from "../components/Label";
import Alert from "@material-ui/lab/Alert";
import SubHeading from "../components/SubHeading";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

import { db, app } from "../util/config";
import { AuthContext } from "../util/AuthProvider";

import notFound from "../images/notFound.jpeg";
import Footer from "../components/Footer";

const useStyles = makeStyles((theme) => ({
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
  navlink: {
    textDecoration: "none",
    color: "#1b1b28",
    "&:hover ": {
      //   backgroundColor: "#1b1b28",
      color: "#3699ff",
      "& $addBoxIcon": {
        color: "#3699ff",
      },
    },
  },
  paddingForRight: {
    marginRight: "0px",
    [theme.breakpoints.down("sm")]: {
      paddingRight: "0px",
    },
    paddingRight: "10px",
  },
  paddingForLeft: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "0px",
    },
    paddingLeft: "10px",
  },
  spinner: {
    display: "flex",
    direction: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
  marginTop: {
    [theme.breakpoints.down("md")]: {
      marginTop: "25px",
    },
    marginTop: "0px",
  },
}));

export default function MyOrders(props) {
  const classes = useStyles();

  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  console.log(currentUser.uid);

  const getOrders = async () => {
    setLoading(true);

    try {
      const data = await db
        .collection("payments")
        .where("uid", "==", currentUser.uid)
        .get();

      console.log(data.docs);

      let ordersList = [];

      data.docs.map((order) => {
        console.log(order.data());
        ordersList.push(order.data());
      });

      setOrders(ordersList);
      setLoading(false);
    } catch (err) {
      setOrders([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  console.log(orders);

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
                <SettingsIcon className={classes.icon} />
                My Orders
              </Typography>
            </Breadcrumbs>

            <Grid container>
              <SettingsSideBar />

              <Grid
                item
                container
                md={9}
                sm={12}
                xs={12}
                className={classes.marginTop}
                style={{
                  backgroundColor: "white",
                  borderRadius: "4px",
                  boxShadow: `0px 10px 38px rgba(221, 230, 237, 1)`,
                  textAlign: "left",
                }}
              >
                {orders.length > 0 ? (
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
                            <b>Order Id</b>
                          </TableCell>
                          <TableCell>
                            <b>Date</b>
                          </TableCell>
                          <TableCell>
                            <b>Payment Status</b>
                          </TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      {orders.map((product) => {
                        return (
                          <TableBody>
                            <TableRow key={product.productId}>
                              <TableCell component="th" scope="product">
                                {product.order_id}
                              </TableCell>

                              <TableCell component="th" scope="product">
                                {product.date}
                              </TableCell>

                              <TableCell component="th" scope="product">
                                {product.status}
                              </TableCell>

                              <TableCell align="left">
                                <NavLink to={`/order/${product.order_id}`}>
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

                              {/* <TableCell align="left">
                                  <Button
                                    variant="outlined"
                                    style={{
                                      border: "2px solid red",
                                      color: "red",
                                      fontSize: "12px",
                                    }}
                                    onClick={() => removeItem(product.productId)}
                                    disableElevation
                                  >
                                    <b>Remove</b>
                                  </Button>
                                </TableCell> */}
                            </TableRow>
                          </TableBody>
                        );
                      })}
                    </Table>
                  </TableContainer>
                ) : (
                  <Grid
                    container
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "25px",
                    }}
                  >
                    <Grid item md={12} sm={12} xs={12}>
                      <Typography variant="body1" color="initial">
                        No orders available
                      </Typography>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <img
                        style={{ width: "100%" }}
                        src={notFound}
                        alt="Not Found"
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Container>

          <Footer />
        </>
      )}
    </>
  );
}
