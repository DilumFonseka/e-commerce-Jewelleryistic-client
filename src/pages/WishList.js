import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import firebase from "firebase/app";

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
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";

import SettingsSideBar from "../components/SettingsSideBar";
import Label from "../components/Label";
import Alert from "@material-ui/lab/Alert";
import SubHeading from "../components/SubHeading";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

import { db, app } from "../util/config";
import { AuthContext } from "../util/AuthProvider";

import error from "../images/product.png";
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

export default function WishList(props) {
  const classes = useStyles();

  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [wishList, setWishList] = useState({});
  const [products, setProducts] = useState([]);

  console.log(currentUser.uid);

  const getWishList = async () => {
    setLoading(true);

    try {
      const data = await db.collection("wish-list").doc(currentUser.uid).get();

      console.log(data.data());

      let productsList = [];

      data.data().wishList.map((wish) => {
        console.log(wish);
        productsList.push(db.collection("products").doc(wish).get());
      });

      Promise.all(productsList)
        .then((products) => {
          console.log(products);
          let list = [];

          products.map((product) => {
            console.log(product.data());

            if (product.data()) {
              list.push(product.data());
            }
          });

          setProducts(list);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (err) {
      setWishList({});
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishList();
  }, []);

  const removeItem = async (id) => {
    try {
      console.log(id);
      setLoading(true);

      const data = await db
        .collection("wish-list")
        .doc(currentUser.uid)
        .update({
          userId: currentUser.uid,
          wishList: firebase.firestore.FieldValue.arrayRemove(id),
        });

      await getWishList();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  console.log(products);

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
            {loading ? (
              <Spinner type="propagate" size="12" />
            ) : (
              <>
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
                    Settings
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
                    {products.length > 0 ? (
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
                                <b>Title</b>
                              </TableCell>
                              <TableCell>
                                <b>Image</b>
                              </TableCell>

                              <TableCell>
                                <b>Price</b>
                              </TableCell>
                              <TableCell align="right"></TableCell>
                              <TableCell align="right"></TableCell>
                            </TableRow>
                          </TableHead>
                          {products.map((product) => {
                            return (
                              <TableBody>
                                <TableRow key={product.productId}>
                                  <TableCell component="th" scope="product">
                                    {product.title}
                                  </TableCell>

                                  <TableCell component="th" scope="product">
                                    <img
                                      style={{ width: "100px" }}
                                      src={product.images[0]}
                                      alt="img"
                                    />
                                  </TableCell>

                                  <TableCell component="th" scope="product">
                                    {product.price}
                                  </TableCell>

                                  <TableCell align="left">
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

                                  <TableCell align="left">
                                    <IconButton
                                      onClick={() =>
                                        removeItem(product.productId)
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
                            No products available in the wish list
                          </Typography>
                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                          <img
                            style={{ width: "100%" }}
                            src={error}
                            alt="Not Found"
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </Container>

          <Footer />
        </>
      )}
    </>
  );
}
