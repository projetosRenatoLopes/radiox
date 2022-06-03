import api from "../services/api"
import { useAlert } from "react-alert";

const VerifySession = () => {
    const alert = useAlert();
    const token = localStorage.getItem('token')

    if (token === "" || token === null || token === undefined) {
        // const btn = document.getElementById('login')
        // if (btn !== null){
        //     btn.click()
        // }
    } else {
        var resposta;
        api({
            method: 'POST',
            url: `/user/validtoken`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        }).then(resp => {
            resposta = resp.data;
            if (resp.status === 200) {
                localStorage.setItem(`user`, resposta.user)
                localStorage.setItem(`userId`, resposta.id)
                localStorage.setItem(`nickName`, resposta.nickname)
            } else {
                alert.error('Erro ao verificar sessão')
            }

        }).catch(error => {
            resposta = error.toJSON();
            if (resposta.status === 401) {
                localStorage.removeItem(`token`)
                localStorage.removeItem(`user`)
                localStorage.removeItem(`usersPosts`)
                localStorage.removeItem(`userId`)
                localStorage.removeItem(`nickName`)
                localStorage.removeItem('viewPosts')
                alert.error('Sessão inválida! Faça login novamente.')
            } else {
                //localStorage.removeItem(`token`)
                alert.show(`Erro ${resposta.status} - ${resposta.message}`);
            }
        })
    }
}

export default VerifySession;