import React, { useState } from 'react'
import moment from "moment";
import { api } from "../../services/api";

import { ReceiptOutlined } from "@material-ui/icons";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import { FullScreenDialog } from "../../components/dialogs";
import { Toast } from "../../components/toasty";
import { SelectControlled } from "../../components/select";
import { InputNumber } from "../../components/inputFormat";

interface IInventario {
    Refdt: string;
    Filial: string;
    DLCod: string;
    PROD: string;
    PRODUTO: string;
    Qtd: number | string | null;
}

interface IReferences {
    Refdt: string;
    RefUd: string;
    RefPdt: string;
}

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
    Info: IDetalhes
    Refs: IReferences[]
}

const Inventory = ({ Info, Refs }: IProps): JSX.Element => {
    const [produtos, setProdutos] = useState<IInventario[]>([]);
    // const [selectIndex, setSelectIndex] = useState("");

    const FixedDtInicial = moment().subtract(1, 'months').startOf("month").format();
    const FixedDtFinal = moment().subtract(1, 'months').endOf("month").format();

    const handleOpen = async (DLCOD: string, FILIAL: string, Ref?: IReferences) => {
        // setSelectIndex("");
        try {
            // const response = await api.get<IInventario[]>(
            //   `/inventory/storages/${DLCOD}/${FILIAL}/${Ref.RefPdt}/${Ref.RefUd}`
            // );
            const response = await api.get<IInventario[]>(
                `/inventory/storages/${DLCOD}/${FILIAL}/${FixedDtInicial}/${FixedDtFinal}`
            );

            setProdutos(response.data);
        } catch (err) {
            Toast("Falha ao carregar inventário", "error");
        }
    }

    const handleClose = () => {
        setProdutos([])
        // setSelectIndex("");
    }

    const handleValueChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ): void => {
        const aux = [...produtos];

        aux[index].Qtd = event.target.value;

        setProdutos(aux);
    };

    // const handleChangeSelect = (
    //     index: number | unknown,
    //     DL: string,
    //     FILIAL: string
    // ): void => {
    //     setSelectIndex(String(index));
    //     handleOpen(DL, FILIAL, Refs[Number(index)]);
    // };

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
                await api.put(`/inventory/storages/`, {
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
            title={`Inventário de ${Info.DLNome}`}
            buttonIcon={<ReceiptOutlined />}
            buttonLabel="Inventário"
            buttonColor="primary"
            buttonType="text"
            onConfirm={handleSubmit}
            onOpen={() => handleOpen(Info.DLCod, Info.Filial)}
            onClose={handleClose}
        >
            <SelectControlled
                // value={selectIndex}
                value={String(moment().subtract(1, 'months').month())}
                // onChange={(event) =>
                //   handleChangeSelect(
                //     event.target.value,
                //     Info.DLCod,
                //     Info.Filial
                //   )
                // }
                disabled={true}
                label="Referencia"
                variant="outlined"
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
                        <div key={item.PROD}>
                            <ListItem>
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