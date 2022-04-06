import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import {
  Apartment as ApartmentIcon,
  ShoppingCart as ShoppingCartIcon
} from '@material-ui/icons'

import Inventory from './inventory/App';
import Orders from './orders/App';

import { GlobalStyle } from './styles/global'
import { SelectorContainer, AppButtons } from './components/styles'

export const AppSelector = () => {
  const [appName, setAppName] = useState<IAppName>(null)
  // const history = useHistory()

  // console.log(useHistory)

  const whichAppShouldBeUsed = (): JSX.Element => {
    switch (appName) {
      case null:
        return <Selector
          onSelectApp={setAppName}
        />
      case 'orders':
        return <Orders />
      case 'inventory':
        return <Inventory />
    }
  }

  return (
    <>
      <GlobalStyle />
      {whichAppShouldBeUsed()}
    </>
  )
}

const Selector = ({ onSelectApp }: ISelectorProps) => {


  return (
    <SelectorContainer>

      <AppButtons onClick={() => {
        // history.push('/')
        onSelectApp('inventory')
      }} >
        <ApartmentIcon fontSize='large' />
        INVENTÁRIO PILÃO PROFESSIONAL
      </AppButtons>

      <AppButtons onClick={() => {
        // history.push('/')
        onSelectApp('orders')
      }} >
        <ShoppingCartIcon fontSize='large' />
        ENCOMENDA DE INSUMOS
      </AppButtons>

    </SelectorContainer>
  )
}

type IAppName = null | 'orders' | 'inventory'

interface ISelectorProps {
  onSelectApp: (props: IAppName) => void,
}