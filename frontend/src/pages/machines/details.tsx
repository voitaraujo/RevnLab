import React, { useState, useEffect } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { api } from "../../services/api";
import { Toast } from "../../components/toasty";
import moment from 'moment'

import { ExpandMore } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import {
    DraggableDialogControlled
} from "../../components/dialogs";
import { Inventory } from './inventory'
import { Loading } from "../../components/loading";
import { capitalizeMonthFirstLetter } from "../../misc/commomFunctions";

import { IMachinesState } from '../../global/reducer/MachineReducerTypes'
import { SetDialogState, SetMachineDetails, SetMachineRefs } from '../../global/actions/MachineActions'
import { IStore } from '../../global/store/storeTypes'
import { IDetailsPropsWithRedux, IMachineDetalhes, IRefs } from './machinesTypes'

const DetailsWithState = ({ DLCod, Chapa, SetDialogState, State }: IDetailsPropsWithRedux): JSX.Element => {
    const [machineInfo, setMachineInfo] = useState<IMachineDetalhes>(DetailsInitialState);
    const [refs, setRefs] = useState<IRefs[]>([])
    const [fetching, setFetching] = useState<boolean>(true);

    useEffect(() => {
        async function handleOpen() {
            try {
                const responseDepInfo = await api.get<IMachineDetalhes>(`/machines/details/${DLCod}/${Chapa}`);
                const responseDepRefs = await api.get<{ Refs: IRefs[] }>(`/references/storages/${DLCod}`)

                setMachineInfo(responseDepInfo.data);
                setRefs(responseDepRefs.data.Refs);
                setFetching(false)
            } catch (err) {
                Toast("Não foi possivel recuperar as informações da máquina", "error");
            }
        }
        if (State.DialogState) {
            handleOpen()
        }
    }, [State.DialogState, DLCod, Chapa])

    const handleCloseDialog = () => {
        SetMachineRefs([]);
        SetDialogState(false);
        SetMachineDetails(DetailsInitialState);
        setFetching(true)
    };

    return (
        <DraggableDialogControlled
            open={State.DialogState}
            title={`Máquina ${machineInfo.Modelo}`}
            onClose={handleCloseDialog}
            extraActions={
                <Inventory Info={machineInfo} DLCod={DLCod} Refs={refs} />
            }
        >
            {fetching ? <Loading /> : (
                <>
                    <Typography gutterBottom variant="subtitle1">
                        CHAPA: <strong>{machineInfo.CHAPA}</strong>
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                        Série: <strong>{machineInfo.SERIE}</strong>
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                        Código do Depósito: <strong>{machineInfo.DL}</strong>
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                        Filial: <strong>{machineInfo.N1_ZZFILIA}</strong>
                    </Typography>
                    {machineInfo.pastMonthsEqInv.length > 0 ? (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                            >
                                <Typography>Pendencias EQ</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    {machineInfo.pastMonthsEqInv.map(pastMonth =>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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
    SetMachineRefs: (value: IRefs[]) => {
        type: string;
        value: IRefs[];
    };
}, {
    DLCod: string,
    Chapa: string
}, IStore>(mapStateToProps, mapDispatchToProps)(DetailsWithState)

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