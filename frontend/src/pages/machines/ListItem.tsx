import React, { useState, memo } from "react";
import { api } from '../../services/api'

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import { InputNumber } from "../../components/inputFormat";
import { IListItemProps } from './machinesTypes'

const ListItemCustom = ({ produto, index, changeHandler }: IListItemProps) => {
  const [item, setItem] = useState({ ...produto })
  // const [oldQtd, setOldQtd] = useState<string | number | null>(produto.Qtd);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newItem = {
      ...item,
      Qtd: event.target.value === '' || event.target.value === null ? 0 : event.target.value
    }

    // setOldQtd(item.Qtd)
    setItem(newItem)

    api.put('/inventory/machines/product', {
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
  }

  // const handleBlur = async () => {
  //     let toastId = null 

  // toastId = Toast('Aguarde...', 'wait')
  //   try {
  //     await api.put('/inventory/machines/product', {
  //       Line: item
  //     })

  //     setOldQtd(item.Qtd)
  //     Toast('Salvo', 'success')
  // Toast('Salvo!', 'update', toastId, 'success')
  //   } catch (err) {
  //     setItem({ ...item, Qtd: oldQtd })
  //     Toast('Erro', 'error')
  // Toast('Erro', 'update', toastId, 'error')
  //   }
  // }

  return (
    <ListItem>
      <ListItemIcon>{item.SEL}</ListItemIcon>
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
