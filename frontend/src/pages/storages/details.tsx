import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { api } from "../../services/api";
import moment from 'moment'

import { AccountTreeOutlined, InfoOutlined, ExpandMore } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';

import { DraggableDialogControlled } from "../../components/dialogs";
import { ClearButton } from "../../components/buttons";
import { Toast } from "../../components/toasty";
import { Inventory } from './inventory'
import { Loading } from "../../components/loading";
import { capitalizeMonthFirstLetter } from '../../misc/commomFunctions'

import { IDetailsProps, IDepositoDetalhes, IRefs } from './storageTypes'

const Details = ({ DL, Filial }: IDetailsProps): JSX.Element => {
    const [DLInfo, setDLInfo] = useState<IDepositoDetalhes>(DetailsInitialState);
    const [fetching, setFetching] = useState<boolean>(true);
    const [refs, setRefs] = useState<IRefs[]>([])
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const history = useHistory();

    const handleOpen = async (DLCOD: string, FILIAL: string) => {
        setOpen(true)
        try {
            const responseDepInfo = await api.get<IDepositoDetalhes>(`/storages/${FILIAL}/${DLCOD}`);
            const responseDepRefs = await api.get<{ Refs: IRefs[] }>(`/references/storages/${DLCOD}`)

            setDLInfo(responseDepInfo.data);
            setRefs(responseDepRefs.data.Refs);
            setFetching(false)
        } catch (err) {
            Toast("Não foi possivel trazer as informações do depósito", "error");
        }
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setDLInfo(DetailsInitialState);
        setFetching(true)
        setExpanded(false)
        setRefs([])
    };

    const handleMoveToMachines = (DLCOD: string, DLNAME: string) => {
        history.push(`/maquinaDL/${DLCOD}`)
        window.sessionStorage.setItem('ScreenDesc', DLNAME)
    }

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <ClearButton
                disabled={false}
                label={<InfoOutlined />}
                onClick={() => handleOpen(DL, Filial)}
            />

            <DraggableDialogControlled
                open={open}
                title={`Depósito ${DLInfo.DLNome}`}
                onClose={handleCloseDialog}
                extraActions={
                    <>
                        <Inventory Info={DLInfo} Refs={refs} />
                        <ClearButton
                            icon={<AccountTreeOutlined />}
                            label="Máquinas"
                            disabled={!DLInfo.DLCod}
                            onClick={() => handleMoveToMachines(DLInfo.DLCod, DLInfo.DLNome)}
                        />
                    </>
                }
            >{fetching ? <Loading /> : (
                <>
                    <Typography gutterBottom variant="subtitle1">
                        Endereço: <strong>{DLInfo.DLEndereco}</strong>
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                        Bairro: <strong>{DLInfo.DLBairro}</strong>
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                        Município:{" "}
                        <strong>
                            {DLInfo.DLMunicipio} - {DLInfo.DLUF}
                        </strong>
                    </Typography>
                    <Typography gutterBottom variant="subtitle1">
                        CEP: <strong>{DLInfo.DLCEP}</strong>
                    </Typography>
                    <br />
                    <Typography gutterBottom variant="subtitle1">
                        Equipamentos no Depósito: <strong>{DLInfo.DLQtEq}</strong>
                    </Typography>
                    {DLInfo.pastMonthsDLInv.length > 0 ? (
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                            >
                                <Typography>Pendencias DL</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    {DLInfo.pastMonthsDLInv.map(pastMonth =>
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

                    {DLInfo.pastMonthsDLEqInv.length > 0 ? (<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                        >
                            <Typography>Pendencias EQ</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                {DLInfo.pastMonthsDLEqInv.map(pastMonth =>
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
        </>
    )
}

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
