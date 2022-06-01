import api from "../services/api";
import { useAlert } from "react-alert";
import React, { Fragment } from "react";

const Home = () => {
    const alert = useAlert();
    const token = localStorage.getItem(`token`)
    if (token === null || token === undefined) {

    } else {
        const token = localStorage.getItem(`token`)
        var resposta;
        api({
            method: 'POST',
            url: `/user/validtoken`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(resp => {
                resposta = resp.data;
                localStorage.setItem(`user`, resposta.user)
                sessionStorage.setItem('userId', resposta.id)

            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 500) {
                    localStorage.removeItem(`token`)
                    alert.error('Sessão inválida! Faça login novamente.')
                } else {
                    localStorage.removeItem(`token`)
                    alert.show(`Erro ${resposta.status} - ${resposta.message}`);
                }
            })
    }

    return (<>
        <Fragment>            
            <div className='logo-page'>
                <h3>Rádio Xibungos FM</h3>
            </div>
            <div className="gifsbottom">
                <img id="img-f" src='https://i.giphy.com/media/hStvd5LiWCFzYNyxR4/giphy.webp' />
            </div>
            <img style={{ width: '100%' }} id='music' src="https://i.gifer.com/origin/a0/a0fdfb0039405b9a8c222dd252be9565.gif" />

            <div className="gifsbottom">
                <img src="https://cdn.dicionariopopular.com/imagens/numero-nove.gif?auto_optimize=low" />
                <img src="https://cdn.dicionariopopular.com/imagens/meme-feliz.gif?auto_optimize=low" />
                <img src='https://cdn.dicionariopopular.com/imagens/homem-dancando.gif?auto_optimize=low' />
            </div>
        </Fragment>
    </>)
}

export default Home;
