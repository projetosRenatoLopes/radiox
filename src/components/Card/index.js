import * as React from 'react';
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import api from '../../services/api';
import { useAlert } from "react-alert";
import RefreshData from '../../utils/refreshData';

const Card = ({ uuid, userPost, likes, post, name, youlike, data }) => {
    const alert = useAlert();
    var arrLikes;
    var arrLikesName = [];
    if (likes !== null) {
        arrLikes = likes.split(',')
        var users = JSON.parse(localStorage.getItem('usersPosts'))
        arrLikes.forEach(element => {
            users.forEach(user => {
                if (element === user.id)
                    arrLikesName.push(user.name);
            });
        });        
    } else {
        arrLikes = []
    }

    const btnLikeShow = () => {
        if (youlike === true) {
            return (<button className='btn-bar btn-g btn-r'><AiFillDislike></AiFillDislike></button>)
        } else {
            return (<button className='btn-bar btn-g btn-l' onClick={sendLike}><AiFillLike></AiFillLike></button>)
        }
    }

    async function sendLike() {
        const token = localStorage.getItem(`token`)
        const userId = sessionStorage.getItem('userId')

        var postLikes;
        var newLikes = []
        if (likes !== null) {
            postLikes = likes.split(',')
            newLikes = postLikes
        }
        newLikes.push(userId)
        newLikes = newLikes.join(',')

        const dadosPost = { "id": uuid, "likes": newLikes }
        var respostaFedd;
        await api({
            method: 'POST',
            url: `/user/like`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            data: dadosPost
        }).then(resp => {
            alert.success('LIKE')
            RefreshData()
        }).catch(error => {
            respostaFedd = error.toJSON();
            if (respostaFedd.status === 500) {
                alert.error('Erro interno.')
            } else {
                localStorage.removeItem(`token`)
                localStorage.removeItem('viewPosts')
                alert.show(`Erro ${respostaFedd.status} - ${respostaFedd.message}`);
                setTimeout(() => {
                    const btnV = document.getElementById('login')
                    // btnV.click()

                }, 1500);
            }
        })
    }
    const convDataPost = new Date(parseInt(data))
    var dia = convDataPost.getDate(),
        mes = (convDataPost.getMonth() + 1),
        ano = convDataPost.getFullYear(),
        hora = convDataPost.getHours(),
        min = convDataPost.getMinutes();
    if (min < 10) {
        // @ts-ignore
        min = '0' + min
    }
    if (hora < 10) {
        // @ts-ignore
        hora = '0' + hora
    }
    var dataPost;
    const date = new Date();
    const hr = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
    const day = String(date.getDate() + '/' + String(date.getMonth() + 1) + '/' + date.getFullYear())
    const hrPost = `${hora}:${min}`
    if (`${hora}:${min}` === hr && day === `${dia}/${mes}/${ano}`) {
        dataPost = 'Agora'
        // } else if (day === `${dia}/${mes}/${ano}`) {
        //     const teste = new Date(date - convDataPost )
        //     console.log(teste)
        //     const elapsedTime = (parseInt(hr) - parseInt(`${hora}:${min}`))
        //     dataPost = `Há ${elapsedTime} minutos`
    } else {
        dataPost = `${dia}/${mes}/${ano} - ${hora}:${min}`
    }

    return (
        <>
            <div className="card" key={uuid}>
                <div className='title' >
                    <p style={{ margin: '5px 0 0 10px', padding: '0' }}>{dataPost}</p>
                </div>
                <div className="img-text">
                    <div className="card-text" style={{ 'display': 'flex', 'alignItems': 'center', 'width': '100%' }}>
                        <div style={{ 'padding': '0 5px 0 5px' }}>{post}</div>
                    </div>
                </div>
                <div className='likes' style={{ display: 'flex', justifyContent: 'space-between', margin: '0 10px 5px 0', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <h5 className="card-title">{`${name} -`}</h5>
                        <p>{`${userPost}`}</p>
                    </div>
                    <div style={{ 'display': 'flex', alignItems: 'center', 'margin': '0 7px 0 0' }}>
                        {btnLikeShow()}
                        <strong>{arrLikes.length}</strong>
                        {/* <div id='likes' style={{zIndex:9999999,width:'100px',height:'50px',backgroundColor:'#202020',position:'absolute'}}></div> */}
                    </div>
                </div>
            </div>
            <br></br>
            <div>

            </div >
        </>
    )
}


export default Card;