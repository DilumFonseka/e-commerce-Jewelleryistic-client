import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

//materialui
import {
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Breadcrumbs,
  FormHelperText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//icons
import SettingsIcon from "@material-ui/icons/Settings";
import HomeIcon from "@material-ui/icons/Home";

import SettingsSideBar from "../components/SettingsSideBar";
import Label from "../components/Label";

import { db, app } from "../util/config";
import { AuthContext } from "../util/AuthProvider";
import Alert from "@material-ui/lab/Alert";
import SubHeading from "../components/SubHeading";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
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
  boxContainer: {
    paddingTop: "25px",
    paddingLeft: "25px",
    paddingRight: "25px",
    paddingBottom: "25px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "25px",
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
}));

export default function Settings() {
  const classes = useStyles();

  //hook form
  const { register, handleSubmit, errors, control } = useForm({
    username: "",
    mobile: "",
    address: "",
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    errors: errors2,
  } = useForm();

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    errors: errors3,
  } = useForm();

  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobile, setMobile] = useState("");
  const [addressOne, setAddressOne] = useState("");
  const [addressTwo, setAddressTwo] = useState("");
  const [zip, setZip] = useState("");
  const [district, setDistrict] = useState(null);
  const [province, setProvince] = useState(null);
  const [currentEmail, setCurrentEmail] = useState("");

  const [emailChangeError, setEmailChangeError] = useState(null);
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(null);

  const [passwordChangeError, setPasswordChangeError] = useState(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);

  console.log(currentUser.uid);
  console.log(currentUser.user);

  const districts = [
    {
      label: "Jaffna",
      value: "Jaffna",
    },
    {
      label: "Kilinochchi",
      value: "Kilinochchi",
    },
    {
      label: "Mannar",
      value: "Mannar",
    },
    {
      label: "Mullaitivu",
      value: "Mullaitivu",
    },
    {
      label: "Vavuniya",
      value: "Vavuniya",
    },
    {
      label: "Puttalam",
      value: "Puttalam",
    },
    {
      label: "Kurunegala",
      value: "Kurunegala",
    },
    {
      label: "Gampaha",
      value: "Gampaha",
    },
    {
      label: "Colombo",
      value: "Colombo",
    },
    {
      label: "Kalutara",
      value: "Kalutara",
    },
    {
      label: "Anuradhapura",
      value: "Anuradhapura",
    },
    {
      label: "Polonnaruwa",
      value: "Polonnaruwa",
    },
    {
      label: "Matale",
      value: "Matale",
    },
    {
      label: "Kandy",
      value: "Kandy",
    },
    {
      label: "Nuwara Eliya",
      value: "Nuwara Eliya",
    },
    {
      label: "Kegalle",
      value: "Kegalle",
    },
    {
      label: "Ratnapura",
      value: "Ratnapura",
    },
    {
      label: "Trincomalee",
      value: "Trincomalee",
    },
    {
      label: "Batticaloa",
      value: "Batticaloa",
    },
    {
      label: "Ampara",
      value: "Ampara",
    },
    {
      label: "Badulla",
      value: "Badulla",
    },
    {
      label: "Monaragala",
      value: "Monaragala",
    },
    {
      label: "Hambantota",
      value: "Hambantota",
    },
    {
      label: "Matara",
      value: "Matara",
    },
    {
      label: "Galle	",
      value: "Galle	",
    },
  ];

  const provinces = [
    {
      label: "Northern",
      value: "Northern",
    },
    {
      label: "North Western",
      value: "NorthWestern",
    },
    {
      label: "Western",
      value: "Western",
    },
    {
      label: "North Central",
      value: "NorthCentral",
    },
    {
      label: "Central",
      value: "Central",
    },
    {
      label: "Sabaragamuwa",
      value: "Sabaragamuwa",
    },
    {
      label: "Eastern",
      value: "Eastern",
    },
    {
      label: "Uva",
      value: "Uva",
    },
    {
      label: "Southern",
      value: "Southern",
    },
  ];

  const getUserData = async () => {
    setLoading(true);

    try {
      const userdata = await db.collection("users").doc(currentUser.uid).get();

      console.log(userdata.data());

      if (userdata.data().firstname) {
        setFirstname(userdata.data().firstname);
      }

      if (userdata.data().lastname) {
        setLastname(userdata.data().lastname);
      }

      if (userdata.data().mobile) {
        setMobile(userdata.data().mobile);
      }

      if (userdata.data().addressOne) {
        setAddressOne(userdata.data().addressOne);
      }

      if (userdata.data().addressTwo) {
        setAddressTwo(userdata.data().addressTwo);
      }

      if (userdata.data().district) {
        setDistrict(userdata.data().district);
      }

      if (userdata.data().province) {
        setProvince(userdata.data().province);
      }

      if (userdata.data().zip) {
        setZip(userdata.data().zip);
      }

      setCurrentEmail(userdata.data().email);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const saveUserData = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      const result = await db.collection("users").doc(currentUser.uid).update({
        firstname: data.firstname,
        lastname: data.lastname,
        mobile: data.mobile,
        addressOne: data.addressOne,
        addressTwo: data.addressTwo,
        district: data.district,
        province: data.province,
        zip: data.zip,
      });

      window.location.reload();
      console.log(result);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const changeEmail = async (data) => {
    setLoading(true);
    console.log(currentEmail, data.password);
    try {
      const user = await app
        .auth()
        .signInWithEmailAndPassword(currentEmail, data.password);

      const result = await user.user.updateEmail(data.newEmail);
      console.log(result);

      const doc = await db
        .collection("users")
        .doc(currentUser.uid)
        .update({ email: data.newEmail });

      setEmailChangeSuccess("Email updated successfully");
      setEmailChangeError(null);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setEmailChangeError(err.message);
      setEmailChangeSuccess(null);
      setLoading(false);
    }
  };

  const changePassword = async (data) => {
    setLoading(true);
    console.log(currentEmail, data.password);
    try {
      const user = await app
        .auth()
        .signInWithEmailAndPassword(currentEmail, data.currentPassword);

      const result = await user.user.updatePassword(data.newPassword);
      console.log(result);

      setPasswordChangeSuccess("Password updated successfully");
      setPasswordChangeError(null);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setPasswordChangeError(err.message);
      setPasswordChangeSuccess(null);
      setLoading(false);
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
                className={classes.boxContainer}
                style={{
                  backgroundColor: "white",
                  borderRadius: "4px",
                  boxShadow: `0px 10px 38px rgba(221, 230, 237, 1)`,
                  textAlign: "left",
                }}
              >
                <form>
                  <Grid container spacing={1}>
                    <SubHeading text="Personal Information" />
                    <Grid item md={6} sm={12} xs={12}>
                      <Label text="First Name" />

                      <TextField
                        id="firstname"
                        name="firstname"
                        placeholder="JohnDoe"
                        margin="normal"
                        defaultValue={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        variant="standard"
                        inputRef={register({
                          required: "First Name Required",
                        })}
                        error={errors.firstname ? true : false}
                        helperText={
                          errors.firstname ? errors.firstname.message : null
                        }
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Label text="Last Name" />

                      <TextField
                        id="lastname"
                        name="lastname"
                        placeholder="JohnDoe"
                        margin="normal"
                        defaultValue={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        variant="standard"
                        inputRef={register({
                          required: "Last Name Required",
                        })}
                        error={errors.lastname ? true : false}
                        helperText={
                          errors.lastname ? errors.lastname.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                      style={{ marginBottom: "25px" }}
                    >
                      <Label text="Mobile Number" />

                      <TextField
                        id="mobile"
                        name="mobile"
                        placeholder="078-5555555"
                        margin="normal"
                        defaultValue={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputRef={register({
                          required: "Mobile Number is Required",
                        })}
                        fullWidth
                        variant="standard"
                        error={errors.mobile ? true : false}
                        helperText={
                          errors.mobile ? errors.mobile.message : null
                        }
                      />
                    </Grid>

                    <SubHeading text="Delivery Information" />

                    <Grid item md={6} sm={12} xs={12}>
                      <Label text="1st Address Line" />

                      <TextField
                        id="addressOne"
                        name="addressOne"
                        placeholder="224B, Wajira road"
                        margin="normal"
                        defaultValue={addressOne}
                        onChange={(e) => setAddressOne(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputRef={register({
                          required: "1st Address Line is Required",
                        })}
                        fullWidth
                        variant="standard"
                        error={errors.addressOne ? true : false}
                        helperText={
                          errors.addressOne ? errors.addressOne.message : null
                        }
                      />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Label text="2nd Address Line" />

                      <TextField
                        id="addressTwo"
                        name="addressTwo"
                        placeholder="Bambalapitiya"
                        margin="normal"
                        defaultValue={addressTwo}
                        onChange={(e) => setAddressTwo(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputRef={register({
                          required: "1st Address Line is Required",
                        })}
                        fullWidth
                        variant="standard"
                        error={errors.addressTwo ? true : false}
                        helperText={
                          errors.addressTwo ? errors.addressTwo.message : null
                        }
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Label text="District" />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Controller
                        name="district"
                        as={Select}
                        options={districts}
                        control={control}
                        defaultValue={district}
                        rules={{ required: "District is required" }}
                      />

                      <FormHelperText style={{ color: "red" }}>
                        {errors.district && errors.district.message}
                      </FormHelperText>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                      <Label text="Province" />
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Controller
                        name="province"
                        as={Select}
                        options={provinces}
                        control={control}
                        defaultValue={province}
                        rules={{ required: "Province is required" }}
                      />

                      <FormHelperText style={{ color: "red" }}>
                        {errors.province && errors.province.message}
                      </FormHelperText>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}></Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <Label text="Zip Code" />

                      <TextField
                        id="zip"
                        name="zip"
                        placeholder="70000"
                        margin="normal"
                        defaultValue={zip}
                        onChange={(e) => setZip(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputRef={register({
                          required: "Zip Code is Required",
                        })}
                        fullWidth
                        variant="standard"
                        error={errors.zip ? true : false}
                        helperText={errors.zip ? errors.zip.message : null}
                      />
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}></Grid>

                    <Grid
                      item
                      md={3}
                      sm={6}
                      xs={12}
                      style={{ marginTop: "15px" }}
                    >
                      <Button
                        className={classes.input}
                        style={{
                          color: "#1b1b28",
                          border: "2px solid #1b1b28",
                        }}
                        onClick={handleSubmit(saveUserData)}
                        fullWidth
                        variant="outlined"
                        color="secondary"
                      >
                        <b>SAVE</b>
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                <form
                  onSubmit={handleSubmit2(changeEmail)}
                  style={{ marginTop: "50px", width: "100%" }}
                >
                  <Grid container style={{ flexGrow: "1" }}>
                    <SubHeading text="Change Email Address" />

                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                      className={classes.paddingForRight}
                    >
                      <Label text="New Email" />

                      <TextField
                        id="newEmail"
                        name="newEmail"
                        placeholder="JohnDoe@gmail.com"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        variant="standard"
                        inputRef={register2({
                          required: "newEmail Required",
                        })}
                        error={errors2.newEmail ? true : false}
                        helperText={
                          errors2.newEmail ? errors2.newEmail.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                      className={classes.paddingForLeft}
                    >
                      <Label text="Password" />

                      <TextField
                        id="password"
                        name="password"
                        type="password"
                        placeholder="**************"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        variant="standard"
                        inputRef={register2({
                          required: "password Required",
                        })}
                        error={errors2.password ? true : false}
                        helperText={
                          errors2.password ? errors2.password.message : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      md={3}
                      sm={6}
                      xs={12}
                      style={{ marginTop: "15px" }}
                    >
                      <Button
                        className={classes.input}
                        style={{
                          color: "#1b1b28",
                          border: "2px solid #1b1b28",
                        }}
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="secondary"
                      >
                        <b>CHANGE</b>
                      </Button>
                    </Grid>

                    {emailChangeError ? (
                      <Grid item xs={12}>
                        <Alert severity="error">{emailChangeError}</Alert>
                      </Grid>
                    ) : null}

                    {emailChangeSuccess ? (
                      <Grid item xs={12}>
                        <Alert severity="success">{emailChangeSuccess}</Alert>
                      </Grid>
                    ) : null}
                  </Grid>
                </form>

                <form
                  onSubmit={handleSubmit3(changePassword)}
                  style={{ marginTop: "50px", width: "100%" }}
                >
                  <Grid container style={{ flexGrow: "1" }}>
                    <SubHeading text="Change Password" />

                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                      className={classes.paddingForRight}
                    >
                      <Label text="Current Password" />

                      <TextField
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="**************"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        variant="standard"
                        inputRef={register3({
                          required: "currentPassword Required",
                        })}
                        error={errors3.currentPassword ? true : false}
                        helperText={
                          errors3.currentPassword
                            ? errors3.currentPassword.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                      className={classes.paddingForLeft}
                    >
                      <Label text="New Password" />

                      <TextField
                        id="newPassword"
                        name="newPassword"
                        type="newPassword"
                        placeholder="**************"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        fullWidth
                        variant="standard"
                        inputRef={register3({
                          required: "newPassword Required",
                        })}
                        error={errors3.newPassword ? true : false}
                        helperText={
                          errors3.newPassword
                            ? errors3.newPassword.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid
                      item
                      md={3}
                      sm={6}
                      xs={12}
                      style={{ marginTop: "15px" }}
                    >
                      <Button
                        className={classes.input}
                        style={{
                          color: "#1b1b28",
                          border: "2px solid #1b1b28",
                          marginBottom: "25px",
                        }}
                        type="submit"
                        fullWidth
                        variant="outlined"
                        color="secondary"
                      >
                        <b>CHANGE</b>
                      </Button>
                    </Grid>

                    {passwordChangeError ? (
                      <Grid item xs={12}>
                        <Alert severity="error">{passwordChangeError}</Alert>
                      </Grid>
                    ) : null}

                    {passwordChangeSuccess ? (
                      <Grid item xs={12}>
                        <Alert severity="success">
                          {passwordChangeSuccess}
                        </Alert>
                      </Grid>
                    ) : null}
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Container>

          <Footer />
        </>
      )}
    </>
  );
}
