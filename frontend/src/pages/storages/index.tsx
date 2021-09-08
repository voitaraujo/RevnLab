import React, { useState, useEffect } from "react";

import { Toast } from "../../components/toasty";
import { api } from "../../services/api";

import { DataGrid, GridColDef } from "@material-ui/data-grid";

import Details from './details'

interface IDepositos {
  id?: string;
  DLCod: string;
  DLNome: string;
  Filial: string;
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
  const [references, setReferences] = useState<IReferences[]>([]);

<<<<<<< HEAD
  const FixedDtInicial = moment().startOf("month").format();
  const FixedDtFinal = moment().endOf("month").format();
  const history = useHistory();
=======
>>>>>>> 1bf2bf5598c915d8a9f8dc698102d3ab4e932d13
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
        <Details
          DL={params.row.id} Filial={params.row.Filial} references={references}
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
        Toast("Falha ao buscar as máquinas do depósito", "error");
      }
    }
    load();
<<<<<<< HEAD
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
    Ref?: IReferences
  ) => {
    setProdutos([]);
    try {
      // const response = await api.get<IInventario[]>(
      //   `/inventory/storages/${DLCOD}/${FILIAL}/${Ref.RefPdt}/${Ref.RefUd}`
      // );
      const response = await api.get<IInventario[]>(
        `/inventory/storages/${DLCOD}/${FILIAL}/${FixedDtInicial}/${FixedDtFinal}`
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
              onOpen={() => handleLoadInventory(DLInfo.DLCod, DLInfo.Filial)}
            >
              <SelectControlled
                value={String(moment().month())}
                // onChange={(event) =>
                //   handleChangeSelect(
                //     event.target.value,
                //     DLInfo.DLCod,
                //     DLInfo.Filial
                //   )
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

=======
  }, []);

  return (
>>>>>>> 1bf2bf5598c915d8a9f8dc698102d3ab4e932d13
      <DataGrid
        columns={columns}
        rows={DepositoStateToTable(depositos)}
        pageSize={DepositoStateToTable(depositos).length > 100 ? 100 : DepositoStateToTable(depositos).length}
        hideFooter={DepositoStateToTable(depositos).length > 100 ? false : true}
        disableColumnMenu={true}
        rowsPerPageOptions={[]}
      />
  );
};

export default Storages;

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
