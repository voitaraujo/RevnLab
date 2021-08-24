import React from 'react'

import { Container } from '../../components/AbstractComponents'

function Unauthorized(): JSX.Element {
    const safeLink = ():string => {
        return window.sessionStorage.getItem("token") ? '/inventario' : '/'
    }

    return(
        <Container>
            <h3>Ops!</h3>
            <h6>Parece que você não pode acessar essa página no momento, clique<a href={safeLink()}>aqui</a></h6>
        </Container>
    )
}

export default Unauthorized