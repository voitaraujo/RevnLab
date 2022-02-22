import React, { useState } from "react";
import { api } from "../../services/api";
// import { useHistory } from 'react-router-dom'

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { Input } from "@material-ui/icons";

import { ClearButton } from "../../components/buttons";
import { Container } from "../../components/AbstractComponents";
import { InputSimple } from "../../components/input";
import { RED_PRIMARY } from "../../assets/colors";
import { Toast } from "../../components/toasty";
import { InputPhone } from "../../components/inputFormat";
import { IAuthResponse } from './loginTypes'

function Login(): JSX.Element {
  const [userCode, setUserCode] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [wait, setWait] = useState(false);

  const classes = useStyles();
  // const history = useHistory()

  const handleUpdateUserCode = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setUserCode(e.target.value);
  };

  const handleUpdateUserPassword = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setUserPassword(e.target.value);
  };

  const shouldEnableLogin = (): boolean => {
    if (userCode !== "" && userPassword !== "" && !wait) {
      return false;
    } else {
      return true;
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement> | null) => {
    setWait(true);

    if (e !== null) {
      e.preventDefault()
    }

    let toastId = null
    toastId = Toast('Aguarde...', 'wait')

    try {
      const response = await api.post<IAuthResponse>("/authentication", {
        user: userCode,
        password: userPassword,
      });

      Toast('Conectado!', 'update', toastId, 'success')
      response.data.user_token &&
        window.sessionStorage.setItem("token", response.data.user_token);
      response.data.user &&
        window.sessionStorage.setItem("user", response.data.user);
      window.sessionStorage.setItem("ScreenDesc", "Depósitos");

      // history.push('/inventario')
      // aqui não da pra usar o history.push porque o sessionStorage não é sincrono(vou chegar em inventário mais rapido do que vou gravar o token no navegador, ai da erro na rota)
      window.location.assign("/inventario");
    } catch (err) {
      Toast('Número ou Senha incorretos!', 'update', toastId, 'error')
      setWait(false);
    }
  };

  return (
    <Container>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              IV
            </Avatar>
          }
          title="Inventário"
          subheader="Login"
        />
        <CardContent>
          <form onSubmit={e => handleLogin(e)}>
            <InputPhone
              disabled={wait}
              focus={true}
              label="Código de Acesso"
              mask="(##) # ####-####"
              onChange={handleUpdateUserCode}
              value={userCode}
              type="standard"
            />
            <InputSimple
              onChange={handleUpdateUserPassword}
              label="Senha"
              value={userPassword}
              type="password"
              disabled={wait}
            />
          </form>
        </CardContent>
        <CardActions>
          <ClearButton
            label="Acessar"
            onClick={() => handleLogin(null)}
            disabled={shouldEnableLogin()}
            icon={<Input />}
          />
        </CardActions>
      </Card>
    </Container>
  );
}

export default Login;

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: RED_PRIMARY,
  },
});
