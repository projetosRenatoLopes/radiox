import api from "../services/api"
import InputEmail from "../components/InputEmail";
import InputPass from "../components/InputPass";

const Login = () => {
    const token = localStorage.getItem(`token`)
    if (token !== null && token !== undefined) {
        const btnV = document.getElementById('home')
        btnV.click()
    }

    const signin = async () => {
        document.getElementById('msg')['textContent'] = 'Entrando...'
        document.getElementById('msg').style.color = 'blue'
        const user = document.getElementById('user')['value']
        const pass = document.getElementById('pass')['value']

        const dadosUser = {
            "user": user,
            "password": pass
        }

        await api({
            method: 'POST',
            url: '/user/login',
            data: dadosUser,
        }).then(async res => {
            if (res.status === 204) {
                document.getElementById('msg')['textContent'] = 'Usuário e/ou senha incorretos'
                document.getElementById('msg').style.color = 'red'
            } else if (res.status === 200) {
                if (res.data.token !== undefined && res.data.id !== undefined) {
                    localStorage.setItem('token', res.data.token)
                    sessionStorage.setItem('userId', res.data.id)
                    localStorage.setItem(`user`, res.data.name)
                    localStorage.setItem(`nickName`, res.data.nickname)
                }
                document.getElementById('msg')['textContent'] = res.data.name
                document.getElementById('msg').style.color = 'green'
                const btnV2 = document.getElementById('setuser')
                btnV2.click()
                const btnV = document.getElementById('feed')
                btnV.click()
            } else {
                document.getElementById('msg')['textContent'] = 'Erro ao consultar usuário! Tente novamente.'
                document.getElementById('msg').style.color = 'red'
            }
        }).catch((error) => {
            if (error.message === 'Request failed with status code 401') {
                document.getElementById('msg')['textContent'] = `${error.name} - Você não tem permissão para entrar nesta página.`
                document.getElementById('msg').style.color = 'red'
            } else {
                document.getElementById('msg')['textContent'] = 'Erro ao consultar usuário! Tente novamente.'
                document.getElementById('msg').style.color = 'red'
            }
        })
    }

    return (
        <>
            <div className='logo-page'>

            </div>
            <h5 id='msg' style={{ 'width': 'auto', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}> </h5>
            <div className="field-login">

                {/* <input type='text'  placeholder="Login" style={{ 'width': '50%' }}></input>
            <input type='password' placeholder="Senha" style={{ 'width': '50%' }}></input> */}
                <InputEmail defaultValue={''} className='input-user' placeholder='Usuário' />
                <InputPass id='pass' className='input-pass' placeholder='Senha' />
                <button type='submit' className="btn-co btn-l btn-g" onClick={signin} style={{ 'marginTop': '15px', 'width': '150px' }}>Entrar</button>
            </div>
        </>
    )

}

export default Login;