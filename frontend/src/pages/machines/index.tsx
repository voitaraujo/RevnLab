import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Toast } from "../../components/toasty";
import { api } from "../../services/api";

import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { InfoOutlined, ReceiptOutlined } from "@material-ui/icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import { ClearButton } from "../../components/buttons";
import {
  DraggableDialogController,
  FullScreenDialog,
} from "../../components/dialogs";
import { InputNumber } from "../../components/inputNumber";

interface IParams {
  DL: string;
}

interface IInventario {
  DLCod: string;
  PROD: string;
  SEL: string;
  PRODUTO: string;
  Qtd: number | string | null;
}

interface IMachines {
  id?: string;
  CHAPA: string;
  Modelo: string;
  SERIE: string;
}

interface IDetalhes {
  N1_ZZFILIA: string;
  CHAPA: string;
  SERIE: string;
  CLICOD: string;
  CLILJ: string;
  DL: string;
  Modelo: string;
}

const Machines = (): JSX.Element => {
  const [machines, setMachines] = useState<IMachines[]>([]);
  const [produtos, setProdutos] = useState<IInventario[]>([]);
  const [machineInfo, setMachineInfo] =
    useState<IDetalhes>(DetailsInitialState);
  const [open, setOpen] = useState(false);

  const Params = useParams<IParams>();

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "CHAPA",
      width: 90,
      editable: false,
      sortable: true,
    },
    {
      field: "SERIE",
      headerName: "Série",
      flex: 1,
      editable: false,
      sortable: true,
    },
    {
      field: "Modelo",
      headerName: "Modelo",
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
            handleOpenDialog(params.row.CHAPA);
          }}
        />
      ),
    },
  ];

  const handleOpenDialog = (CHAPA: string) => {
    handleLoadMachineDetails(CHAPA);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setMachineInfo(DetailsInitialState);
  };

  //busca os detalhes de uma máquina
  const handleLoadMachineDetails = async (CHAPA: string) => {
    try {
      const response = await api.get(`/machines/details/${Params.DL}/${CHAPA}`);

      setMachineInfo(response.data[0]);
    } catch (err) {
      Toast("Não foi possivel trazer as informações da máquina", "error");
    }
  };

  const handleLoadInventory = async (CHAPA: string) => {
    try {
      const response = await api.get<IInventario[]>(
        `/inventory/machines/${Params.DL}/${CHAPA}`
      );

      setProdutos(response.data);
    } catch (err) {}
  };

  const handleValueChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ): void => {};

  //carrega a lista de máquinas do DL
  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/machines/${Params.DL}`);

        setMachines(response.data);
      } catch (err) {
        Toast("Falha ao buscar as máquinas do depósito", "error");
      }
    }
    load();
  }, []);

  return (
    <>
      <DraggableDialogController
        open={open}
        title={`Depósito na máquina ${machineInfo.Modelo}`}
        onClose={handleCloseDialog}
        extraActions={
          <>
            <FullScreenDialog
              title={`Inventário do ativo ${machineInfo.SERIE}`}
              buttonIcon={<ReceiptOutlined />}
              buttonLabel="Inventário"
              buttonColor="primary"
              buttonType="text"
              onOpen={() => handleLoadInventory(machineInfo.CHAPA)}
            >
              <List>
                {produtos.map((item, i) => (
                  <div key={item.DLCod}>
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
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            </FullScreenDialog>
          </>
        }
      >
        <Typography gutterBottom variant="subtitle1">
          CHAPA: <strong>{machineInfo.CHAPA}</strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          Série: <strong>{machineInfo.SERIE}</strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          DL: <strong>{machineInfo.DL}</strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          Filial: <strong>{machineInfo.N1_ZZFILIA}</strong>
        </Typography>
      </DraggableDialogController>

      <Typography gutterBottom variant="h5">
        Máquinas no depósito "{Params.DL}"
      </Typography>
      <DataGrid
        columns={columns}
        rows={MachinesStateToTable(machines)}
        pageSize={MachinesStateToTable(machines).length}
        hideFooter={true}
        disableColumnMenu={true}
      />
    </>
  );
};

export default Machines;

const MachinesStateToTable = (Machines: IMachines[]): IMachines[] => {
  let aux: IMachines[] = [];

  Machines.forEach((maq) =>
    aux.push({
      id: maq.CHAPA,
      CHAPA: maq.CHAPA,
      SERIE: maq.SERIE,
      Modelo: maq.Modelo,
    })
  );

  return aux;
};

const DetailsInitialState = {
  N1_ZZFILIA: "",
  CHAPA: "",
  SERIE: "",
  CLICOD: "",
  CLILJ: "",
  DL: "",
  Modelo: "",
};
