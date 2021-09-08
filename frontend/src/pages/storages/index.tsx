﻿import React, { useState, useEffect } from "react";

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
  }, []);

  return (
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
