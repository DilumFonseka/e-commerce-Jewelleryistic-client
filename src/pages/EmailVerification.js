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
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

//componentsq
import LoginContainer from "../components/LoginContainer";
import Label from "../components/Label";

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

export default function EmailVerification(props) {
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

  const sendEmailVerification = async (user) => {
    return new Promise((resolve, reject) => {
      try {
        console.log("fucntion");
        user
          .sendEmailVerification()
          .then((emailVerification) => {
            console.log(emailVerification);
            resolve();
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      } catch (err) {
        console.log(err);
        reject(err);
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
        .signInWithEmailAndPassword(email, password);

      const user = await checkAuthStatus();

      let userId = user.uid;
      console.log(user);

      const emailVerification = await sendEmailVerification(user);
      console.log(emailVerification);

      setRegisterSuccess(
        `Email verification has been sent to ${email}. Please verify your account and login again`
      );

      setRegisterError(null);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setRegisterSuccess(null);
      setLoading(false);
    }
  };

  return (
    <div className={classes.paper}>
      {loading ? (
        <CircularProgress />
      ) : (
        <LoginContainer>
          <Typography component="h1" variant="h5">
            Email Verification
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
            noValidate
          >
            <Grid container spacing={2}>
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
                    minLength: { value: 6, message: "Password is too short" },
                  })}
                  error={errors.password ? true : false}
                  helperText={errors.password ? errors.password.message : null}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12}>
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
                  <b>SEND VERIFICATION EMAIL</b>
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
        </LoginContainer>
      )}
    </div>
  );
}
