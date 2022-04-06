//pacotes
import React, { useState, useEffect } from "react";
import moment from "moment";
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

//serviços e funções
import { api } from "../../services/api";
import { capitalizeMonthFirstLetter } from '../../misc/commomFunctions'

//componentes visuais
import { ReceiptOutlined } from "@material-ui/icons";
import { List, Divider, MenuItem, Typography } from "@material-ui/core/";
import { FullScreenDialog } from "../../components/dialogs";
import { Toast } from "../../components/toasty";
import { SelectControlled } from "../../components/select";
import { Loading } from "../../components/loading";

//componentes funcionais
import { ListItemMemo } from './ListItem'

//tipos e interfaces
import { IDepositoInventario, IInventoryPropsWithRedux } from './storageTypes'
import { IStoragesState } from '../../global/reducer/StoragesReducer/StoragesReducerTypes'
import { IStore } from '../../global/store/storeTypes'

//redux actions
import { SetProdutos } from '../../global/actions/Storage/StorageActions'

const InventoryWithRedux = ({ State, SetProdutos }: IInventoryPropsWithRedux): JSX.Element => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [tipo, setTipo] = useState<string>("INSUMOS");
  const [selectedRef, setSelectedRef] = useState('');

  let backupProdutos: IDepositoInventario[] = [...State.Produtos];

  useEffect(() => {
    if (
      selectedRef !== '' &&
      tipo !== '' &&
      State.StorageDetails.Filial !== '' &&
      State.StorageDetails.DLCod !== ''
    ) {
      loadInventoryDetails(State.StorageDetails.DLCod, State.StorageDetails.Filial, tipo, selectedRef)
    } else {
      SetProdutos([])
    }
    // eslint-disable-next-line
  }, [State.StorageDetails.DLCod, State.StorageDetails.Filial, tipo, selectedRef])

  const loadInventoryDetails = async (
    DLCOD: string,
    FILIAL: string,
    Category: string,
    Refdt: string,
  ) => {
    setFetching(true);
    try {
      const response = await api.get<IDepositoInventario[]>(
        `/inventory/storages/${DLCOD}/${FILIAL}/${Category}/${moment(Refdt).format('YYYY-MM-DD')}/`
      );

      SetProdutos(response.data);
      backupProdutos = [...response.data]
      setFetching(false);
    } catch (err) {
      Toast("Não foi possivel recuperar o inventário do depósito", "error");
      setFetching(false);
    }
  };

  const handleClose = () => {
    SetProdutos([]);
    setFetching(false);
    setSelectedRef('')
    setTipo('INSUMOS')
  };

  const ApplyChangesToBackup = (item: IDepositoInventario, index: number) => {
    backupProdutos[index] = item
  }

  const handleSubmit = async (): Promise<boolean> => {
    let shouldCloseModal = true;

    if (State.Produtos.length === 0) {
      Toast("Inventário vazio", "warn");
      shouldCloseModal = false;
    }

    if (shouldCloseModal) {
      let toastId = null

      toastId = Toast('Aguarde...', 'wait')

      try {
        await api.put(`/inventory/storages/`, {
          inventario: backupProdutos,
        });

        Toast('Inventário salvo com sucesso!', 'update', toastId, 'success')
      } catch (err) {
        Toast('Falha ao salvar inventário', 'update', toastId, 'error')
        shouldCloseModal = false;
      }
    }

    return shouldCloseModal;
  };

  return (
    <FullScreenDialog
      title={`Inventário de ${State.StorageDetails.DLNome}`}
      buttonIcon={<ReceiptOutlined />}
      buttonLabel="Inventário"
      buttonColor="primary"
      buttonType="text"
      onConfirm={handleSubmit}
      onClose={handleClose}
      enableSubmitButton
    >
      <SelectControlled
        value={selectedRef}
        onChange={e => setSelectedRef(String(e.target.value))}
        disabled={fetching}
        label="Referência"
        variant="outlined"
        enableVoidSelection={true}
      >
        {State.Refs.map(ref => (
          <MenuItem value={ref.Refdt} key={ref.Refdt}>{capitalizeMonthFirstLetter(moment(ref.Refdt).format('MMMM'))}</MenuItem>
        ))}
      </SelectControlled>
      <SelectControlled
        value={tipo}
        onChange={(e) => setTipo(String(e.target.value))}
        disabled={fetching}
        label="Categoria"
        variant="outlined"
        enableVoidSelection={false}
      >
        <MenuItem value="INSUMOS">INSUMOS</MenuItem>
        <MenuItem value="SNACKS">SNACKS</MenuItem>
      </SelectControlled>
      {fetching ? (
        <Loading />
      ) : (
        <List>
          {State.Produtos.length === 0 ? (
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
            State.Produtos.map((item, i) => (
              <div key={item.PROD}>
                <ListItemMemo
                  produto={item}
                  index={i}
                  changeHandler={ApplyChangesToBackup}
                />
                <Divider />
              </div>
            ))
          )}
        </List>
      )}
    </FullScreenDialog>
  );
};

const mapStateToProps = (store: IStore) => ({
  State: store.StoragesState
})

const mapDispatchToProps = (dispatch: Dispatch<{ type: string }>) =>
  bindActionCreators(
    {
      SetProdutos
    }
    , dispatch)

export const Inventory = connect<{
  State: IStoragesState
},
  {
    SetProdutos: (value: IDepositoInventario[]) => {
      type: string;
      value: IDepositoInventario[];
    };
  },
  unknown,
  IStore>(mapStateToProps, mapDispatchToProps)(InventoryWithRedux);