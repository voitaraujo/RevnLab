import React, { useState, useEffect } from "react";
import moment from "moment";
import { api } from "../../services/api";

import { ReceiptOutlined } from "@material-ui/icons";
import List from "@material-ui/core/List";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import { FullScreenDialog } from "../../components/dialogs";
import { SelectControlled } from "../../components/select";
import { Toast } from "../../components/toasty";
import { Loading } from "../../components/loading";
import { ListItemMemo } from './ListItem'
import { IInventoryProps, IProdutoInventário } from './machinesTypes'
import { capitalizeMonthFirstLetter } from "../../misc/commomFunctions";

export const Inventory = ({ Info, DLCod, Refs }: IInventoryProps): JSX.Element => {
  const [produtos, setProdutos] = useState<IProdutoInventário[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [tipo, setTipo] = useState<string>("SNACKS");
  const [selectedRef, setSelectedRef] = useState("");

  useEffect(() => {
    if (
      Info.CHAPA !== "" &&
      DLCod !== "" &&
      tipo !== "" &&
      selectedRef !== ""
    ) {
      loadInventoryDetails(Info.CHAPA, DLCod, tipo, selectedRef);
    } else {
      setProdutos([]);
    }
  }, [Info.CHAPA, DLCod, tipo, selectedRef]);

  const loadInventoryDetails = async (
    CHAPA: string,
    DL: string,
    Category: string,
    Refdt: string
  ) => {
    setFetching(true);
    try {
      const response = await api.get<IProdutoInventário[]>(
        `/inventory/machines/${DL}/${CHAPA}/${Category}/${moment(Refdt).format(
          "YYYY-MM-DD"
        )}`
      );

      setProdutos(response.data);
      setFetching(false);
    } catch (err) {
      Toast("Não foi possivel carregar o inventário da máquina", "error");
      setFetching(false);
    }
  };

  const handleClose = () => {
    setProdutos([]);
    setFetching(false);
    setSelectedRef("");
    setTipo('SNACKS')
  };

  const ApplyChangesToState = (item: IProdutoInventário, index: number) => {
    const aux = [...produtos]

    aux[index] = item
    
    setProdutos([...aux]);
  };

  const handleSubmit = async (): Promise<boolean> => {
    let shouldCloseModal = true;

    if (produtos.length === 0) {
      Toast("Inventário vazio", "default");
      shouldCloseModal = false;
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
        shouldCloseModal = false;
        break;
      }
    }

    if (shouldCloseModal) {
      try {
        await api.put(`/inventory/machines/`, {
          inventario: produtos,
        });

        Toast("Inventário salvo com sucesso", "success");
      } catch (err) {
        Toast("Falha ao salvar inventário", "error");
        shouldCloseModal = false;
      }
    }

    return shouldCloseModal;
  };

  return (
    <FullScreenDialog
      title={`Inventário do ativo ${Info.CHAPA}`}
      buttonIcon={<ReceiptOutlined />}
      buttonLabel="Inventário"
      buttonColor="primary"
      buttonType="text"
      onConfirm={handleSubmit}
      onClose={handleClose}
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
        {Refs.map((ref) => (
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
              <div key={item.SEL}>
                <ListItemMemo produto={item} index={i} changeHandler={ApplyChangesToState}/>
                <Divider />
              </div>
            ))
          )}
        </List>
      )}
    </FullScreenDialog>
  );
};
