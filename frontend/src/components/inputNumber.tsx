import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { InputBaseComponentProps } from "@material-ui/core";
import { createRef } from "react";

// interface INumberFormat {
//   inputRef: React.Ref<HTMLInputElement>;
//   onChange: (value: IParams) => void;
//   name: string;
//   value: string;
// }

// interface IParams {
//   target: ITargetObject;
// }

// interface ITargetObject {
//   name: string;
//   value: string;
// }

interface IProps {
  decimals: number;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  label: string;
  disabled: boolean;
  value: string | number;
}

// const NumberFormatCustom = (props: INumberFormat): React.ElementType<InputBaseComponentProps> => {
//   const { inputRef, onChange, ...other } = props;

//   return (
//     <NumberFormat
//       {...other}
//       getInputRef={inputRef}
//       onValueChange={(values) => {
//         onChange({
//           target: {
//             name: props.name,
//             value: values.value,
//           },
//         });
//       }}
//       decimalScale={Decimais}
//       thousandSeparator="."
//       decimalSeparator=","
//       fixedDecimalScale={true}
//       isNumericString
//       prefix=""
//       allowNegative={false}
//     />
//   );
// };

// NumberFormatCustom.propTypes = {
//   inputRef: PropTypes.func.isRequired,
//   name: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

export const InputNumber = (props: IProps): JSX.Element => {
  const classes = useStyles();
  const inputRef = createRef<HTMLDivElement>();
  const [values, setValues] = React.useState({
    numberformat: "1320",
  });

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
        innerRef={inputRef}
        name="numberformat"
        label={props.label}
        disabled={props.disabled}
        className={clsx(classes.margin, classes.textField)}
        onChange={handleChange}
        InputProps={{
          inputComponent: (props: InputBaseComponentProps) => (
            <NumberFormat
              getInputRef={inputRef}
              //   onValueChange={(values) => {}}
              decimalScale={props.decimals}
              thousandSeparator="."
              decimalSeparator=","
              fixedDecimalScale={true}
              isNumericString
              prefix=""
              allowNegative={false}
            />
          ),
        }}
        variant="standard"
        value={props.value}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "100%",
    "& #outlined-start-adornment": {
      border: "none",
      borderBottom: "none",
    },
    "& #outlined-start-adornment:focus": {
      border: "none !important",
      borderBottom: "none !important",
    },
  },
}));
