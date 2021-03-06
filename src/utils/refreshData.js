import api from '../../src/services/api';

const RefreshData = async () => {
    const token = localStorage.getItem(`token`)
    var respostaFedd;
    api({
        method: 'GET',
        url: `/user/posts`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }
    }).then(resp => {
        respostaFedd = resp.data;
        if (respostaFedd === "") {
            localStorage.setItem(`viewPosts`, JSON.stringify([]))
            localStorage.setItem(`usersPosts`, JSON.stringify([]))
        } else {
            localStorage.setItem(`viewPosts`, JSON.stringify(resp.data.posts))
            localStorage.setItem(`usersPosts`, JSON.stringify(resp.data.users[0]))
        }
    }).catch(error => {
        console.log(error)
        respostaFedd = error.toJSON();
        if (respostaFedd.status === 401) {
            localStorage.removeItem(`token`)
            localStorage.removeItem(`user`)
            localStorage.removeItem(`usersPosts`)
            localStorage.removeItem(`userId`)
            localStorage.removeItem(`nickName`)
            localStorage.removeItem('viewPosts')
            const btnV = document.getElementById('login')
            btnV.click()
        } else {
            console.log(error)
        }
    })

}

export default RefreshData;