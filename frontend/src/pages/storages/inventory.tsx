import React, { useState, useEffect } from "react";
import moment from "moment";
import { api } from "../../services/api";

import { ReceiptOutlined } from "@material-ui/icons";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import { FullScreenDialog } from "../../components/dialogs";
import { Toast } from "../../components/toasty";
import { SelectControlled } from "../../components/select";
import { Loading } from "../../components/loading";
import { capitalizeMonthFirstLetter } from '../../misc/commomFunctions'

import { ListItemMemo } from './ListItem'

import { IInventoryProps, IDepositoInventario } from './storageTypes'

export const Inventory = ({ Info, Refs }: IInventoryProps): JSX.Element => {
  const [produtos, setProdutos] = useState<IDepositoInventario[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [tipo, setTipo] = useState<string>("INSUMOS");
  const [selectedRef, setSelectedRef] = useState('');

  useEffect(() => {
    if (selectedRef !== '' && tipo !== '' && Info.Filial !== '' && Info.DLCod !== '') {
      loadInventoryDetails(Info.DLCod, Info.Filial, tipo, selectedRef)
    } else {
      setProdutos([])
    }
  }, [Info.DLCod, Info.Filial, tipo, selectedRef])

  const loadInventoryDetails = async (
    DLCOD: string,
    FILIAL: string,
    Category: string,
    Refdt: string,
  ) => {
    setFetching(true);
    try {
      const response = await api.get<IDepositoInventario[]>(
        `/inventory/storages/${DLCOD}/${FILIAL}/${Category}/${moment(Refdt).format('YYYY-MM-DD')}/`
      );

      setProdutos(response.data);
      setFetching(false);
    } catch (err) {
      Toast("Não foi possivel recuperar o inventário do depósito", "error");
      setFetching(false);
    }
  };

  const handleClose = () => {
    setProdutos([]);
    setFetching(false);
    setSelectedRef('')
    setTipo('INSUMOS')
  };

  const ApplyChangesToState = (produto: IDepositoInventario, index: number) => {
    const aux = [...produtos]

    aux[index] = produto

    setProdutos([...aux])
  }

  const handleSubmit = async (): Promise<boolean> => {
    let shouldCloseModal = true;

    if (produtos.length === 0) {
      Toast("Inventário vazio", "warn");
      shouldCloseModal = false;
    }

    for (let i = 0; i < produtos.length; i++) {
      if (
        produtos[i].Qtd === "" ||
        produtos[i].Qtd === null ||
        typeof produtos[i].Qtd == "undefined"
      ) {
        Toast(
          "Qtd. de um ou mais itens do inventário não informados",
          "warn"
        );
        shouldCloseModal = false;
        break;
      }
    }

    let toastId = null 

toastId = Toast('Aguarde...', 'wait')

    if (shouldCloseModal) {
      try {
        await api.put(`/inventory/storages/`, {
          inventario: produtos,
        });

        Toast('Inventário salvo com sucesso!', 'update', toastId, 'success')
      } catch (err) {
        Toast('Falha ao salvar inventário', 'update', toastId, 'error')
        shouldCloseModal = false;
      }
    }

    return shouldCloseModal;
  };

  return (
    <FullScreenDialog
      title={`Inventário de ${Info.DLNome}`}
      buttonIcon={<ReceiptOutlined />}
      buttonLabel="Inventário"
      buttonColor="primary"
      buttonType="text"
      onConfirm={handleSubmit}
      onClose={handleClose}
    >
      <SelectControlled
        value={selectedRef}
        onChange={e => setSelectedRef(String(e.target.value))}
        disabled={fetching}
        label="Referência"
        variant="outlined"
        enableVoidSelection={true}
      >
        {Refs.map(ref => (
          <MenuItem value={ref.Refdt} key={ref.Refdt}>{capitalizeMonthFirstLetter(moment(ref.Refdt).format('MMMM'))}</MenuItem>
        ))}
      </SelectControlled>
      <SelectControlled
        value={tipo}
        onChange={(e) => setTipo(String(e.target.value))}
        disabled={fetching}
        label="Categoria"
        variant="outlined"
        enableVoidSelection={false}
      >
        <MenuItem value="INSUMOS">INSUMOS</MenuItem>
        <MenuItem value="SNACKS">SNACKS</MenuItem>
      </SelectControlled>
      {fetching ? (
        <Loading />
      ) : (
        <List>
          {produtos.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography gutterBottom variant="h6">
                Nenhum produto à exibir.
              </Typography>
            </div>
          ) : (
            produtos.map((item, i) => (
              <div key={item.PROD}>
                <ListItemMemo produto={item} index={i} changeHandler={ApplyChangesToState}/>
                <Divider />
              </div>
            ))
          )}
        </List>
      )}
    </FullScreenDialog>
  );
};