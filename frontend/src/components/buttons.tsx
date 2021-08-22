import React from "react";
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { PALETTE_RED_PRIMARY } from "../assets/colors";

interface IProps {
  disabled: boolean;
  label: string;
  onClick: (event: React.MouseEvent) => void;
  icon?: React.ReactElement;
}

export const SolidButton = (props: IProps): JSX.Element => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => props.onClick(e)}
        disabled={props.disabled}
        className={classes.margin}
        startIcon={props.icon}
      >
        {props.label}
      </Button>
    </ThemeProvider>
  );
};

export const OutlinedButton = (props: IProps): JSX.Element => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="outlined"
        color="primary"
        onClick={(e) => props.onClick(e)}
        disabled={props.disabled}
        className={classes.margin}
        startIcon={props.icon}
      >
        {props.label}
      </Button>
    </ThemeProvider>
  );
};

export const ClearButton = (props: IProps): JSX.Element => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <Button
        color="primary"
        onClick={(e) => props.onClick(e)}
        disabled={props.disabled}
        className={classes.margin}
        startIcon={props.icon}
      >
        {props.label}
      </Button>
    </ThemeProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const theme = createTheme({
  palette: {
    primary: PALETTE_RED_PRIMARY,
  },
});
