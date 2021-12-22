//pacotes
import React from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

//serviços e funções
import { capitalizeMonthFirstLetter } from "../../misc/commomFunctions";

//componentes visuais
import { ExpandMore } from "@material-ui/icons";
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from "@material-ui/core/";
import {
  DraggableDialogControlled
} from "../../components/dialogs";
import { Loading } from "../../components/loading";

//componentes funcionais
import { Inventory } from './inventory'

//tipos e interfaces
import { IMachinesState } from '../../global/reducer/MachinesReducer/MachineReducerTypes'
import { IStore } from '../../global/store/storeTypes'
import { IDetailsPropsWithRedux, IMachineDetalhes, IMachineRefs } from './machinesTypes'

//redux actions
import { SetDialogState, SetMachineDetails, SetMachineRefs } from '../../global/actions/Machine/MachineActions'

const DetailsWithState = ({ State, SetDialogState, SetMachineRefs, SetMachineDetails }: IDetailsPropsWithRedux): JSX.Element => {

  const handleCloseDialog = () => {
    SetDialogState(false);
    SetMachineDetails(DetailsInitialState);
    SetMachineRefs([]);
  };

  return (
    <DraggableDialogControlled
      open={State.DialogState}
      title={`Máquina ${State.MachineDetails.Modelo}`}
      onClose={handleCloseDialog}
      extraActions={
        <Inventory />
      }
    >
      {State.MachineDetails.CHAPA === '' ? <Loading /> : (
        <>
          <Typography gutterBottom variant="subtitle1">
            CHAPA: <strong>{State.MachineDetails.CHAPA}</strong>
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            Série: <strong>{State.MachineDetails.SERIE}</strong>
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            Código do Depósito: <strong>{State.MachineDetails.DL}</strong>
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            Filial: <strong>{State.MachineDetails.N1_ZZFILIA}</strong>
          </Typography>
          {State.MachineDetails.pastMonthsEqInv.length > 0 ? (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
              >
                <Typography>Pendencias EQ</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {State.MachineDetails.pastMonthsEqInv.map(pastMonth =>
                    <div key={pastMonth.Refdt} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography variant='subtitle1'>
                        {capitalizeMonthFirstLetter(moment(pastMonth.Refdt).format('MMMM'))}
                      </Typography>
                      <Typography variant='subtitle1'>
                        <strong>{pastMonth.Faltam} Produtos</strong>
                      </Typography>
                    </div>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          ) : null}
        </>
      )}

    </DraggableDialogControlled>
  )
}

const mapStateToProps = (store: IStore) => ({
  State: store.MachinesState
})

const mapDispatchToProps = (dispatch: Dispatch<{ type: string }>) =>
  bindActionCreators(
    {
      SetDialogState,
      SetMachineDetails,
      SetMachineRefs
    },
    dispatch
  );

export const Details = connect<{
  State: IMachinesState;
}, {
  SetDialogState: (value: boolean) => {
    type: string;
    value: boolean;
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
  IStore>(mapStateToProps, mapDispatchToProps)(DetailsWithState)

const DetailsInitialState = {
  N1_ZZFILIA: "",
  CHAPA: "",
  SERIE: "",
  CLICOD: "",
  CLILJ: "",
  DL: "",
  Modelo: "",
  pastMonthsEqInv: []
};
