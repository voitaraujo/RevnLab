import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

interface IProps {
  onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
  label: string;
  variant: "filled" | "outlined" | "standard";
  value: string;
  children?: React.ReactNode
  disabled?: boolean
}

export const SelectControlled = (props: IProps): JSX.Element => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    props.onChange && props.onChange(event);
  };

  return (
    <FormControl variant={props.variant} className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">
        {props.label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={props.value}
        onChange={handleChange}
        label={props.label}
        disabled={props.disabled}
      >
        <MenuItem value="">
          <em>Nenhuma</em>
        </MenuItem>
        {props.children}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);
