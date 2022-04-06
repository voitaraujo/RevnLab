import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

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
      <TextField
        disabled={props.disabled}
        style={props.style}
        value={props.value}
        type={props.type}
        label={props.label}
        onChange={(e) => handleChange(e)}
        autoFocus={props.focus}
      />
    </form>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      // width: "25ch",
    },
  },
}));
