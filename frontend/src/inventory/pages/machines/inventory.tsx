//pacotes
import React, { useState, useEffect } from "react";
import moment from "moment";
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

//serviços e funções
import { api } from "../../services/api";
import { capitalizeMonthFirstLetter } from "../../misc/commomFunctions";

//componentes visuais
import { ReceiptOutlined } from "@material-ui/icons";
import {
  List,
  MenuItem,
  Divider,
  Typography
} from "@material-ui/core/";
import { FullScreenDialog } from "../../components/dialogs";
import { SelectControlled } from "../../components/select";
import { Toast } from "../../components/toasty";
import { Loading } from "../../components/loading";

//componentes funcionais
import { ListItemMemo } from './ListItem'

//tipos e interfaces
import { IInventoryPropsWithRedux, IProdutoInventário } from './machinesTypes'
import { IMachinesState } from '../../global/reducer/MachinesReducer/MachineReducerTypes'
import { IStore } from '../../global/store/storeTypes'

//redux actions
import { SetProdutos } from '../../global/actions/Machine/MachineActions'

export const InventoryWithRedux = ({ State, SetProdutos }: IInventoryPropsWithRedux): JSX.Element => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [tipo, setTipo] = useState<string>("SNACKS");
  const [selectedRef, setSelectedRef] = useState("");

  let backupProdutos: IProdutoInventário[] = [...State.Produtos]

  useEffect(() => {
    if (
      State.MachineDetails.CHAPA !== "" &&
      State.MachineDetails.DL !== "" &&
      tipo !== "" &&
      selectedRef !== ""
    ) {
      loadInventoryDetails(State.MachineDetails.CHAPA, State.MachineDetails.DL, tipo, selectedRef);
    } else {
      SetProdutos([]);
    }
    // eslint-disable-next-line
  }, [State.MachineDetails.CHAPA, State.MachineDetails.DL, tipo, selectedRef]);

  const loadInventoryDetails = async (
    CHAPA: string,
    DL: string,
    Category: string,
    Refdt: string
  ) => {
    setFetching(true);
    try {
      const response = await api.get<IProdutoInventário[]>(
        `/inventory/machines/${DL}/${CHAPA}/${Category}/${moment(Refdt).format("YYYY-MM-DD")}`
      );

      SetProdutos(response.data);
      backupProdutos = [...response.data]
      setFetching(false);
    } catch (err) {
      Toast("Não foi possivel carregar o inventário da máquina", "error");
      setFetching(false);
    }
  };

  const handleClose = () => {
    SetProdutos([]);
    setFetching(false);
    setSelectedRef("");
    setTipo('SNACKS')
  };

  const ApplyChangesToBackup = (item: IProdutoInventário, index: number) => {
    backupProdutos[index] = item
  };

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
        await api.put(`/inventory/machines/`, {
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
      title={`Inventário do ativo ${State.MachineDetails.CHAPA}`}
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
        onChange={(e) => {
          setSelectedRef(String(e.target.value));
        }}
        disabled={fetching}
        label="Referência"
        variant="outlined"
        enableVoidSelection={true}
      >
        {State.Refs.map((ref) => (
          <MenuItem value={ref.Refdt} key={ref.Refdt}>
            {capitalizeMonthFirstLetter(moment(ref.Refdt).format("MMMM"))}
          </MenuItem>
        ))}
      </SelectControlled>
      <SelectControlled
        value={tipo}
        onChange={(e) => {
          setTipo(String(e.target.value));
        }}
        disabled={true}
        label="Categoria"
        variant="outlined"
        enableVoidSelection={false}
      >
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
              <div key={item.SEL}>
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
  State: store.MachinesState
})

const mapDispatchToProps = (dispatch: Dispatch<{ type: string }>) =>
  bindActionCreators(
    {
      SetProdutos,
    },
    dispatch
  );

export const Inventory = connect<{
  State: IMachinesState;
}, {
  SetProdutos: (value: IProdutoInventário[]) => {
    type: string;
    value: IProdutoInventário[];
  };
},
  unknown,
  IStore>(mapStateToProps, mapDispatchToProps)(InventoryWithRedux)