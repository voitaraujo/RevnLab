/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';

interface IProxy  {
  host?: string,
  port?: number
}

const ConnDTO: IProxy = {
  host: process.env.REACT_APP_API_URL,
  port: Number(process.env.REACT_APP_API_PORT)
}

export const api = axios.create({
  baseURL: `http://${ConnDTO.host}:${ConnDTO.port}`,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Authorization': `${sessionStorage.getItem("token")}`,
  },
  proxy: {
    host: ConnDTO.host!,
    port: ConnDTO.port!
  },
})
