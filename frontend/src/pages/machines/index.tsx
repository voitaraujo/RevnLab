import React, { useState, useEffect } from "react";

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

  return (
      <DataGrid
        style={{ height: 'calc(100% - 64px)' }}
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
