import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { app, db } from "../util/config";

// materual ui
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import { CircularProgress, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//componentsq
import Label from "../components/Label";

import l from "../images/login.png";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
}));

export default function Register(props) {
  const classes = useStyles();

  //hook form
  const { register, handleSubmit, errors } = useForm();
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAuthStatus = async () => {
    return new Promise((resolve, reject) => {
      try {
        app.auth().onAuthStateChanged((user) => {
          console.log("userChecked:", user);
          resolve(user);
        });
      } catch {
        reject("api failed");
      }
    });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);

    const { firstname, lastname, email, password } = data;

    try {
      const newUser = await app
        .auth()
        .createUserWithEmailAndPassword(email, password);

      const user = await checkAuthStatus();

      let userId = user.uid;
      console.log(user);

      const data = await db.collection("users").doc(userId).set({
        uid: userId,
        firstname,
        lastname,
        email,
      });

      console.log(data);
      setRegisterError(null);
      props.history.push("/");
      setLoading(false);
    } catch (err) {
      console.log(err);
      setRegisterSuccess(null);

      if (err.code === "auth/email-already-in-use") {
        setRegisterError("User already exists");
      } else {
        setRegisterError(err.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className={classes.paper}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Container component="main" maxWidth="false">
          <Grid container alignItems="center" justify="center">
            <Grid item md={6} xs={12} sm={12} style={{ padding: "48px" }}>
              <img src={l} alt="asd" style={{ width: "100%" }} />
            </Grid>

            <Grid item md={6} xs={12} sm={12} style={{ padding: "96px" }}>
              <Typography component="h1" variant="h5">
                Register
              </Typography>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={classes.form}
                noValidate
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Label text="First Name" />

                    <TextField
                      id="firstname"
                      name="firstname"
                      placeholder="John"
                      margin="normal"
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
                        errors.firstname ? errors.username.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Label text="Last Name" />

                    <TextField
                      id="lastname"
                      name="lastname"
                      placeholder="Doe"
                      margin="normal"
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

                  <Grid item xs={12}>
                    <Label text="Email" />

                    <TextField
                      id="email"
                      name="email"
                      placeholder="JohnDoe@gmail.com"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      variant="standard"
                      inputRef={register({
                        required: "Email Required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      error={errors.email ? true : false}
                      helperText={errors.email ? errors.email.message : null}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Label text="Password" />

                    <TextField
                      id="password"
                      name="password"
                      type="password"
                      placeholder="***********"
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      variant="standard"
                      inputRef={register({
                        required: "Password Required",
                        minLength: {
                          value: 6,
                          message: "Password is too short",
                        },
                      })}
                      error={errors.password ? true : false}
                      helperText={
                        errors.password ? errors.password.message : null
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={4}>
                    <Button
                      style={{
                        color: "#1b1b28",
                        border: "2px solid #1b1b28",
                      }}
                      type="submit"
                      fullWidth
                      variant="outlined"
                      color="primary"
                    >
                      <b>Register</b>
                    </Button>
                  </Grid>

                  {registerError ? (
                    <Grid item xs={12}>
                      <Alert severity="error">{registerError}</Alert>
                    </Grid>
                  ) : null}

                  {registerSuccess ? (
                    <Grid item xs={12}>
                      <Alert severity="success">{registerSuccess}</Alert>
                    </Grid>
                  ) : null}

                  <Grid item xs={12}>
                    {"Already Registered ? Login" + " "}
                    <Link to="/login">
                      <b>Here</b>
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
}
