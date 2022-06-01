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
            localStorage.setItem(`viewPosts`, JSON.stringify(resp.data.posts[0]))
            localStorage.setItem(`usersPosts`, JSON.stringify(resp.data.users[0]))
        }
    }).catch(error => {
        respostaFedd = error.toJSON();
        if (respostaFedd.status === 500) {
            localStorage.removeItem(`token`)
            localStorage.removeItem('viewPosts')            
            setTimeout(() => {
                const btnV = document.getElementById('login')                
                btnV.click()
            }, 1500);
        } else {
            localStorage.removeItem(`token`)
            localStorage.removeItem('viewPosts')            
            setTimeout(() => {
                const btnV = document.getElementById('login')                
                btnV.click()

            }, 1500);
        }
    })

}

export default RefreshData;