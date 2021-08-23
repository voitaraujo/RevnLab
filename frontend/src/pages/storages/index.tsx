import React, { useState, useEffect } from 'react'
import { api } from '../../services/api'


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import { InfoOutlined, DetailsRounded, AccountTreeOutlined } from '@material-ui/icons'

import { DraggableDialog, FullScreenDialog } from '../../components/dialogs'
import { InputNumber } from '../../components/inputNumber'
import { ClearButton } from '../../components/buttons'

interface ProvInterf {
    cod: string,
    prod: string,
    qtd_ant: string,
    qtd: string,
}

interface IDepositos {
    DLCod: string,
    DLNome: string,
}

const Storages = (): JSX.Element => {
    const [depositos, setDepositos] = useState<IDepositos[]>([])
    const [produtos, setProdutos] = useState<ProvInterf[]>([
        {
            cod: '004433',
            prod: 'Pacote de Achocolatado',
            qtd_ant: '50',
            qtd: '',
        },
        {
            cod: '003994',
            prod: 'Pacote de Acucar',
            qtd_ant: '36',
            qtd: '',
        }
    ])

    useEffect(() => {
        async function load() {
            try {
                const response = await api.get(`/storages`)

                setDepositos(response.data)
            } catch (err) {

            }
        }
        load()
    }, [])

    const handleLoadInventory = () => {

    }

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
        const aux = [...produtos]

        aux[index].qtd = event.target.value

        setProdutos(aux)
    }

    return (
        <List>
            {depositos.map(DL =>
                <>
                    <ListItem>
                        <ListItemIcon>
                            {DL.DLCod}
                        </ListItemIcon>
                        <ListItemText
                            primary={DL.DLNome}
                        />
                        {/* <FullScreenDialog title='Detalhes da máquina X' buttonLabel={<DetailsRounded />}>
                            <List>
                                {produtos.map((item, i) => (
                                    <div key={item.cod}>
                                        <ListItem>
                                            <ListItemIcon>
                                                {item.cod}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.prod}
                                                secondary={`Último mes: ${item.qtd_ant}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <InputNumber
                                                    decimals={0}
                                                    onChange={(event) => handleValueChange(event, i)}
                                                    disabled={false}
                                                    label='Qtd'
                                                    value={item.qtd}
                                                    type='outlined'
                                                />
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        <Divider />
                                    </div>
                                ))}
                            </List>
                        </FullScreenDialog> */}
                        <ClearButton label={<AccountTreeOutlined />} disabled={false} onClick={() => {}}/>
                        <DraggableDialog title='Detalhes do DL' buttonLabel={<InfoOutlined />}>
                            <p>oi</p>
                        </DraggableDialog>
                    </ListItem>
                    <Divider />
                </>
            )}

        </List>
    )
}

export default Storages
