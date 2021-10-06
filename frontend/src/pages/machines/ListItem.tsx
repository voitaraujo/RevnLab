import React, { useState, memo } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { InputNumber } from "../../components/inputFormat";

interface IProduto {
  DLCod: string;
  PROD: string;
  SEL: string;
  PRODUTO: string;
  Qtd: number | string | null;
  Refdt: string;
  Filial: string;
  CHAPA: string;
}

interface IProps {
  produto: IProduto;
  index: number;
  changeHandler: (item: IProduto, index: number) => void;
}

const ListItemCustom = ({ produto, index, changeHandler }: IProps) => {
    const [item, setItem] = useState(produto)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setItem({...item, Qtd: event.target.value})
    }
  return (
    <ListItem>
      <ListItemIcon>{item.SEL}</ListItemIcon>
      <ListItemText primary={item.PRODUTO} secondary={`Código: ${item.PROD}`} />
      <ListItemSecondaryAction style={{ width: "10%", minWidth: "100px" }}>
        <InputNumber
          decimals={0}
          onChange={handleChange}
          onBlur={() => changeHandler(item, index)}
          disabled={false}
          label="Qtd"
          value={item.Qtd}
          type="outlined"
          focus={false}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export const ListItemMemo = memo(ListItemCustom);
