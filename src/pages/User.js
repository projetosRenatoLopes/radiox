import InputEmail from "../components/InputEmail";
import InputPass from "../components/InputPass";
import api from "../services/api";
import { useAlert } from "react-alert";
import React, { Fragment } from "react";
import VerifySession from "../utils/verifySession";


const User = () => {
    const alert = useAlert();
    VerifySession()
    React.useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('token')
            if (token === "" || token === null || token === undefined) {
                document.getElementById('login').click()
            }
        }, 2000);
        return () => clearInterval(interval)
    }, []);

    const validPass = () => {
        var pass = document.getElementById('pass')["value"];
        if (pass === '') {
            document.getElementById("pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-actual-pass").innerText = ("Digite sua senha atual.")
            return false;
        } else {
            cleanValidPass();
            return true;
        }
    }

    const cleanValidPass = () => {
        document.getElementById("pass").style.boxShadow = 'none';
        document.getElementById("validation-actual-pass").innerText = ("")
    }

    const validNewPass = () => {
        var pass = document.getElementById('new-pass')["value"];
        var passTwo = document.getElementById('rep-new-pass')["value"];
        if (pass === "") {
            document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-pass").innerText = ("Digite a nova senha.")
            return false;
        } else if (pass.length < '8') {
            document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-pass").innerText = ("Sua nova senha deve ter 8 dígitos ou mais.");
            return false;
        } else if (pass !== passTwo) {
            document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-pass").innerText = ("Senhas não conferem.");
            return false;
        } else {
            cleanValidNewPass();
            return true;
        }
    }

    const cleanValidNewPass = () => {
        document.getElementById("new-pass").style.boxShadow = 'none';
        document.getElementById("rep-new-pass").style.boxShadow = 'none';
        document.getElementById("validation-pass").innerText = ("")
    }

    const validName = () => {
        var name = document.getElementById('user')["value"];
        if (name === "") {
            document.getElementById("user").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-name").innerText = ("Digite o nome.")
            return false;
        } else {
            cleanValidName();
            return true;
        }
    }

    const cleanValidName = () => {
        document.getElementById("user").style.boxShadow = 'none';
        document.getElementById("validation-name").innerText = ("")
    }

    async function editUser() {
        validName();
        validPass();
        validNewPass();
        if (validPass() === true && validNewPass() === true && validName() === true) {
            const id = localStorage.getItem('nickName')
            const token = localStorage.getItem(`token`)
            if (id === null || id === "") {
                alert.show('Erro ao enviar informações!\nFeche a página e abra novamente novamente.')
            } else {
                const nameEdit = document.getElementById('user')['value']
                const passEdit = document.getElementById('pass')['value']
                const newPassEdit = document.getElementById('new-pass')['value']
                const idEdit = localStorage.getItem('userId')
                const userEdited = [{ "name": nameEdit, "pass": passEdit, "newpass": newPassEdit, "id": idEdit }]
                var resposta;
                await api({
                    method: 'PUT',
                    url: `/user/update`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: userEdited
                })
                    .then(async resp => {

                        resposta = resp.data;

                        localStorage.setItem('user', resposta.user)
                        alert.success('Alterações salvas com sucesso')
                        const btnV = document.getElementById('feed')
                        btnV.click()
                    }).catch(error => {
                        resposta = error.toJSON();
                        if (resposta.status === 404) {
                            alert.error('Erro 404 - Requisição invalida')
                        } else if (resposta.status === 401) {
                            alert.error('A senha atual está incorreta.')
                        } else { alert.show(`Erro ${resposta.status} - ${resposta.message}`) }
                    })
            }
        }
    }

    const userAdm = localStorage.getItem('user')
    const nickName = localStorage.getItem('nickName')
    return (
        <>
            <div className='logo-page'>
                <h3>Alterar usuário</h3>
            </div>
            <h5 id='msg' style={{ 'width': 'auto', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}> </h5>
            <div className="field-login">

                {/* <input type='text'  placeholder="Login" style={{ 'width': '50%' }}></input>
            <input type='password' placeholder="Senha" style={{ 'width': '50%' }}></input> */}
                <h4 style={{ color: '#FFFFFF' }}>Usuário: {nickName}</h4>
                <InputEmail className='input-user' placeholder='Nome' defaultValue={userAdm} />
                <div id="validation-name"></div>
                <InputPass id='pass' className='input-pass' placeholder='Senha atual' />
                <div id="validation-actual-pass"></div>
                <InputPass id='new-pass' className='input-pass' placeholder='Nova senha' />
                <InputPass id='rep-new-pass' className='input-pass' placeholder='Repita a nova senha' />
                <div id="validation-pass"></div>
                <button type='submit' className="btn-co btn-l btn-g" style={{ 'marginTop': '15px', 'width': '150px' }} onClick={editUser}>Salvar</button>
            </div>
        </>
    )


}

export default User;