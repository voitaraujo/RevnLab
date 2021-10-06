import React, { memo, useState } from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { InputNumber } from "../../components/inputFormat";

interface IProps {
  produto: IProduto;
  index: number;
  changeHandler: (item: IProduto, index: number) => void;
}

interface IProduto {
  Refdt: string;
  Filial: string;
  DLCod: string;
  PROD: string;
  PRODUTO: string;
  Qtd: number | string | null;
}

const ListItemCustom = ({ produto, index, changeHandler }: IProps) => {
  const [item, setItem] = useState<IProduto>(produto);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItem({ ...item, Qtd: event.target.value });
  };

  return (
    <ListItem>
      <ListItemText primary={item.PRODUTO} secondary={`Código: ${item.PROD}`} />
      <ListItemSecondaryAction style={{ width: "10%", minWidth: "100px" }}>
        <InputNumber
          decimals={0}
          onChange={(event) => handleChange(event)}
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
