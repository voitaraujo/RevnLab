import React, { useState } from 'react'
import { useHistory } from "react-router-dom";
import { api } from "../../services/api";

import { AccountTreeOutlined, InfoOutlined } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";

import { DraggableDialogController } from "../../components/dialogs";
import { ClearButton } from "../../components/buttons";
import { Toast } from "../../components/toasty";
import Inventory from './inventory'


interface IDetalhes {
    Filial: string;
    DLCod: string;
    GestorCod: string;
    DLQtEq: number;
    DLNome: string;
    DLEndereco: string;
    DLBairro: string;
    DLCEP: string;
    DLUF: string;
    DLMunicipio: string;
    DLMunicipioCod: string;
    DLStatus: string;
    DLLoja: string;
}

interface IProps {
    DL: string
    Filial: string
}

const Details = ({ DL, Filial }: IProps): JSX.Element => {
    const [DLInfo, setDLInfo] = useState<IDetalhes>(DetailsInitialState);
    const [open, setOpen] = useState(false);

    const history = useHistory();

    const handleOpen = async (DLCOD: string, FILIAL: string) => {
        setOpen(true)
        try {
            const response = await api.get(`/storages/${FILIAL}/${DLCOD}`);

            setDLInfo(response.data[0]);
        } catch (err) {
            Toast("Não foi possivel trazer as informações do depósito", "error");
        }
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setDLInfo(DetailsInitialState);
    };

    const handleMoveToMachines = (DLCOD: string, DLNAME: string) => {
        history.push(`/maquinaDL/${DLCOD}`)
        window.sessionStorage.setItem('ScreenDesc', DLNAME)
    }

    return (
        <>
            <ClearButton
                disabled={false}
                label={<InfoOutlined />}
                onClick={() => handleOpen(DL, Filial)}
            />

            <DraggableDialogController
                open={open}
                title={`Depósito ${DLInfo.DLNome}`}
                onClose={handleCloseDialog}
                extraActions={
                    <>
                        <Inventory Info={DLInfo} />
                        <ClearButton
                            icon={<AccountTreeOutlined />}
                            label="Máquinas"
                            disabled={!DLInfo.DLCod}
                            onClick={() => handleMoveToMachines(DLInfo.DLCod, DLInfo.DLNome)}
                        />
                    </>
                }
            >
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
                    Equipamentos no DL: <strong>{DLInfo.DLQtEq}</strong>
                </Typography>
            </DraggableDialogController>
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
};