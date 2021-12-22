//pacotes
import React from 'react'
import { useHistory } from "react-router-dom";
import moment from 'moment';
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'

//serviços e funções
import { capitalizeMonthFirstLetter } from '../../misc/commomFunctions'

//componentes visuais
import { AccountTreeOutlined, ExpandMore } from "@material-ui/icons";
import { Typography, Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core/";
import { DraggableDialogControlled } from "../../components/dialogs";
import { ClearButton } from "../../components/buttons";
import { Loading } from "../../components/loading";

//componentes funcionais
import { Inventory } from './inventory'

//tipos e interfaces
import { IDepositoDetalhes, IRefs, IDetailsPropsWithRedux } from './storageTypes'
import { IStore } from '../../global/store/storeTypes'
import { IStoragesState } from '../../global/reducer/StoragesReducer/StoragesReducerTypes'

//redux actions
import { SetStorageDetails, SetStorageRefs, SetDialogState } from '../../global/actions/Storage/StorageActions'

const DetailsWithRedux = ({ State, SetStorageDetails, SetStorageRefs, SetDialogState }: IDetailsPropsWithRedux): JSX.Element => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const history = useHistory();

  const handleCloseDialog = () => {
    SetDialogState(false);
    SetStorageDetails(DetailsInitialState);
    SetStorageRefs([])
    setExpanded(false)
  };

  const handleMoveToMachines = (DLCOD: string, DLNAME: string) => {
    history.push(`/maquinaDL/${DLCOD}`)
    window.sessionStorage.setItem('ScreenDesc', DLNAME)
  }

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <DraggableDialogControlled
      open={State.DialogState}
      title={`Depósito ${State.StorageDetails.DLNome}`}
      onClose={handleCloseDialog}
      extraActions={
        <>
          <Inventory />
          <ClearButton
            icon={<AccountTreeOutlined />}
            label="Máquinas"
            disabled={!State.StorageDetails.DLCod}
            onClick={() => handleMoveToMachines(State.StorageDetails.DLCod, State.StorageDetails.DLNome)}
          />
        </>
      }
    >{State.StorageDetails.DLCod === '' ? <Loading /> : (
      <>
        <Typography gutterBottom variant="subtitle1">
          Endereço: <strong>{State.StorageDetails.DLEndereco}</strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          Bairro: <strong>{State.StorageDetails.DLBairro}</strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          Município:{" "}
          <strong>
            {State.StorageDetails.DLMunicipio} - {State.StorageDetails.DLUF}
          </strong>
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          CEP: <strong>{State.StorageDetails.DLCEP}</strong>
        </Typography>
        <br />
        <Typography gutterBottom variant="subtitle1">
          Equipamentos no Depósito: <strong>{State.StorageDetails.DLQtEq}</strong>
        </Typography>
        {State.StorageDetails.pastMonthsDLInv.length > 0 ? (
          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
            >
              <Typography>Pendencias DL</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                {State.StorageDetails.pastMonthsDLInv.map(pastMonth =>
                  <div key={pastMonth.Refdt} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography variant='subtitle1'>
                      {capitalizeMonthFirstLetter(moment(pastMonth.Refdt).format('MMMM'))}
                    </Typography>
                    <Typography variant='subtitle1'>
                      <strong>{pastMonth.FaltamProdutos} Produtos</strong>
                    </Typography>
                  </div>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        ) : null}

        {State.StorageDetails.pastMonthsDLEqInv.length > 0 ? (<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
          >
            <Typography>Pendencias EQ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {State.StorageDetails.pastMonthsDLEqInv.map(pastMonth =>
                <div key={pastMonth.Ref}>
                  <Typography variant='subtitle1' gutterBottom={true}>
                    <strong>{capitalizeMonthFirstLetter(pastMonth.Ref)}</strong>
                  </Typography>
                  {pastMonth.Eqs.map(EQ => (
                    <div key={EQ.CHAPA} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Typography variant='subtitle2'>
                        {EQ.CHAPA}
                      </Typography>
                      <Typography variant='subtitle2'>
                        <strong>{EQ.Faltam} Produtos</strong>
                      </Typography>
                    </div>
                  ))}

                </div>
              )}
            </div>
          </AccordionDetails>
        </Accordion>) : null}
      </>
    )
      }

    </DraggableDialogControlled>
  )
}

const mapStateToProps = (store: IStore) => ({
  State: store.StoragesState
})

const mapDispatchToProps = (dispatch: Dispatch<{ type: string }>) =>
  bindActionCreators(
    {
      SetStorageDetails,
      SetStorageRefs,
      SetDialogState
    }
    , dispatch)

export const Details = connect<{
  State: IStoragesState
},
  {
    SetStorageDetails: (value: IDepositoDetalhes) => {
      type: string;
      value: IDepositoDetalhes;
    };
    SetStorageRefs: (value: IRefs[]) => {
      type: string;
      value: IRefs[];
    };
    SetDialogState: (value: boolean) => {
      type: string;
      value: boolean;
    };
  },
  unknown,
  IStore>(mapStateToProps, mapDispatchToProps)(DetailsWithRedux);

export default Details

const DetailsInitialState = {
  Filial: "",
  DLCod: "",
  GestorCod: "",
  DLQtEq: 0,
  DLNome: "",
  DLEndereco: "",
  DLBairro: "",
  DLCEP: "",
  DLUF: "",
  DLMunicipio: "",
  DLMunicipioCod: "",
  DLStatus: "",
  DLLoja: "",
  pastMonthsDLInv: [],
  pastMonthsDLEqInv: []
};