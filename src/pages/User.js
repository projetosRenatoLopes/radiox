import InputEmail from "../components/InputEmail";
import InputPass from "../components/InputPass";
import api from "../services/api";
import { useAlert } from "react-alert";
import React, { Fragment, useState } from "react";
import VerifySession from "../utils/verifySession";
import { base64_encode } from "../utils/convertImage";


const User = () => {
    const avatarUser = localStorage.getItem('avatar')
    var imgDefault = '/img/noavatar.peg';
    if(avatarUser !== null && avatarUser !== undefined && avatarUser !== ""){
        imgDefault = avatarUser
    }
    const [imgUser, setImgUser] = useState(imgDefault)
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
            if (passTwo === "") {
                cleanValidNewPass();
                return true
            } else {
                document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("validation-pass").innerText = ("Digite a nova senha nos dois campos.")
                return false
            }
        } else if (pass.length < '6') {
            document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-pass").innerText = ("Sua nova senha deve ter 6 dígitos ou mais.");
            return false;
        } else if (pass !== passTwo) {
            if (passTwo === "") {
                document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("validation-pass").innerText = ("Digite a nova senha nos dois campos.");
                return false;
            } else {
                document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("validation-pass").innerText = ("Senhas não conferem.");
                return false;
            }
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
        } else if (name.length > 15) {
            document.getElementById("user").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-name").innerText = ("O campo Nome exedeu o tamanho limite de caracteres (15)")
            return false;
        } else {
            cleanValidName();
            return true;
        }
    }

    const maxCaracter = (idEl, sizeMax) => {
        var el = document.getElementById(idEl)["value"];
        if (el.length > sizeMax) {
            document.getElementById(idEl)["value"] = el.slice(0, sizeMax)
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
                var newPassEdit = document.getElementById('new-pass')['value']
                if (newPassEdit === '') {
                    newPassEdit = passEdit;
                }
                const idEdit = localStorage.getItem('userId')
                const userEdited = [{ "name": nameEdit, "pass": passEdit, "newpass": newPassEdit, "id": idEdit, avatar: imgUser }]
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

    async function editImg() {
        const token = localStorage.getItem(`token`)

        if (token === null || token === "") {
            alert.show('Erro ao enviar informações!\nFeche a página e abra novamente novamente.')
        } else {
            const imgUser = localStorage.getItem('imgUpload')
            if (imgUser === null || imgUser === "" || imgUser === undefined) {
                alert.show('Erro ao carregar a imagem! Tente selecionar o arquivo novamente.')
            } else {
                const userEdited = [{ avatar: imgUser }]
                var resposta;
                await api({
                    method: 'PUT',
                    url: `/user/updateimg`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: userEdited
                })
                    .then(async resp => {
                        resposta = resp.data;
                        alert.success('Alterações salvas com sucesso')
                        localStorage.setItem(`avatar`, imgUser)                        
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

    function showMessage() {
        document.getElementById("validation-actual-pass").innerText = ("Insira a nova senha somente se for alterar.")
    }

    function hideMessage() {
        document.getElementById("validation-actual-pass").innerText = ("")
    }

    function validateFileType(event) {
        var pathFile = document.getElementById("imgPerfil")['value'];
        var fileName = pathFile;
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile === "jpg" || extFile === "jpeg" || extFile === "png") {
            let reader = new FileReader();
            let file = event.target.files[0];

            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImgUser(`${reader.result}`);
                localStorage.setItem('imgUpload', `${reader.result}`)
            };
            // let fileContent = base64_encode(fileName)
            // console.log(fileContent)
        } else {
            document.getElementById("imgPerfil")['value'] = ""
            alert.error("Selecione uma imagem no formato: jpg/jpeg ou png!");
        }
    }


    function previewText(event) {
        let file = event.target.value.replace(/^data:image\/[a-z]+;base64,/, "");
        console.log(`data:image/png;base64,${file}`);
    }

    // function downloadFile() {
    //   let nameFile = "Image.png";
    //   var a = document.createElement("a");
    //   a.href = preview.src;
    //   a.download = nameFile;
    //   a.click();
    // }



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
                <div className='avatar' style={{ backgroundColor: '#65676b', width: '80px', height: '80px', justifyContent: 'center', margin: '10px 0 0px 10px', borderRadius: '50%' }}>
                    <img alt='avatar' src={imgUser} style={{ width: '100%', height: '100%', borderRadius: '50%' }} ></img>
                </div>
                <h4 style={{ color: '#FFFFFF' }}>{nickName}</h4>
                <input className="btn-bar" id='imgPerfil' type='file' alt="img-perfil" accept="image/jpg, image/jpeg, image/png" onChange={(e) => validateFileType(e)} style={{ width: '40%', margin: '0 0 15px 0' }}></input>
                <button type='submit' className="btn-co btn-l btn-g" style={{ 'marginBottom': '15px', 'width': '150px' }} onClick={editImg}>Alterar Imagem</button>

                <InputEmail className='input-user' placeholder='Nome' defaultValue={userAdm} onChange={() => maxCaracter('user', '20')} />
                <div id="validation-name"></div>
                <InputPass id='pass' className='input-pass' placeholder='Senha atual' />
                <div id="validation-actual-pass"></div>
                <div style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }} onMouseOver={() => showMessage()} onMouseOut={() => hideMessage()}><InputPass id='new-pass' className='input-pass' placeholder='Nova senha' /></div>
                <InputPass id='rep-new-pass' className='input-pass' placeholder='Repita a nova senha' />
                <div id="validation-pass"></div>
                <button type='submit' className="btn-co btn-l btn-g" style={{ 'marginTop': '15px', 'width': '150px' }} onClick={editUser}>Salvar</button>
            </div>
        </>
    )


}

export default User;
