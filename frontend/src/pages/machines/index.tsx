//pacotes
import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { useParams } from "react-router-dom";

//serviços e funções
import { api } from "../../services/api";

//componentes visuais
import { Toast } from "../../components/toasty";
import { InfoOutlined } from "@material-ui/icons";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Loading } from "../../components/loading";
import { ClearButton } from '../../components/buttons'

//componentes funcionais
import { Details } from './details'

//tipos e interfaces
import { IMachinesState } from '../../global/reducer/MachinesReducer/MachineReducerTypes'
import { IStore } from '../../global/store/storeTypes'
import { IIndexParams, IIndexPropsWithRedux, IIndexLoadDTO, IMachines, IMachineDetalhes, IMachineRefs } from './machinesTypes'

//redux actions
import { SetMachinesList, SetDialogState, SetMachineDetails, SetMachineRefs } from '../../global/actions/Machine/MachineActions'

const MachinesWithRedux = ({ State, SetMachinesList, SetDialogState, SetMachineDetails, SetMachineRefs }: IIndexPropsWithRedux): JSX.Element => {
  const [fetching, setFetching] = useState<boolean>(true);

  const Params = useParams<IIndexParams>();
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
            onClick={() => handleOpenMachineDetails(Params.DL, String(params.id))}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get<IIndexLoadDTO>(`/machines/${Params.DL}`);

        SetMachinesList(MachinesStateToTable(response.data.machines));
        setFetching(false)
      } catch (err) {
        Toast("Falha ao buscar as máquinas vinculadas ao depósito", "error");
        setFetching(false)
      }
    }
    load();
  }, [Params.DL, SetMachinesList]);

  const handleOpenMachineDetails = async (DLCOD: string, CHAPA: string) => {
    SetDialogState(true)

    try {
      const responseDepInfo = await api.get<IMachineDetalhes>(`/machines/details/${DLCOD}/${CHAPA}`);
      const responseDepRefs = await api.get<{ Refs: IMachineRefs[] }>(`/references/storages/${DLCOD}`)

      SetMachineDetails(responseDepInfo.data);
      SetMachineRefs(responseDepRefs.data.Refs);
    } catch (err) {
      Toast("Não foi possivel recuperar as informações da máquina", "error");
    }
  }

  return fetching ? (
    <Loading />
  ) : (
    <>
      <Details />
      <DataGrid
        style={{ height: 'calc(100% - 64px)' }}
        columns={columns}
        rows={State.Machines}
        pageSize={State.Machines.length > 100 ? 100 : State.Machines.length}
        hideFooter={State.Machines.length > 100 ? false : true}
        disableColumnMenu={true}
        rowsPerPageOptions={[]}
      />
    </>
  );
};

const mapStateToProps = (store: IStore) => ({
  State: store.MachinesState
})

const mapDispatchToProps = (dispatch: Dispatch<{ type: string }>) =>
  bindActionCreators(
    {
      SetDialogState,
      SetMachinesList,
      SetMachineDetails,
      SetMachineRefs
    }
    , dispatch)

export const Machines = connect<{
  State: IMachinesState
},
  {
    SetDialogState: (value: boolean) => {
      type: string;
      value: boolean;
    };
    SetMachinesList: (value: IMachines[]) => {
      type: string;
      value: IMachines[];
    };
    SetMachineDetails: (value: IMachineDetalhes) => {
      type: string;
      value: IMachineDetalhes;
    };
    SetMachineRefs: (value: IMachineRefs[]) => {
      type: string;
      value: IMachineRefs[];
    };
  },
  unknown,
  IStore>(mapStateToProps, mapDispatchToProps)(MachinesWithRedux);

const MachinesStateToTable = (Machines: IMachines[]): IMachines[] => {
  const aux: IMachines[] = [];

  Machines.forEach((maq) =>
    aux.push({
      id: maq.CHAPA,
      CHAPA: maq.CHAPA,
      SERIE: maq.SERIE,
      Modelo: maq.Modelo,
      Faltam: maq.Faltam
    })
  );

  return aux;
};