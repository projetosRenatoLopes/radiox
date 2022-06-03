
import api from "../services/api.js";
import { useState } from "react";
import React from "react";
import { useAlert } from "react-alert";


const Administrador = () => {
    const alert = useAlert();
    var [linksRadio, setLinksRadio] = useState([])
    React.useEffect(() => {
        const interval = setInterval(() => {
            var link;
            api({
                method: 'GET',
                url: `/user/links`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(resp => {
                link = resp.data;
                if (link === "") {
                    console.log('0 links retornados')
                } else {
                    if (JSON.stringify(linksRadio) !== JSON.stringify(link)) {
                        console.log(linksRadio)
                        console.log(link)
                        console.log("----------")
                        linksRadio = link
                        setLinksRadio(link)
                    }
                }
            }).catch(error => {
                link = error.toJSON();
                if (link.status === 401) {
                    alert.error(link)
                } else {
                    alert.error(link)
                }
            })
        }, 2000);
        return () => clearInterval(interval)
    }, []);



    function LinksCad() {

        const renderCards = (gallery, key) => {
            const btnShow = () => {
                if (gallery.onlive === 'noar') {
                    return (<button className="btn-bar btn-g btn-r" style={{ margin: '5px 0 10px 5px' }}>Tocando agora</button>)
                } else {
                    return (<button className="btn-bar btn-g btn-l" style={{ margin: '5px 0 10px 5px' }} onClick={setNoAr}>Colocar no ar</button>)
                }
            }

            const setNoAr = () => {
                var link;
                api({
                    method: 'PUT',
                    url: `/user/links`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: { "id": gallery.id }
                }).then(resp => {
                    alert.success(resp.statusText)
                }).catch(error => {
                    link = error.toJSON();
                    if (link.status === 401) {
                        alert.error(link.status)
                    } else {
                        alert.error(link.status)
                    }
                })
            }

            return (
                <div key={gallery.name} style={{ border: '1px solid #FFFFFF', margin: '0 0 10px 0' }}>
                    <h3 style={{ color: '#FFFFFF', width: "100%", margin: '5px 0 0 5px' }}>{gallery.name}</h3>
                    <p style={{ color: '#FFFFFF', width: "100%", margin: '5px 0 0 5px' }}>{gallery.id}</p>
                    <p style={{ color: '#FFFFFF', width: "100%", margin: '5px 0 0 5px' }}>{gallery.link}</p>
                    {btnShow()}
                </div>
            )
        }

        if (linksRadio === null || linksRadio.length === 0) {
            return (<><div style={{ 'display': 'flex', 'justifyContent': 'center', 'width': '100%', color: '#FFFFFF' }}><h5>Nada para mostrar ainda.</h5></div></>)
        } else {
            return (
                <div className="list-prod" id='list-prod' style={{ 'width': '100%', 'fontSize': '15px' }}>
                    {linksRadio.map(renderCards)}
                </div>
            )
        }
    }

    const cadastrarEmpresa = () => {

        const admin = sessionStorage.getItem('token')

        if (admin === null) {

            return (<>
                <div className="data-checkout">
                    <input type='text' id="ad-user" placeholder="Login" style={{ 'width': '100%' }}></input>
                    <input type='password' id="ad-pass" placeholder="Senha" style={{ 'width': '100%' }}></input>
                    <button className="btn btn-success" onClick={login}>Entrar</button>
                </div>
            </>)
        } else {

            return (<>
                <div style={{ color: '#FFFFFF' }}>
                <div style={{ border: '1px solid #FFFFFF', margin: '0 0 10px 0' }}>
                        <input id='sql' type='text' placeholder="SQL" style={{ color: '#FFFFFF', width: "90%", margin: '5px 0 0 5px', border: '1px solid #FFFFFF', height: '30px' }}></input>
                        <button className="btn-bar btn-g btn-l" style={{ margin: '5px 0 10px 5px' }} onClick={querySql} >Executar comando</button>
                    </div>
                    <div style={{ border: '1px solid #FFFFFF', margin: '0 0 10px 0' }}>
                        <input id='nome' type='text' placeholder="Nome" style={{ color: '#FFFFFF', width: "90%", margin: '5px 0 0 5px', border: '1px solid #FFFFFF', height: '30px' }}></input>
                        <input id='link' type='text' placeholder="Link" style={{ color: '#FFFFFF', width: "90%", margin: '5px 0 0 5px', border: '1px solid #FFFFFF', height: '30px' }}></input>
                        <button className="btn-bar btn-g btn-l" style={{ margin: '5px 0 10px 5px' }} onClick={newLink} >Inserir novo link</button>
                    </div>
                    <LinksCad></LinksCad>
                </div>
            </>)
        }
    }

    const newLink = () => {
        const nome = document.getElementById('nome')['value']
        const link = document.getElementById('link')['value']
        if (nome === "" || link === "") {
            alert.info("Há CAMPO vazio")
        } else {
            var resposta;
            api({
                method: 'POST',
                url: `/user/link`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { "nome": nome, "link": link }
            }).then(resp => {
                alert.success(resp.statusText)
                document.getElementById('nome')['value'] = ""
                document.getElementById('link')['value'] = ""
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 401) {
                    alert.error(resposta.status)
                } else {
                    alert.error(resposta.status)
                }
            })
        }
    }

    const querySql = async () => {

        const sql = document.getElementById('sql')['value']        
        const token = sessionStorage.getItem(`token`)
        if (sql === "" ){
            alert.info("CAMPO SQL vazio")
        } else {
            var resposta;
            await api({
                method: 'POST',
                url: `/user/sql`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: { "sql": sql}
            }).then(resp => {
                alert.success(resp.statusText)
                //document.getElementById('sql')['value'] = ""
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 401) {
                    alert.error(resposta.status)
                } else {
                    alert.error(resposta.status)
                }
            })
        }
    }

    const login = async () => {
        document.getElementById('msg')['textContent'] = 'Entrando...'
        document.getElementById('msg').style.color = 'blue'
        document.getElementById('msg').style.animation = 'mynewmove 4s 2'

        const user = await document.getElementById('ad-user')['value']
        const pass = await document.getElementById('ad-pass')['value']

        const dadosUser = await {
            "user": user,
            "password": pass
        }

        await api({
            method: 'POST',
            url: '/admin',
            data: dadosUser,
        }).then(async res => {
            if (res.status === 204) {
                document.getElementById('msg')['textContent'] = 'Usuário e/ou senha incorretos'
                document.getElementById('msg').style.color = 'red'
            } else if (res.status === 200) {
                if (res.data.token !== undefined && res.data.id !== undefined) {
                    sessionStorage.setItem('token', res.data.token)
                    sessionStorage.setItem('userId', res.data.id)
                }
                document.getElementById('msg')['textContent'] = res.data.name
                document.getElementById('msg').style.color = 'green'
                window.location.href = '/admingpco'
            } else {
                document.getElementById('msg')['textContent'] = 'Erro ao consultar usuário! Tente novamente.'
                document.getElementById('msg').style.color = 'red'
            }
        }).catch(error => {
            document.getElementById('msg')['textContent'] = 'Erro ao consultar usuário! Tente novamente.'
            document.getElementById('msg').style.color = 'red'
        })


    }

    return (
        <>
            <div className='logo-page'>
                <h3>Área Administrativa</h3>
            </div>
            <h5 id='msg' style={{ 'width': 'auto', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}> </h5>
            {cadastrarEmpresa()}

        </>
    )
}

export default Administrador;