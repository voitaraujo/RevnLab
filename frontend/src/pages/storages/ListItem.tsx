import React, { memo, useState } from "react";
import { api } from '../../services/api'

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { InputNumber } from "../../components/inputFormat";
import { IListItemProps } from './storageTypes'

const ListItemCustom = ({ produto, changeHandler, index }: IListItemProps) => {
  const [item, setItem] = useState({ ...produto });
  // const [oldQtd, setOldQtd] = useState<string | number | null>(produto.Qtd);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newItem = {
      ...item,
      Qtd: event.target.value === '' || event.target.value === null ? 0 : event.target.value
    }

    // setOldQtd(item.Qtd)
    setItem(newItem);

    api.put('/inventory/storages/product', {
      Line: newItem
    })
    // .catch(() => {
    //   const newItem = {
    //     ...item,
    //     Qtd: oldQtd
    //   }
    //   setItem(newItem)
    //   Toast('Falha ao salvar última alteracao', 'error')
    // })
    changeHandler(newItem, index)
  };

  // const handleBlur = async () => {
  //   try {
  //     await api.put('/inventory/storages/product', {
  //       Line: item
  //     })
  //     setOldQtd(item.Qtd)
  //     Toast('Salvo', 'success')
  //   } catch (err) {
  //     setItem({ ...item, Qtd: oldQtd })
  //     Toast('Erro', 'error')
  //   }
  // }

  return (
    <ListItem>
      <ListItemText primary={item.PRODUTO} secondary={`Código: ${item.PROD}`} />
      <ListItemSecondaryAction style={{ width: "10%", minWidth: "100px" }}>
        <InputNumber
          decimals={0}
          onChange={handleChange}
          // onBlur={handleBlur}
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
