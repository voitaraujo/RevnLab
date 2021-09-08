﻿import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import { Toast } from "../../components/toasty";
import { api } from "../../services/api";

import { DataGrid, GridColDef } from "@material-ui/data-grid";

import Details from './details'

interface IParams {
  DL: string;
}

interface IMachines {
  id?: string;
  CHAPA: string;
  Modelo: string;
  SERIE: string;
}

interface IReferences {
  Refdt: string;
  RefUd: string;
  RefPdt: string;
}

interface LoadDTO {
  machines: IMachines[];
  references: IReferences[];
}

const Machines = (): JSX.Element => {
  const [machines, setMachines] = useState<IMachines[]>([]);
  const [references, setReferences] = useState<IReferences[]>([]);
<<<<<<< HEAD
  const [machineInfo, setMachineInfo] =
    useState<IDetalhes>(DetailsInitialState);
  const [open, setOpen] = useState(false);
  const [selectIndex, setSelectIndex] = useState("");
=======
>>>>>>> 1bf2bf5598c915d8a9f8dc698102d3ab4e932d13

  const FixedDtInicial = moment().startOf("month").format();
  const FixedDtFinal = moment().endOf("month").format();
  const Params = useParams<IParams>();
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "CHAPA",
      width: 110,
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
        <Details
          chapa={params.row.CHAPA} DL={Params.DL} references={references}
        />
      ),
    },
  ];

  //carrega a lista de máquinas do DL e referencias
  useEffect(() => {
    async function load() {
      try {
        const response = await api.get<LoadDTO>(`/machines/${Params.DL}`);

        setReferences(response.data.references);
        setMachines(response.data.machines);
      } catch (err) {
        Toast("Falha ao buscar as máquinas do depósito", "error");
      }
    }
    load();
  }, [Params.DL]);

<<<<<<< HEAD
  const handleChangeSelect = (index: number | unknown, CHAPA: string): void => {
    setSelectIndex(String(index));
    handleLoadInventory(CHAPA, references[Number(index)]);
  };

  const handleOpenDialog = (CHAPA: string) => {
    handleLoadMachineDetails(CHAPA);
    setProdutos([]);
    setSelectIndex("");
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectIndex("");
    setProdutos([]);
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

  const handleLoadInventory = async (CHAPA: string, Ref?: IReferences) => {
    try {
      // const response = await api.get<IInventario[]>(
      //   `/inventory/machines/${Params.DL}/${CHAPA}/${Ref.RefPdt}/${Ref.RefUd}`
      // );
      const response = await api.get<IInventario[]>(
        `/inventory/machines/${Params.DL}/${CHAPA}/${FixedDtInicial}/${FixedDtFinal}`
      );

      setProdutos(response.data);
    } catch (err) {
      Toast("Não foi possivel carregar o inventário da máquina", "error");
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
        await api.put(`/inventory/machines/`, {
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
              onConfirm={handleSubmit}
              onOpen={() => handleLoadInventory(machineInfo.CHAPA)}
            >
              <SelectControlled
                value={String(moment().month())}
                // onChange={(event) =>
                //   handleChangeSelect(event.target.value, machineInfo.CHAPA)
                // }
                disabled={true}
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
                    <div key={`${item.PROD}${i}`}>
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
                  ))
                )}
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
=======
  return (
>>>>>>> 1bf2bf5598c915d8a9f8dc698102d3ab4e932d13
      <DataGrid
        columns={columns}
        rows={MachinesStateToTable(machines)}
        pageSize={MachinesStateToTable(machines).length > 100 ? 100 : MachinesStateToTable(machines).length}
        hideFooter={MachinesStateToTable(machines).length > 100 ? false : true}
        disableColumnMenu={true}
        rowsPerPageOptions={[]}
      />
  );
};

export default Machines;

const MachinesStateToTable = (Machines: IMachines[]): IMachines[] => {
  const aux: IMachines[] = [];

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
