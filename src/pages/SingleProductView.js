import React, { useState, useEffect, useContext } from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import { useForm } from "react-hook-form";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Grid,
  Container,
  Typography,
  Breadcrumbs,
  CircularProgress,
  ButtonGroup,
  Button,
  TextField,
  Divider,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import Heading from "../components/Heading";
import Price from "../components/Price";
import ColorIcon from "../components/ColorIcon";
import SizeIcon from "../components/SizeIcon";
import SubHeading from "../components/SubHeading";
import Paragraph from "../components/Paragraph";
import Box from "../components/Box";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductImageGallery from "../components/ProductImageGallery";
import SingleReview from "../components/SingleReview";
import Spinner from "../components/Spinner";
import Accordion from "../components/Accordion";
import Sizechart from "../components/Sizechart";
import Tabs from "../components/Tabs";

import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";

import { db } from "../util/config";
import { AuthContext } from "../util/AuthProvider";

import error from "../images/error.jpeg";

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: "flex",
    direction: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
  container: {
    padding: "50px",
    [theme.breakpoints.down("sm")]: {
      padding: "25px",
    },
  },
  subcontainer: {
    padding: "50px",
    paddingTop: "25px",
    paddingBottom: "0px",
    [theme.breakpoints.down("sm")]: {
      padding: "25px",
    },
  },
  toastSuccess: {
    backgroundColor: "#8326D0",
    color: "white",
    fontFamily: "AirbnbCerealBook",
    fontSize: "14px",
  },
  toastError: {
    backgroundColor: "#FF0000",
    color: "white",
    fontFamily: "AirbnbCerealBook",
    fontSize: "14px",
  },
  paddingRight: {
    [theme.breakpoints.down("sm")]: {
      paddingRight: "0px",
    },
    paddingRight: "10px",
  },
  paddingLeft: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "0px",
    },
    paddingLeft: "10px",
  },
  marginTop: {
    [theme.breakpoints.down("sm")]: {
      marginTop: "25px",
    },
    marginTop: "0px",
  },
}));

toast.configure();

