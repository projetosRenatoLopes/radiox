
import api from "../services/api.js";

const Administrador = () => {

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
                <h3>Olá Admin.</h3>
            </>)
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

    const logout = () => {
        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
        window.location.href = '/admingpco'
    }

    return (
        <>
            <div className='title-page'>
                <p>Rádio Xibungos - Admin</p>
            </div>

            <div className='logo-page'>
                <h3>Área Administrativa</h3>
            </div>
            <h5 id='msg' style={{ 'width': 'auto', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}> </h5>
            {cadastrarEmpresa()}

        </>
    )
}

export default Administrador;