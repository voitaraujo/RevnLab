import React from 'react'

import Typography from '@material-ui/core/Typography'

import { Container } from '../../components/AbstractComponents'

function Unauthorized(): JSX.Element {
    const safeLink = ():string => {
        return window.sessionStorage.getItem("token") ? '/inventario' : '/'
    }

    return(
        <Container style={{ flexDirection: 'column' }}>
            <Typography gutterBottom variant='h2' style={{ marginLeft: '8px' }}>Ops!</Typography>
            <br />
            <Typography gutterBottom variant='h4' style={{ marginLeft: '8px' }}>Parece que você não pode acessar essa página no momento, <br />clique <a href={safeLink()}>aqui</a> para retornar à aplicação.</Typography>
        </Container>
    )
}

export default Unauthorized