export default function SingleProductView(props) {
  const classes = useStyles();

  const { id } = props.match.params;

  const { register, handleSubmit, control, errors } = useForm();

  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);

  const [product, setProduct] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [quantityError, setQuantityError] = useState("");

  const [images, setImages] = useState([]);
  const [defaultImages, setDefaultImages] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [wishList, setWishList] = useState({});

  const [availableColors, setAvailableColors] = useState([]);
  const [avalableSizes, setAvailableSizes] = useState([]);

  const { dispatch, cart, currentUser } = useContext(AuthContext);

  const getProduct = async () => {
    try {
      const products = await db.collection("products").doc(id).get();

      const productItems = await db
        .collection("product-items")
        .where("productId", "==", id)
        .get();

      let items = [];

      productItems.docs.map((doc) => {
        items.push(doc.data());
        console.log(doc.data());
      });

      // group by color
      let group = items.reduce((acc, item) => {
        console.log(acc, item);

        if (!acc[item.colors.value]) {
          acc[item.colors.value] = [];
        }
        console.log(acc[item.colors.value]);
        acc[item.colors.value].push(item);
        return acc;
      }, {});

      let colorList = [];
      let imageList = [];

      for (var colors in group) {
        console.log(group[colors][0].image);
        colorList.push(group[colors][0].colors.hex);

        imageList.push({
          color: group[colors][0].colors.hex,
          image: group[colors][0].image,
        });
      }

      products.data().images.map((image) => {
        imageList.push({ color: "all", image: image });
      });

      console.log(imageList);
      console.log(items);

      console.log(imageList);
      setProduct(products.data());
      setAvailableColors(colorList);
      setImages(imageList);
      setDefaultImages(imageList);
      setProductItems(items);

      console.log("after loading");
    } catch (err) {
      console.log(err);
      setProductItems([]);
      setProduct(null);
    }
  };

  const getReviews = async () => {
    try {
      const data = await db
        .collection("reviews")
        .where("productId", "==", id)
        .get();
      console.log(data);

      let reviews = [];

      data.docs.map((doc) => {
        reviews.push(doc.data());
      });

      setReviews(reviews);
    } catch (err) {
      setReviews([]);

      console.log(err);
    }
  };

  const increment = () => {
    let total = quantity + 1;

    if (parseInt(selectedProduct[0] && selectedProduct[0].quantity) > total) {
      setQuantity(total);
      setQuantityError("");
    } else {
      setQuantityError("There is no more products in stock");
    }
  };

  const decrement = () => {
    if (quantity === 0) {
      setQuantity(0);
      setQuantityError("");
    } else {
      let total = quantity - 1;

      if (parseInt(selectedProduct[0] && selectedProduct[0].quantity) > total) {
        setQuantity(total);
        setQuantityError("");
      } else {
        setQuantityError("There is no more products in stock");
      }
    }
  };

  // const getWishList = async () => {
  //   setLoading(true);

  //   try {
  //     const data = await db.collection("wish-list").doc(currentUser.uid).get();

  //     console.log(data.data());

  //     setWishList(data.data());
  //     setLoading(false);
  //   } catch (err) {
  //     setWishList({});
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    (async () => {
      const products = await getProduct();
      const reviews = await getReviews();
      setLoading(false);
    })();
  }, []);

  const filterImages = (color) => {
    const filteredImages = defaultImages.filter(
      (image) => image.color === color
    );
    console.log(filteredImages);
    return filteredImages;
  };

  const filterColor = (color) => {
    const item = productItems.filter((item) => item.colors.hex === color);
    console.log(item);
    return item;
  };

  const filterSize = (size) => {
    const item = avalableSizes.filter((item) => item.size.label === size);
    console.log(item);
    return item;
  };

  const currentColor = (color) => {
    console.log(color);

    const colors = filterColor(color);
    console.log(colors);

    const filteredImages = filterImages(color);
    console.log(filteredImages);

    setAvailableSizes(colors);
    //set available sizes according to selected color
    setSelectedColor(color);
    //set currently selected color
    setImages(filteredImages);
  };

  const currentSize = (size) => {
    console.log(size);

    const sizes = filterSize(size);
    console.log(sizes);
    setSelectedProduct(sizes);
    //set available product according to selected size
    setSelectedSize(size);
    //set currently selected size
  };

  const clearFilters = () => {
    setImages(defaultImages);
    setAvailableSizes([]);
    setSelectedColor(null);
    setSelectedProduct([]);
    setSelectedSize(null);
    setQuantity(0);
  };

  const successToast = (message) => {
    toast(message, {
      className: classes.toastSuccess,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 4000,
    });
  };

  const errorToast = (message) => {
    toast(message, {
      className: classes.toastError,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 4000,
    });
  };

  const addProduct = () => {
    console.log(selectedProduct);
    console.log(quantity);
    console.log(currentUser);

    if (!currentUser) {
      props.history.push("/login");
    } else {
      if (selectedColor && selectedSize && quantity) {
        successToast("item added successfully to the cart");

        let priceAfterDiscount =
          parseInt(product.price) - parseInt(product.discount);
        console.log(priceAfterDiscount);
        let price = quantity * priceAfterDiscount;
        console.log(price);

        let data = {
          quantity: quantity,
          product: selectedProduct[0],
          price: price,
          title: product.title,
          id: product.productId,
        };

        console.log(data);

        dispatch({
          type: "ADD_PRODUCT",
          product: data,
        });

        setSubmitError(null);
        // window.location.reload(false);
      } else {
        setSubmitError("Please select a product");
      }
    }
  };

  const addReview = async (data) => {
    if (!currentUser) {
      props.history.push("/login");
    } else {
      try {
        setLoading(true);

        let reviewId = uuidv4();

        const review = await db
          .collection("reviews")
          .doc(reviewId)
          .set({
            productId: product.productId,
            userId: currentUser.uid,
            username: currentUser.firstname + " " + currentUser.lastname,
            date: moment().format("DD-MM-YYYY"),
            review: data.review,
          });
        console.log(review);
        await getReviews();
        successToast("Review added successfully");
        setLoading(false);
      } catch (err) {
        console.log(err);
        errorToast("Something went wrong. Please try again later");
        setLoading(false);
      }
    }
  };

  const addToWishList = async () => {
    setLoading(true);
    try {
      let wishList = [];

      wishList.push(product.productId);

      //see there is an document exists
      const document = await db
        .collection("wish-list")
        .doc(currentUser.uid)
        .get();
      console.log(document);

      if (document.exists === true) {
        const data = await db
          .collection("wish-list")
          .doc(currentUser.uid)
          .update({
            userId: currentUser.uid,
            wishList: firebase.firestore.FieldValue.arrayUnion(
              product.productId
            ),
          });

        successToast(
          "Item added successfully to wish list. You can manage your wish list in settings"
        );

        setLoading(false);
      } else {
        const data = await db.collection("wish-list").doc(currentUser.uid).set({
          userId: currentUser.uid,
          wishList: wishList,
        });

        console.log(data, "new");
        successToast(
          "Item added successfully to wish list. You can manage your wish list in settings"
        );

        setLoading(false);
      }
    } catch (err) {
      errorToast("Something went wrong. Please try again later");
      setLoading(false);
      console.log(err);
    }
  };

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
            }}
          >
            <Box>
              {product ? (
                <>
                  <Grid container direction="row">
                    <Grid
                      item
                      md={6}
                      xs={12}
                      sm={6}
                      className={classes.container}
                    >
                      <ProductImageGallery images={images} />
                    </Grid>

                    <Grid
                      container
                      item
                      md={6}
                      xs={12}
                      sm={6}
                      className={classes.container}
                      style={{ textAlign: "left" }}
                    >
                      <Breadcrumbs
                        aria-label="breadcrumb"
                        style={{ marginBottom: "25px" }}
                      >
                        <Typography color="textPrimary">
                          {product.category.label}
                        </Typography>
                        <Typography color="textPrimary">
                          {product.subcategory.label}
                        </Typography>
                      </Breadcrumbs>

                      <Heading text={product.title} />

                      <Price
                        text={parseInt(product.price)}
                        discount={parseInt(product.discount)}
                        label={product.label}
                      />

                      <SubHeading text="available Colors" />

                      <Grid
                        item
                        md={12}
                        sm={12}
                        xs={12}
                        style={{ marginBottom: "25px" }}
                      >
                        {availableColors.map((color) => (
                          <ColorIcon
                            size="40px"
                            color={color}
                            currentColor={currentColor}
                            selectedColor={selectedColor}
                          />
                        ))}
                      </Grid>

                      <Grid container alignItems="center">
                        <Sizechart />

                        <Divider />
                      </Grid>

                      <Grid
                        item
                        md={12}
                        sm={12}
                        xs={12}
                        style={{ marginBottom: "25px" }}
                      >
                        <Divider />
                      </Grid>

                      {avalableSizes.length > 0 ? (
                        <Grid
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          style={{ marginBottom: "25px" }}
                        >
                          {avalableSizes.map((item) => (
                            <SizeIcon
                              index={item}
                              iconSize="40px"
                              size={item.size.label}
                              currentSize={currentSize}
                              selectedSize={selectedSize}
                              selectedProduct={selectedProduct}
                            />
                          ))}
                        </Grid>
                      ) : (
                        <Grid
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          style={{
                            marginBottom: "25px",
                            color: "rgba(0, 0, 0, 0.8)",
                          }}
                        >
                          <Typography variant="body2" color="initial">
                            Please select a color
                          </Typography>
                        </Grid>
                      )}

                      <SubHeading text="Avalable Quantity" />

                      {selectedProduct.length === 1 ? (
                        <Grid
                          item
                          container
                          md={12}
                          sm={12}
                          xs={12}
                          style={{ marginBottom: "25px" }}
                        >
                          {parseInt(selectedProduct[0].quantity) > 0 ? (
                            <Grid item md={12} sm={12} xs={12}>
                              In Stock
                            </Grid>
                          ) : (
                            <Grid item md={12} sm={12} xs={12}>
                              No Products Available
                            </Grid>
                          )}
                        </Grid>
                      ) : (
                        <Grid
                          item
                          container
                          md={12}
                          sm={12}
                          xs={12}
                          style={{
                            marginBottom: "25px",
                            color: "rgba(0, 0, 0, 0.8)",
                          }}
                        >
                          <Typography variant="body2" color="initial">
                            Please select a size
                          </Typography>
                        </Grid>
                      )}

                      <SubHeading text="Select Quantity" />

                      <Grid
                        container
                        item
                        md={12}
                        sm={12}
                        xs={12}
                        style={{
                          marginBottom: "25px",
                          direction: "row",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Grid item>
                          <ButtonGroup
                            style={{
                              marginRight: "25px",
                            }}
                          >
                            <Button
                              aria-label="reduce"
                              onClick={() => {
                                decrement();
                              }}
                            >
                              <RemoveIcon fontSize="small" />
                            </Button>
                            <Button
                              aria-label="increase"
                              onClick={() => {
                                increment();
                              }}
                            >
                              <AddIcon fontSize="small" />
                            </Button>
                          </ButtonGroup>
                        </Grid>
                        <Grid item>{quantity}</Grid>
                      </Grid>

                      {quantityError ? (
                        <Grid
                          item
                          md={12}
                          sm={12}
                          xs={12}
                          style={{ marginBottom: "25px", color: "red" }}
                        >
                          {quantityError}
                        </Grid>
                      ) : null}

                      <Grid
                        item
                        md={12}
                        sm={12}
                        xs={12}
                        style={{ marginBottom: "25px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            onClick={clearFilters}
                            variant="overline"
                            style={{
                              color: "#FF0000",
                              marginRight: "8px",
                              fontSize: "14px",
                              cursor: "pointer",
                            }}
                          >
                            <b>Clear filters</b>
                          </Typography>
                          <HighlightOffOutlinedIcon
                            fontSize="small"
                            style={{ color: "#FF0000", cursor: "pointer" }}
                          />
                        </div>
                      </Grid>

                      <Grid
                        item
                        md={12}
                        sm={12}
                        xs={12}
                        style={{
                          float: "left",
                        }}
                      >
                        <Button
                          style={{
                            color: "white",
                            height: "48px",
                            // border: "2px solid #3699ff",
                          }}
                          fullWidth
                          onClick={addProduct}
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          startIcon={<ShoppingCartOutlinedIcon />}
                        >
                          <Typography
                            variant="overline"
                            color="initial"
                            style={{ fontSize: "14px" }}
                          >
                            <b> Add to Card</b>
                          </Typography>
                        </Button>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        sm={12}
                        xs={12}
                        style={{
                          float: "left",
                          marginTop: "15px",
                          marginBottom: "15px",
                        }}
                      >
                        <Button
                          style={{
                            color: "#FF0000",
                            border: "2px solid #FF0000",
                            height: "48px",
                          }}
                          fullWidth
                          onClick={addToWishList}
                          variant="outlined"
                          color="primary"
                          className={classes.button}
                          startIcon={<FavoriteBorderOutlinedIcon />}
                        >
                          <Typography
                            variant="overline"
                            color="initial"
                            style={{ fontSize: "14px" }}
                          >
                            <b>Add to Wish List</b>
                          </Typography>
                        </Button>
                      </Grid>

                      <Grid
                        item
                        md={12}
                        sm={12}
                        xs={12}
                        style={{ float: "left" }}
                      >
                        <Typography
                          variant="body2"
                          color="initial"
                          style={{ color: "red" }}
                        >
                          {submitError}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item md={12} xs={12} sm={12}>
                    <Divider />
                  </Grid>

                  <Grid
                    item
                    md={12}
                    xs={12}
                    sm={12}
                    style={{
                      textAlign: "left",
                      paddingBottom: "25px",
                      marginBottom: "50px",
                    }}
                    className={classes.subcontainer}
                  >
                    {/* <Tabs
                      specification={product.specification}
                      description={product.description}
                      policy={product.description}
                    /> */}
                    <Accordion
                      specification={product.specification}
                      description={product.description}
                      policy={product.description}
                    />
                  </Grid>
                </>
              ) : (
                <Grid container direction="row">
                  <Grid
                    item
                    md={12}
                    xs={12}
                    sm={12}
                    className={classes.container}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <img
                      style={{ width: "100%", maxWidth: "450px" }}
                      src={error}
                      alt="error"
                    />
                  </Grid>
                </Grid>
              )}
            </Box>

            {product ? (
              <Box>
                <Grid container direction="row" className={classes.container}>
                  <Grid item md={12} xs={12} sm={12}>
                    <form onSubmit={handleSubmit(addReview)}>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        sm={12}
                        style={{ textAlign: "left" }}
                      >
                        <SubHeading text="Reviews By our Customers" />

                        <TextField
                          id="review"
                          name="review"
                          placeholder="Share your experience"
                          margin="normal"
                          multiline
                          rows={4}
                          color="primary"
                          variant="standard"
                          InputLabelProps={{
                            shrink: true,
                            className: classes.inputLabel,
                          }}
                          InputProps={{
                            className: classes.input,
                            autoComplete: "false",
                          }}
                          fullWidth
                          inputRef={register({
                            required: "review Required",
                          })}
                          error={errors.review ? true : false}
                          helperText={
                            errors.review ? errors.review.message : null
                          }
                        />
                      </Grid>

                      <Grid
                        item
                        md={3}
                        sm={3}
                        xs={12}
                        style={{ marginTop: "25px", marginBottom: "25px" }}
                      >
                        <Button
                          variant="outlined"
                          className={classes.input}
                          style={{
                            color: "black",
                            border: "2px solid black",
                            height: "48px",
                          }}
                          type="submit"
                          fullWidth
                        >
                          <Typography
                            variant="overline"
                            color="initial"
                            style={{ fontSize: "16px" }}
                          >
                            <b>ADD REVIEW</b>
                          </Typography>
                        </Button>
                      </Grid>
                    </form>
                  </Grid>

                  <Grid
                    item
                    container
                    alignItems="flex-start"
                    md={12}
                    sm={12}
                    xs={12}
                    style={{
                      textAlign: "left",
                    }}
                  >
                    {reviews.map((review) => (
                      <SingleReview
                        name={review.username}
                        date={review.date}
                        review={review.review}
                      />
                    ))}
                  </Grid>
                </Grid>
              </Box>
            ) : null}
          </Container>
          <Footer />
        </>
      )}
    </>
  );
}
