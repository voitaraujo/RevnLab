import React, { useState, useEffect } from "react";
import moment from "moment";
import { api } from "../../services/api";

import { ReceiptOutlined } from "@material-ui/icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import { FullScreenDialog } from "../../components/dialogs";
import { Toast } from "../../components/toasty";
import { SelectControlled } from "../../components/select";
import { InputNumber } from "../../components/inputFormat";
import { Loading } from "../../components/loading";

interface IInventario {
  Refdt: string;
  Filial: string;
  DLCod: string;
  PROD: string;
  PRODUTO: string;
  Qtd: number | string | null;
}

interface IDetalhes {
  Filial: string;
  DLCod: string;
  GestorCod: string;
  DLQtEq: number;
  DLNome: string;
  DLEndereco: string;
  DLBairro: string;
  DLCEP: string;
  DLUF: string;
  DLMunicipio: string;
  DLMunicipioCod: string;
  DLStatus: string;
  DLLoja: string;
}

interface Refs {
  DLCod: string,
  Refdt: string,
  InvMovSeq: number,
  InvMovStaus: number
}

interface IProps {
  Info: IDetalhes;
  Refs: Refs[];
}

export const Inventory = ({ Info, Refs }: IProps): JSX.Element => {
  const [produtos, setProdutos] = useState<IInventario[]>([]);
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
      const response = await api.get<IInventario[]>(
        `/inventory/storages/${DLCOD}/${FILIAL}/${Category}/${moment(Refdt).format('YYYY-MM-DD')}/`
      );

      setProdutos(response.data);
      setFetching(false);
    } catch (err) {
      Toast("Não foi possivel carregar o inventário do depósito", "error");
      setFetching(false);
    }
  };

  const handleClose = () => {
    setProdutos([]);
    setFetching(false);
    setSelectedRef('')
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ): void => {
    const aux = [...produtos];

    aux[index].Qtd = event.target.value;

    setProdutos(aux);
  };

  const handleSubmit = async (): Promise<boolean> => {
    let shouldCloseModal = true;

    if (produtos.length === 0) {
      Toast("Inventário vazio", "default");
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
          "default"
        );
        shouldCloseModal = false;
        break;
      }
    }

    if (shouldCloseModal) {
      try {
        await api.put(`/inventory/storages/`, {
          inventario: produtos,
        });

        Toast("Inventário salvo com sucesso", "success");
      } catch (err) {
        Toast("Falha ao salvar inventário", "error");
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
          <MenuItem value={ref.Refdt} key={ref.Refdt}>{moment(ref.Refdt).format('L')}</MenuItem>
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
                <ListItem>
                  <ListItemText
                    primary={item.PRODUTO}
                    secondary={`Código: ${item.PROD}`}
                  />
                  <ListItemSecondaryAction
                    style={{ width: "10%", minWidth: "100px" }}
                  >
                    <InputNumber
                      decimals={0}
                      onChange={(event) => handleValueChange(event, i)}
                      disabled={false}
                      label="Qtd"
                      value={item.Qtd}
                      type="outlined"
                      focus={false}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </div>
            ))
          )}
        </List>
      )}
    </FullScreenDialog>
  );
};