//pacotes
import React, { useState, memo } from "react";

//serviços e funções
import { api } from '../../services/api'

//componentes visuais
import { 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemSecondaryAction 
} from "@material-ui/core/";
import { InputNumber } from "../../components/inputFormat";

//tipos e interfaces
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

  return (
    <ListItem>
      <ListItemIcon>{item.SEL}</ListItemIcon>
      <ListItemText primary={item.PRODUTO} secondary={`Código: ${item.PROD}`} />
      <ListItemSecondaryAction style={{ width: "10%", minWidth: "100px" }}>
        <InputNumber
          decimals={0}
          onChange={handleChange}
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
