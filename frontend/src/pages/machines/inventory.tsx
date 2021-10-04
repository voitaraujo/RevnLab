import React, { useState, useEffect } from 'react'
import moment from "moment";
import { api } from "../../services/api";

import { ReceiptOutlined } from "@material-ui/icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import {
  FullScreenDialog
} from "../../components/dialogs";
import { InputNumber } from "../../components/inputFormat";
import { SelectControlled } from "../../components/select";
import { Toast } from "../../components/toasty";
import { Loading } from "../../components/loading";

interface IDetalhes {
  N1_ZZFILIA: string;
  CHAPA: string;
  SERIE: string;
  CLICOD: string;
  CLILJ: string;
  DL: string;
  Modelo: string;
}
interface IInventario {
  DLCod: string;
  PROD: string;
  SEL: string;
  PRODUTO: string;
  Qtd: number | string | null;
  Refdt: string;
  Filial: string;
  CHAPA: string;
}
interface Refs {
  DLCod: string,
  Refdt: string,
  InvMovSeq: number,
  InvMovStaus: number
}
interface IProps {
  Info: IDetalhes
  DLCod: string
  Refs: Refs[]
}

export const Inventory = ({ Info, DLCod, Refs }: IProps): JSX.Element => {
  const [produtos, setProdutos] = useState<IInventario[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [tipo, setTipo] = useState<string>("SNACKS");
  const [selectedRef, setSelectedRef] = useState('');

  useEffect(() => {
    if (Info.CHAPA !== '' && DLCod !== '' && tipo !== '' && selectedRef !== '') {
      loadInventoryDetails(Info.CHAPA, DLCod, tipo, selectedRef)
    } else {
      setProdutos([])
    }
  }, [Info.CHAPA, DLCod, tipo, selectedRef])

  const loadInventoryDetails = async (
    CHAPA: string,
    DL: string,
    Category: string,
    Refdt: string
  ) => {
    setFetching(true);
    try {
      const response = await api.get<IInventario[]>(
        `/inventory/machines/${DL}/${CHAPA}/${Category}/${moment(Refdt).format('YYYY-MM-DD')}`
      );

      setProdutos(response.data);
      setFetching(false);
    } catch (err) {
      Toast("Não foi possivel carregar o inventário da máquina", "error");
      setFetching(false);
    }
  }

  const handleClose = () => {
    setProdutos([])
    setFetching(false);
    setSelectedRef('')
  }

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
        await api.put(`/inventory/machines/`, {
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
      title={`Inventário do ativo ${Info.CHAPA}`}
      buttonIcon={<ReceiptOutlined />}
      buttonLabel="Inventário"
      buttonColor="primary"
      buttonType="text"
      onConfirm={handleSubmit}
      onClose={handleClose}
    >
      <SelectControlled
        value={selectedRef}
        onChange={e => {
          setSelectedRef(String(e.target.value))}
        }
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
        onChange={(e) => {
          setTipo(String(e.target.value))}
        }
        disabled={true}
        label="Categoria"
        variant="outlined"
        enableVoidSelection={false}
      >
        <MenuItem value="SNACKS">SNACKS</MenuItem>
      </SelectControlled>
      {fetching ? (
        <Loading />
      ) : (<List>
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
            <div key={item.SEL}>
              <ListItem>
                <ListItemIcon>{item.SEL}</ListItemIcon>
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
  )
}
