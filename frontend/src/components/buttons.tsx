import React from "react";
import {
  makeStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

interface IProps {
  disabled: boolean;
  label: string | React.ReactElement;
  onClick: (event: React.MouseEvent) => void;
  icon?: React.ReactElement;
}

export const SolidButton = (props: IProps): JSX.Element => {
  const classes = useStyles();
  return (
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
  );
};

export const OutlinedButton = (props: IProps): JSX.Element => {
  const classes = useStyles();
  return (
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
  );
};

export const ClearButton = (props: IProps): JSX.Element => {
  const classes = useStyles();
  return (
      <Button
        color="primary"
        onClick={(e) => props.onClick(e)}
        disabled={props.disabled}
        className={classes.margin}
        startIcon={props.icon}
      >
        {props.label}
      </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));
