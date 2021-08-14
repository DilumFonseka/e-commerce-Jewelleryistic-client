import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Photo from "../images/brand1.jpeg";
import CallIcon from "@material-ui/icons/Call";
import { Button, Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import MailIcon from "@material-ui/icons/Mail";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 1000,
  },
  //   image: {
  //     width: 200,
  //     height: 200,
  //   },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
    width: 200,
    height: 200,
  },
  iconSpace: {
    marginLeft: theme.spacing(1),
    fontSize: "12px",
    marginBottom: "30px",
    textAlign: "left",
  },
  addButton: {
    width: 100,
    height: 50,
    borderRadius: "10px",
    backgroundColor: "red",
  },
  HeadingBar: {
    minHeight: 60,
    position: "static",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: "-19px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: "-11px",
    },
    [theme.breakpoints.up("md")]: {
      width: "100%",
      marginTop: "-11px",
    },
  },
  textColor: {
    color: "white",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(8),
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(4),
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: theme.spacing(2),
    },
  },
}));
const iframe = `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.4874479086548!2d79.8746079143471!3d6.832007995062407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25adcd1f9f0d7%3A0x9eafc6fa9d2f9975!2sTemplers%20Rd%2C%20Dehiwala-Mount%20Lavinia!5e0!3m2!1sen!2slk!4v1604998421868!5m2!1sen!2slk" width="100%" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>`;

export default function ContactUs() {
  const classes = useStyles();
  function createMarkup() {
    return { __html: iframe };
  }

  return (
    <div className={classes.root}>
      <Header />
      <Container
        maxWidth="md"
        style={{ marginTop: "50px", marginBottom: "40px" }}
      >
        <Grid
          container
          justify="space-between"
          direction="row"
          style={{
            background: "#FFFFFF",
            padding: "20px",
          }}
        >
          <Grid
            container
            item
            xs={12}
            sm={4}
            md={4}
            justify="flex-start"
            alignContent="center"
            alignItems="center"
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              boxShadow: "0px 10px 38px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img src={Photo} className={classes.img} alt="Photo" />
          </Grid>

          <Grid md={1}></Grid>
          <Grid item md={7} xs={12} sm={7}>
            <h1>GET IN TOUCH</h1>
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px", marginTop: "10px" }}
            />
            <TextField
              id="outlined-basic"
              label="E-mail"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
            />
            <TextField
              id="outlined-basic"
              label="Subject"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
            />
            <TextField
              id="outlined-basic"
              label="Massage"
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
            />
            <Button className={classes.addButton}>Send</Button>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          direction="row"
          style={{
            background: "#FFFFFF",
            padding: "20px",
          }}
        >
          <Grid
            container
            alignContent="center"
            alignItems="center"
            item
            xs={12}
            sm={4}
            md={4}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "20px",
              boxShadow: "0px 10px 38px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container item direction="row">
              <LocationOnIcon style={{ fontSize: "15px" }} />

              <Typography className={classes.iconSpace}>
                <b>Jewelleryistic (PVT) LTD.</b> <br />
                NO 50, Vajira Road
                <br />
                Colombo, Sri Lanka
                <br />
                0004 <br />
              </Typography>
            </Grid>

            <Grid container item direction="row">
              <CallIcon style={{ fontSize: "15px" }} />

              <Typography className={classes.iconSpace}>
                <b>+94 74 0335 444</b>
              </Typography>
            </Grid>
            <Grid container item direction="row">
              <MailIcon style={{ fontSize: "15px" }} />

              <Typography className={classes.iconSpace}>
                <b> info@jewelleryistic.com</b>
              </Typography>
            </Grid>
            <Grid container item direction="row">
              <EventAvailableIcon style={{ fontSize: "15px" }} />

              <Typography className={classes.iconSpace}>
                Sales Department <br />
                Mon-sat : 9:00am - 5:00pm <br />
              </Typography>
            </Grid>
          </Grid>
          <Grid md={1}></Grid>
          <Grid item md={7} xs={12} sm={7}>
            <div dangerouslySetInnerHTML={createMarkup()} />
          </Grid>
        </Grid>
      </Container>
      <Grid style={{ marginTop: "10px" }} />
      <Footer />
    </div>
  );
}
