import React, { useState, memo } from "react";
import { api } from '../../services/api'

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { InputNumber } from "../../components/inputFormat";
import { IListItemProps } from './machinesTypes'
import { Toast } from '../../components/toasty'

const ListItemCustom = ({ produto }: IListItemProps) => {
  const [item, setItem] = useState({ ...produto })
  const [oldQtd, setOldQtd] = useState<string | number | null>(produto.Qtd);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItem({
      ...item,
      Qtd: event.target.value === '' || event.target.value === null ? 0 : event.target.value
    })
  }

  const handleBlur = async () => {
    try {
      await api.put('/inventory/machines/product', {
        Line: item
      })

      setOldQtd(item.Qtd)
      Toast('Salvo', 'success')
    } catch (err) {
      setItem({ ...item, Qtd: oldQtd })
      Toast('Erro', 'error')
    }
  }

  return (
    <ListItem>
      <ListItemIcon>{item.SEL}</ListItemIcon>
      <ListItemText primary={item.PRODUTO} secondary={`Código: ${item.PROD}`} />
      <ListItemSecondaryAction style={{ width: "10%", minWidth: "100px" }}>
        <InputNumber
          decimals={0}
          onChange={handleChange}
          onBlur={handleBlur}
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
