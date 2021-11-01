import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { useParams } from "react-router-dom";
import { Toast } from "../../components/toasty";
import { api } from "../../services/api";

import { InfoOutlined } from "@material-ui/icons";
import { DataGrid, GridColDef } from "@material-ui/data-grid";

import { Details } from './details'
import { Loading } from "../../components/loading";
import { ClearButton } from '../../components/buttons'

import { IMachinesState } from '../../global/reducer/MachineReducerTypes'
import { SetMachinesList, SetDialogState } from '../../global/actions/MachineActions'
import { IStore } from '../../global/store/storeTypes'
import { IIndexParams, IIndexPropsWithRedux, IIndexLoadDTO, IMachines } from './machinesTypes'

const MachinesWithRedux = ({ State, SetMachinesList, SetDialogState }: IIndexPropsWithRedux): JSX.Element => {
  const [fetching, setFetching] = useState<boolean>(true);
  const [chapaTarget, setChapaTarget] = useState<string>('');

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
        <ClearButton
          disabled={false}
          label={<InfoOutlined />}
          onClick={() => handleOpenMachineDetails(String(params.id))}
        />
      ),
    },
  ];

  const handleOpenMachineDetails = (CHAPA: string) => {
    setChapaTarget(CHAPA)
    SetDialogState(true)
  }

  //carrega a lista de máquinas do DL
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

  return fetching ? (
    <Loading />
  ) : (
    <>
      <Details DLCod={Params.DL} Chapa={chapaTarget} />
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
      SetMachinesList
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
    })
  );

  return aux;
};
