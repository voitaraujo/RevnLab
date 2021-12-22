//pacotes
import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

//serviços e funções
import { api } from "../../services/api";

//componentes visuais
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { InfoOutlined } from "@material-ui/icons";
import { Toast } from "../../components/toasty";
import { Loading } from "../../components/loading";
import { ClearButton } from "../../components/buttons";

//componentes funcionais
import Details from './details'

//tipos e interfaces
import { IStore } from '../../global/store/storeTypes'
import { IDepositos, LoadDTO, IIndexPropsFromRedux, IDepositoDetalhes, IRefs } from './storageTypes'
import { IStoragesState } from "../../global/reducer/StoragesReducer/StoragesReducerTypes";

//redux actions
import { SetDialogState, SetStoragesList, SetStorageDetails, SetStorageRefs } from '../../global/actions/Storage/StorageActions'

const StoragesWithRedux = ({ State, SetStoragesList, SetDialogState, SetStorageDetails, SetStorageRefs }: IIndexPropsFromRedux): JSX.Element => {
  const [fetching, setFetching] = useState<boolean>(true);

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
        <div
          style={{
            display: 'flex',
            flex: 1,
            borderRight: `10px solid ${params.row.Faltam > 0 ? '#ffee70' : '#a0e64c'}`
          }}
        >
          <ClearButton
            disabled={false}
            label={<InfoOutlined />}
            onClick={() => handleOpenStorageDetails(String(params.row.id), String(params.row.Filial))}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get<LoadDTO>(`/storages`);

        SetStoragesList(response.data.storages);
        setFetching(false)
      } catch (err) {
        Toast("Falha ao recuperar depósitos", "error");
        setFetching(false)
      }
    }
    load();
  }, [SetStoragesList]);

  const handleOpenStorageDetails = async (DLCOD: string, FILIAL: string) => {
    SetDialogState(true)
    try {
      const responseDepInfo = await api.get<IDepositoDetalhes>(`/storages/${FILIAL}/${DLCOD}`);
      const responseDepRefs = await api.get<{ Refs: IRefs[] }>(`/references/storages/${DLCOD}`)

      SetStorageDetails(responseDepInfo.data);
      SetStorageRefs(responseDepRefs.data.Refs);
    } catch (err) {
      Toast("Não foi possivel trazer as informações do depósito", "error");
    }
  };

  return fetching ? (
    <Loading />
  ) : (
    <>
      <Details />
      <DataGrid
        style={{ height: 'calc(100% - 64px)' }}
        columns={columns}
        rows={DepositoStateToTable(State.Storages)}
        pageSize={DepositoStateToTable(State.Storages).length > 100 ? 100 : DepositoStateToTable(State.Storages).length}
        hideFooter={DepositoStateToTable(State.Storages).length > 100 ? false : true}
        disableColumnMenu={true}
        rowsPerPageOptions={[]}
      />
    </>
  );
};

const mapStateToProps = (store: IStore) => ({
  State: store.StoragesState
})

const mapDispatchToProps = (dispatch: Dispatch<{ type: string }>) =>
  bindActionCreators(
    {
      SetDialogState,
      SetStoragesList,
      SetStorageDetails,
      SetStorageRefs
    }
    , dispatch)

export const Storages = connect<{
  State: IStoragesState
},
  {
    SetStoragesList: (value: IDepositos[]) => {
      type: string;
      value: IDepositos[];
    };
    SetDialogState: (value: boolean) => {
      type: string;
      value: boolean;
    };
    SetStorageDetails: (value: IDepositoDetalhes) => {
      type: string;
      value: IDepositoDetalhes;
    };
    SetStorageRefs: (value: IRefs[]) => {
      type: string;
      value: IRefs[];
    };
  },
  unknown,
  IStore>(mapStateToProps, mapDispatchToProps)(StoragesWithRedux);

const DepositoStateToTable = (Depositos: IDepositos[]): IDepositos[] => {
  const aux: IDepositos[] = [];

  Depositos.forEach((dep) =>
    aux.push({
      id: dep.DLCod,
      DLCod: dep.DLCod,
      DLNome: dep.DLNome,
      Filial: dep.Filial,
      Faltam: dep.Faltam,
    })
  );

  return aux;
};