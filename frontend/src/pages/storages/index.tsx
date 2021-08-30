import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../../services/api";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import moment from "moment";

import {
  InfoOutlined,
  AccountTreeOutlined,
  ReceiptOutlined,
} from "@material-ui/icons";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import {
  DraggableDialogController,
  FullScreenDialog,
} from "../../components/dialogs";
import { ClearButton } from "../../components/buttons";
import { Toast } from "../../components/toasty";
import { InputNumber } from "../../components/inputNumber";
import { SelectControlled } from "../../components/select";

interface IInventario {
  Refdt: string;
  Filial: string;
  DLCod: string;
  PROD: string;
  PRODUTO: string;
  Qtd: number | string | null;
}

interface IDepositos {
  id?: string;
  DLCod: string;
  DLNome: string;
  Filial: string;
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

interface IReferences {
  Refdt: string;
  RefUd: string;
  RefPdt: string;
}

interface LoadDTO {
  storages: IDepositos[];
  references: IReferences[];
}

const Storages = (): JSX.Element => {
  const [depositos, setDepositos] = useState<IDepositos[]>([]);
  const [produtos, setProdutos] = useState<IInventario[]>([]);
  const [references, setReferences] = useState<IReferences[]>([]);
  const [DLInfo, setDLInfo] = useState<IDetalhes>(DetailsInitialState);
  const [open, setOpen] = useState(false);
  const [selectIndex, setSelectIndex] = useState("");

  const history = useHistory();
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      editable: false,
      sortable: true,
    },
    {
      field: "DLNome",
      headerName: "Depósito",
      flex: 1,
      editable: false,
      sortable: true,
    },
    {
      field: "Filial",
      headerName: "Info",
      description: "Informações sobre o depósito",
      sortable: false,
      editable: false,
      width: 90,
      align: "center",
      renderCell: (params) => (
        <ClearButton
          disabled={false}
          label={<InfoOutlined />}
          onClick={(event) => {
            handleOpenDialog(params.row.id, params.row.Filial);
          }}
        />
      ),
    },
  ];

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get<LoadDTO>(`/storages`);

        setDepositos(response.data.storages);
        setReferences(response.data.references);
      } catch (err) {
        window.sessionStorage.clear();
        history.push("/");
      }
    }
    load();
  }, [history]);

  const handleOpenDialog = (DLCOD: string, FILIAL: string) => {
    handleLoadStorageDetails(DLCOD, FILIAL);
    setSelectIndex("");
    setProdutos([]);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectIndex("");
    setProdutos([]);
    setDLInfo(DetailsInitialState);
  };

  const handleChangeSelect = (
    index: number | unknown,
    DL: string,
    FILIAL: string
  ): void => {
    setSelectIndex(String(index));
    handleLoadInventory(DL, FILIAL, references[Number(index)]);
  };

  const handleLoadInventory = async (
    DLCOD: string,
    FILIAL: string,
    Ref: IReferences
  ) => {
    setProdutos([]);
    try {
      const response = await api.get<IInventario[]>(
        `/inventory/storages/${DLCOD}/${FILIAL}/${Ref.RefPdt}/${Ref.RefUd}`
      );

      setProdutos(response.data);
    } catch (err) {
      Toast("Falha ao carregar inventário", "error");
    }
  };

  const handleLoadStorageDetails = async (DLCOD: string, FILIAL: string) => {
    try {
      const response = await api.get(`/storages/${FILIAL}/${DLCOD}`);

      setDLInfo(response.data[0]);
    } catch (err) {
      Toast("Não foi possivel trazer as informações do depósito", "error");
    }
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
    <>
      <DraggableDialogController
        open={open}
        title={`Depósito ${DLInfo.DLNome}`}
        onClose={handleCloseDialog}
        extraActions={
          <>
            <FullScreenDialog
              title={`Inventário de ${DLInfo.DLNome}`}
              buttonIcon={<ReceiptOutlined />}
              buttonLabel="Inventário"
              buttonColor="primary"
              buttonType="text"
              onConfirm={handleSubmit}
            >
              <SelectControlled
                value={selectIndex}
                onChange={(event) =>
                  handleChangeSelect(
                    event.target.value,
                    DLInfo.DLCod,
                    DLInfo.Filial
                  )
                }
                label="Referencia"
                variant="outlined"
              >
                {references.map((ref, i) => (
                  <MenuItem value={i} key={i}>
                    {moment(ref.RefPdt).format("L")}
                  </MenuItem>
                ))}
              </SelectControlled>
              <List>
                {produtos.length === 0 ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </div>
                  ))
                )}
              </List>
            </FullScreenDialog>
            <ClearButton
              icon={<AccountTreeOutlined />}
              label="Máquinas"
              disabled={false}
              onClick={() => history.push(`/maquinaDL/${DLInfo.DLCod}`)}
            />
          </>
        }
      >
        <Typography gutterBottom variant="subtitle1">
          Endereço: <strong>{DLInfo.DLEndereco}</strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          Bairro: <strong>{DLInfo.DLBairro}</strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          Município:{" "}
          <strong>
            {DLInfo.DLMunicipio} - {DLInfo.DLUF}
          </strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          CEP: <strong>{DLInfo.DLCEP}</strong>
        </Typography>
        <br />
        <Typography gutterBottom variant="subtitle1">
          Equipamentos no DL: <strong>{DLInfo.DLQtEq}</strong>
        </Typography>
      </DraggableDialogController>

      <Typography gutterBottom variant="h5">
        Depósitos
      </Typography>

      <DataGrid
        columns={columns}
        rows={DepositoStateToTable(depositos)}
        pageSize={DepositoStateToTable(depositos).length}
        hideFooter={true}
        disableColumnMenu={true}
      />
    </>
  );
};

export default Storages;

const DetailsInitialState = {
  Filial: "",
  DLCod: "",
  GestorCod: "",
  DLQtEq: 0,
  DLNome: "",
  DLEndereco: "",
  DLBairro: "",
  DLCEP: "",
  DLUF: "",
  DLMunicipio: "",
  DLMunicipioCod: "",
  DLStatus: "",
  DLLoja: "",
};

const DepositoStateToTable = (Depositos: IDepositos[]): IDepositos[] => {
  const aux: IDepositos[] = [];

  Depositos.forEach((dep) =>
    aux.push({
      id: dep.DLCod,
      DLCod: dep.DLCod,
      DLNome: dep.DLNome,
      Filial: dep.Filial,
    })
  );

  return aux;
};
