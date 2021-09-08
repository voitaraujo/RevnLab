import React from "react";
import { useHistory } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { ExitToApp, Apartment } from "@material-ui/icons";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0),
    },
    paper: {
      paddingBottom: 50,
    },
    list: {
      marginBottom: theme.spacing(2),
    },
    subheader: {
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      top: "auto",
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: "absolute",
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: "0 auto",
    },
  })
);

export default function BottomAppBar() {
  const classes = useStyles();
  const history = useHistory();

  const returnToStorages = () => {
    window.sessionStorage.setItem("ScreenDesc", "Depósitos");
    history.push("/inventario");
  };

  const logOut = () => {
    window.sessionStorage.clear();
    history.push("/");
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => logOut()}
          >
            <ExitToApp />
          </IconButton>
          <Fab
            color="secondary"
            aria-label="add"
            className={classes.fabButton}
            onClick={() => returnToStorages()}
          >
            <Apartment />
          </Fab>
          <div className={classes.grow} />
          <Typography gutterBottom variant="inherit">
            {window.sessionStorage.getItem("ScreenDesc")}
          </Typography>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
