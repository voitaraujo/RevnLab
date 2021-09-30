import React, { useState } from 'react'
import moment from "moment";
import { api } from "../../services/api";

import { ReceiptOutlined } from "@material-ui/icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import {
    FullScreenDialog
} from "../../components/dialogs";
import { InputNumber } from "../../components/inputFormat";
import { SelectControlled } from "../../components/select";
import { Toast } from "../../components/toasty";

interface IProps {
    Info: IDetalhes
    Refs: IReferences[]
    DLCod: string
}

interface IReferences {
    Refdt: string;
    RefUd: string;
    RefPdt: string;
}

interface IDetalhes {
    N1_ZZFILIA: string;
    CHAPA: string;
    SERIE: string;
    CLICOD: string;
    CLILJ: string;
    DL: string;
    Modelo: string;
}

interface IInventario {
    DLCod: string;
    PROD: string;
    SEL: string;
    PRODUTO: string;
    Qtd: number | string | null;
    Refdt: string;
    Filial: string;
    CHAPA: string;
}

const Inventory = ({ Info, Refs, DLCod }: IProps): JSX.Element => {
    const [produtos, setProdutos] = useState<IInventario[]>([]);
    // const [selectIndex, setSelectIndex] = useState("");

    const FixedDtInicial = moment().subtract(1, 'months').startOf("month").format();
    const FixedDtFinal = moment().subtract(1, 'months').endOf("month").format();


    const handleOpen = async (CHAPA: string, DL: string, Ref?: IReferences) => {
        // setSelectIndex("");
        try {
            // const response = await api.get<IInventario[]>(
            //   `/inventory/machines/${DL}/${CHAPA}/${Ref.RefPdt}/${Ref.RefUd}`
            // );
            const response = await api.get<IInventario[]>(
                `/inventory/machines/${DL}/${CHAPA}/${FixedDtInicial}/${FixedDtFinal}`
            );

            setProdutos(response.data);
        } catch (err) {
            Toast("Não foi possivel carregar o inventário da máquina", "error");
        }
    };

    const handleClose = () => {
        setProdutos([])
        // setSelectIndex("");
    }

    // const handleChangeSelect = (index: number | unknown, CHAPA: string): void => {
    //     setSelectIndex(String(index));
    //     handleOpen(CHAPA, DLCod, Refs[Number(index)]);
    // };

    const handleValueChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ): void => {
        const aux = [...produtos];

        aux[index].Qtd = event.target.value;

        setProdutos(aux);
    };

    const handleSubmit = async (): Promise<boolean> => {
        let test = true;

        if (produtos.length === 0) {
            Toast("Inventário vazio", "default");
            test = false;
        }

        for (let i = 0; i < produtos.length; i++) {
            if (
                produtos[i].Qtd === "" ||
                produtos[i].Qtd === null ||
                typeof produtos[i].Qtd == "undefined"
            ) {
                Toast(
                    "Qtd. de um ou mais itens do inventário não informados",
                    "default"
                );
                test = false;
                break;
            }
        }

        if (test) {
            try {
                await api.put(`/inventory/machines/`, {
                    inventario: produtos,
                });

                Toast("Inventário salvo com sucesso", "success");
            } catch (err) {
                Toast("Falha ao salvar inventário", "error");
                test = false;
            }
        }

        return test;
    };

    return (
        <FullScreenDialog
            title={`Inventário do ativo ${Info.CHAPA}`}
            buttonIcon={<ReceiptOutlined />}
            buttonLabel="Inventário"
            buttonColor="primary"
            buttonType="text"
            onConfirm={handleSubmit}
            onOpen={() => handleOpen(Info.CHAPA, DLCod)}
            onClose={handleClose}
        >
            <SelectControlled
                // value={selectIndex}
                value={String(moment().subtract(1, 'months').month())}
                // onChange={(event) =>
                //   handleChangeSelect(event.target.value, machineInfo.CHAPA)
                // }
                disabled={true}
                label="Referência"
                variant="outlined"
                enableVoidSelection={true}
            >
                {Refs.map((ref, i) => (
                    <MenuItem value={i} key={i}>
                        {moment(ref.RefPdt).format("L")}
                    </MenuItem>
                ))}
            </SelectControlled>
            <List>
                {produtos.length === 0 ? (
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
                    produtos.map((item, i) => (
                        <div key={`${item.PROD}${i}`}>
                            <ListItem>
                                <ListItemIcon>{item.SEL}</ListItemIcon>
                                <ListItemText
                                    primary={item.PRODUTO}
                                    secondary={`Código: ${item.PROD}`}
                                />
                                <ListItemSecondaryAction
                                    style={{ width: "10%", minWidth: "100px" }}
                                >
                                    <InputNumber
                                        decimals={0}
                                        onChange={(event) => handleValueChange(event, i)}
                                        disabled={false}
                                        label="Qtd"
                                        value={item.Qtd}
                                        type="outlined"
                                        focus={false}
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                            <Divider />
                        </div>
                    ))
                )}
            </List>
        </FullScreenDialog>
    )
}

export default Inventory