import React, { useState } from 'react';
// import { useHistory } from "react-router-dom";

import {
  Apartment as ApartmentIcon,
  ShoppingCart as ShoppingCartIcon
} from '@material-ui/icons'

import Inventory from './inventory/App';
import Orders from './orders/App';

import { GlobalStyle } from './styles/global'
import {
  SelectorAppContainer,
  SelectorAppButtonsContainer,
  SelectorAppButtons,
  SelectorAppTitle
} from './components/styles'

export function AppSelector() {
  const [appName, setAppName] = useState<IAppName>(null);
  // const history = useHistory();

  const whichAppShouldBeUsed = (): JSX.Element => {
    switch (appName) {
      case null:
        return <Selector />
      case 'orders':
        return <Orders />
      case 'inventory':
        return <Inventory />
    }
  }

  const Selector = () => {
    return (
      <SelectorAppContainer>
        <SelectorAppTitle>SOLUÇÕES PILÃO PROFESSIONAL</SelectorAppTitle>
        <SelectorAppButtonsContainer>
          <SelectorAppButtons onClick={() => {
            // history.push('/')
            setAppName('inventory')
          }} >
            <ApartmentIcon fontSize='large' />
            INVENTÁRIO PILÃO PROFESSIONAL
          </SelectorAppButtons>

          <SelectorAppButtons onClick={() => {
            // history.push('/')
            setAppName('orders')
          }} >
            <ShoppingCartIcon fontSize='large' />
            ENCOMENDA DE INSUMOS
          </SelectorAppButtons>
        </SelectorAppButtonsContainer>
      </SelectorAppContainer>
    )
  }


  return (
    <>
      <GlobalStyle />
      {whichAppShouldBeUsed()}
    </>
  )
}


type IAppName = null | 'orders' | 'inventory'

// interface ISelectorProps {
//   onSelectApp: (props: IAppName) => void,
//   handleNavigation: (url: string) => void
// }