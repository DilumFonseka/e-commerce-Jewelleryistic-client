import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";

import { app, db } from "../util/config";

// materual ui
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import { CircularProgress, Container } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

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

export default function Login(props) {
  const classes = useStyles();
  let history = useHistory();

  //hook form
  const { register, handleSubmit, errors } = useForm();
  const [loginErrors, setLoginErrors] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data);

    const { email, password } = data;

    try {
      const user = await app.auth().signInWithEmailAndPassword(email, password);
      console.log(user);

      if (user) {
        setLoginSuccess("User has successfully logged in");
        setLoginErrors(null);
        history.goBack();
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoginSuccess(null);

      if (err.code === "auth/user-not-found") {
        setLoginErrors("User not found");
      }

      if (err.code === "auth/wrong-password") {
        setLoginErrors("Invalid password");
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
                Login
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
                      style={{ color: "#1b1b28", border: "2px solid #1b1b28" }}
                      type="submit"
                      fullWidth
                      variant="outlined"
                      color="primary"
                    >
                      <b>Login</b>
                    </Button>
                  </Grid>

                  {loginErrors ? (
                    <Grid item xs={12}>
                      <Alert severity="error">{loginErrors}</Alert>
                    </Grid>
                  ) : null}

                  {loginSuccess ? (
                    <Grid item xs={12}>
                      <Alert severity="success">{loginSuccess}</Alert>
                    </Grid>
                  ) : null}

                  <Grid item xs={12}>
                    {"Not a registered user ? Register" + " "}
                    <Link to="/register">
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
