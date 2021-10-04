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
import Tooltip from "@material-ui/core/Tooltip";

export const BottomAppBar = () => {
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
          <Tooltip
            title={
              <label style={{ fontSize: "14px", lineHeight: "20px" }}>
                Sair
              </label>
            }
            placement="top"
            arrow
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => logOut()}
            >
              <ExitToApp />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={
              <label style={{ fontSize: "14px", lineHeight: "20px" }}>
                Depósitos
              </label>
            }
            placement="top"
            arrow
          >
            <Fab
              color="secondary"
              aria-label="add"
              className={classes.fabButton}
              onClick={() => returnToStorages()}
            >
              <Apartment />
            </Fab>
          </Tooltip>
          <div className={classes.grow} />

          <div className={classes.descSize}>
            <Typography gutterBottom variant="inherit">
              {window.sessionStorage.getItem("ScreenDesc")}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

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
    descSize: {
      maxWidth: '40%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }
  })
);