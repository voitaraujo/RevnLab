import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { api } from "../../services/api";
import { DataGrid, GridColDef } from "@material-ui/data-grid";

import { createStyles, makeStyles, Theme } from "@material-ui/core";
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
import Typography from "@material-ui/core/Typography";

import {
  DraggableDialogController,
  FullScreenDialog,
} from "../../components/dialogs";
import { ClearButton } from "../../components/buttons";
import { Toast } from "../../components/toasty";
import { InputNumber } from "../../components/inputNumber";

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

const Storages = (): JSX.Element => {
  const [depositos, setDepositos] = useState<IDepositos[]>([]);
  const [produtos, setProdutos] = useState<IInventario[]>([]);
  const [DLInfo, setDLInfo] = useState<IDetalhes>(DetailsInitialState);
  const [open, setOpen] = useState(false);

  const classes = useStyles();
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
        const response = await api.get(`/storages`);

        setDepositos(response.data);
      } catch (err) {
        window.sessionStorage.clear();
        history.push("/");
      }
    }
    load();
  }, []);

  const handleOpenDialog = (DLCOD: string, FILIAL: string) => {
    handleLoadStorageDetails(DLCOD, FILIAL);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setDLInfo(DetailsInitialState);
  };

  const handleLoadInventory = async (DLCOD: string, FILIAL: string) => {
    try {
      const response = await api.get<IInventario[]>(
        `/inventory/storages/${DLCOD}/${FILIAL}`
      );

      setProdutos(response.data);
    } catch (err) {}
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
              onOpen={() => handleLoadInventory(DLInfo.DLCod, DLInfo.Filial)}
            >
              <List>
                {produtos.map((item, i) => (
                  <div key={item.DLCod}>
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
                ))}
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

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
  let aux: IDepositos[] = [];

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
