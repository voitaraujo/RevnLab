import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";

import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

interface IProps {
  decimals: number;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  label: string;
  disabled: boolean;
  value: string | number | null;
  type?: "filled" | "outlined" | "standard";
}

let CasasDecimais = 0;

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

export const InputNumber = (props: IProps): JSX.Element => {
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

    props.onChange && props.onChange(event);
  };

  const handleBlur = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });

    props.onBlur && props.onBlur(event);
  };

  return (
    <div className={classes.root}>
      <TextField
        name="numberformat"
        label={props.label}
        disabled={props.disabled}
        onChange={handleChange}
        onBlur={handleBlur}
        InputProps={{
          inputComponent: NumberFormatCustom as any,
        }}
        variant={props.type}
        value={props.value}
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
