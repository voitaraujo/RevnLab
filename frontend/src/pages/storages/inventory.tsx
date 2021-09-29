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

interface IProps {
  Info: IDetalhes;
}

const Inventory = ({ Info }: IProps): JSX.Element => {
  const [produtos, setProdutos] = useState<IInventario[]>([]);
  const [buscando, setBuscando] = useState<boolean>(true);
  const [tipo, setTipo] = useState<string>("INSUMOS");
  const [selectedRef, setSelectedRef] = useState();

  //   useEffect(() => loadInventoryDetails(Info.DLCod, Info.Filial, X, Y))

  const handleOpen = async (DLCOD: string, FILIAL: string) => {
    let FixedDtInicial = moment()
      .subtract(1, "months")
      .startOf("month")
      .format();
    let FixedDtFinal = moment().subtract(1, "months").endOf("month").format();

    loadInventoryDetails(DLCOD, FILIAL, FixedDtInicial, FixedDtFinal);
  };

  const loadInventoryDetails = async (
    DLCOD: string,
    FILIAL: string,
    InitialDate: string,
    finalDate: string
  ) => {
    try {
      const response = await api.get<IInventario[]>(
        `/inventory/storages/${DLCOD}/${FILIAL}/${InitialDate}/${finalDate}`
      );

      setProdutos(response.data);
      setBuscando(false);
    } catch (err) {
      Toast("Falha ao carregar inventário", "error");
      setBuscando(false);
    }
  };

  const handleClose = () => {
    setProdutos([]);
    setBuscando(true);
    // setSelectIndex("");
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
    let test = true;

    if (produtos.length === 0) {
      Toast("Inventário vazio", "default");
      test = false;
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
        test = false;
        break;
      }
    }

    if (test) {
      try {
        await api.put(`/inventory/storages/`, {
          inventario: produtos,
        });

        Toast("Inventário salvo com sucesso", "success");
      } catch (err) {
        Toast("Falha ao salvar inventário", "error");
        test = false;
      }
    }

    return test;
  };

  return (
    <FullScreenDialog
      title={`Inventário de ${Info.DLNome}`}
      buttonIcon={<ReceiptOutlined />}
      buttonLabel="Inventário"
      buttonColor="primary"
      buttonType="text"
      onConfirm={handleSubmit}
      onOpen={() => handleOpen(Info.DLCod, Info.Filial)}
      onClose={handleClose}
    >
      <SelectControlled
        value={String(moment().subtract(1, "months").month())}
        disabled={true}
        label="Referencia"
        variant="outlined"
        enableVoidSelection={true}
      >
        <MenuItem value="7">PLACEHOLDER_REF_ESTÁTICO</MenuItem>
      </SelectControlled>
      <SelectControlled
        value={tipo}
        onChange={(e) => setTipo(String(e.target.value))}
        disabled={false}
        label="Categoria"
        variant="outlined"
        enableVoidSelection={false}
      >
        <MenuItem value="INSUMOS">INSUMOS</MenuItem>
        <MenuItem value="SNACKS">SNACKS</MenuItem>
      </SelectControlled>
      {buscando ? (
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

export default Inventory;
