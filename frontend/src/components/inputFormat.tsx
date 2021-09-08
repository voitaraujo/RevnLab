import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

type IProps = {
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  label: string;
  disabled: boolean;
  value: string | number | null;
  type?: "filled" | "outlined" | "standard";
  focus: boolean
}

type IPropsNumber  = {
  decimals: number;
} & IProps

type IPropsPhone  = {
  mask: string;
} & IProps

let CasasDecimais = 0;
let PhoneMask = '';

function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      decimalScale={CasasDecimais}
      thousandSeparator="."
      decimalSeparator=","
      fixedDecimalScale={true}
      isNumericString
      prefix=""
      allowNegative={false}
      allowLeadingZeros={false}
      allowEmptyFormatting={false}
    />
  );
}

function PhoneFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      isNumericString
      allowEmptyFormatting={false}
      format={PhoneMask}
      mask="_"
    />
  );
}

export const InputNumber = (props: IPropsNumber): JSX.Element => {
  const classes = useStyles();
  const [values, setValues] = useState({
    numberformat: "1320",
  });

  useEffect(() => {
    CasasDecimais = props.decimals && props.decimals;
  }, [props.decimals]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });

    props.onChange(event);
  };

  return (
    <div className={classes.root}>
      <TextField
        name="numberformat"
        label={props.label}
        disabled={props.disabled}
        onChange={handleChange}
        InputProps={{
          inputComponent: NumberFormatCustom as any,
        }}
        variant={props.type}
        value={props.value}
        autoFocus={props.focus}
      />
    </div>
  );
};

export const InputPhone = (props: IPropsPhone): JSX.Element => {
  const classes = useStyles();
  const [values, setValues] = useState({
    numberformat: "1320",
  });

  useEffect(() => {
    PhoneMask = props.mask && props.mask;
  }, [props.mask]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });

    props.onChange(event);
  };

  return (
    <div className={classes.root}>
      <TextField
        name="numberformat"
        label={props.label}
        disabled={props.disabled}
        onChange={handleChange}
        InputProps={{
          inputComponent: PhoneFormatCustom as any,
        }}
        variant={props.type}
        value={props.value}
        autoFocus={props.focus}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);
