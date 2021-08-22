import React from "react";
import { makeStyles, ThemeProvider, createTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import { PALETTE_RED_PRIMARY } from "../assets/colors";

interface IProps {
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  focus?: boolean,
  disabled?: boolean;
  label: string;
  style?: React.CSSProperties;
  value: string | number;
  type?: "password" | "text"
}

export const InputSimple = (props: IProps): JSX.Element => {
  const classes = useStyles();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    props.onChange(event);
  };

  return (
    <form className={classes.root} noValidate autoComplete="off">
        <ThemeProvider theme={theme}>
      <TextField
        disabled={props.disabled}
        style={props.style}
        value={props.value}
        type={props.type}
        label={props.label}
        onChange={(e) => handleChange(e)}
        autoFocus={props.focus}
      />
      </ThemeProvider>
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

const theme = createTheme({
    palette: {
      primary: PALETTE_RED_PRIMARY,
    },
  });
  