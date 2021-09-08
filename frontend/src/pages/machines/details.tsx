import React, { useState } from 'react'
import { api } from "../../services/api";
import { Toast } from "../../components/toasty";

import Typography from "@material-ui/core/Typography";
import { InfoOutlined } from "@material-ui/icons";

import { ClearButton } from "../../components/buttons";
import {
    DraggableDialogController
} from "../../components/dialogs";
import Inventory from './inventory'

interface IDetalhes {
    N1_ZZFILIA: string;
    CHAPA: string;
    SERIE: string;
    CLICOD: string;
    CLILJ: string;
    DL: string;
    Modelo: string;
}

interface IProps {
    chapa: string;
    DL: string
    references: IReferences[]
}

interface IReferences {
    Refdt: string;
    RefUd: string;
    RefPdt: string;
}

const Details = ({ chapa, DL, references }: IProps): JSX.Element => {
    const [machineInfo, setMachineInfo] = useState<IDetalhes>(DetailsInitialState);
    const [open, setOpen] = useState(false)

    const handleOpen = async (CHAPA: string) => {
        setOpen(true);
        try {
            const response = await api.get(`/machines/details/${DL}/${CHAPA}`);

            setMachineInfo(response.data[0]);
        } catch (err) {
            Toast("Não foi possivel trazer as informações da máquina", "error");
        }
    }

    const handleCloseDialog = () => {
        setOpen(false);
        setMachineInfo(DetailsInitialState);
    };

    return (
        <>
            <ClearButton
                disabled={false}
                label={<InfoOutlined />}
                onClick={() => handleOpen(chapa)}
            />

            <DraggableDialogController
                open={open}
                title={`Máquina ${machineInfo.Modelo}`}
                onClose={handleCloseDialog}
                extraActions={
                    <Inventory Info={machineInfo} Refs={references} DLCod={DL} />
                }
            >
                <Typography gutterBottom variant="subtitle1">
                    CHAPA: <strong>{machineInfo.CHAPA}</strong>
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                    Série: <strong>{machineInfo.SERIE}</strong>
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                    DL: <strong>{machineInfo.DL}</strong>
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                    Filial: <strong>{machineInfo.N1_ZZFILIA}</strong>
                </Typography>
            </DraggableDialogController>
        </>
    )
}

export default Details

const DetailsInitialState = {
    N1_ZZFILIA: "",
    CHAPA: "",
    SERIE: "",
    CLICOD: "",
    CLILJ: "",
    DL: "",
    Modelo: "",
};