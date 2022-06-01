import api from "../services/api";
import { useAlert } from "react-alert";
import React, { Fragment, useState } from "react";
import Card from "../components/Card";
import RefreshData from "../utils/refreshData";
import { compare } from "../utils/orderById";


const Feed = () => {
    const alert = useAlert();
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
            alert.error('Sessão inválida! Faça login novamente.')
            setTimeout(() => {
                const btnV = document.getElementById('login')
                btnV.click()
            }, 1500);
        } else {
            localStorage.removeItem(`token`)
            localStorage.removeItem('viewPosts')
            alert.show(`Erro ${respostaFedd.status} - ${respostaFedd.message}`);
            setTimeout(() => {
                const btnV = document.getElementById('login')
                btnV.click()

            }, 1500);
        }
    })

    function FeedPosts() {

        const fedds = JSON.parse(localStorage.getItem('viewPosts'))
        if (fedds !== null) {
            fedds.sort(compare)
        }

        var setViewFedds;
        if (fedds === null) {
            setViewFedds = []
        } else {
            setViewFedds = fedds
        }

        const [feed, setFeed] = useState(setViewFedds)

        React.useEffect(() => {
            const interval = setInterval(() => {
                RefreshData()
                const fedds = JSON.parse(localStorage.getItem('viewPosts'))
                if (fedds !== null) {
                    fedds.sort(compare)
                }
                setFeed(fedds)
            }, 5000);
            return () => clearInterval(interval)
        }, []);

        const renderCards = (gallery, key) => {
            var youLike = false;
            if (gallery.likes !== null && gallery.likes !== undefined && gallery.likes !== '') {
                const likes = gallery.likes.split(',')
                const user = sessionStorage.getItem('userId')
                likes.forEach(element => {
                    if (element === user) {
                        youLike = true
                    }
                });
            }

            return (
                <div key={gallery.uuid}>
                    <Card
                        uuid={gallery.uuid}
                        userPost={gallery.nickname}
                        name={gallery.name}
                        likes={gallery.likes}
                        post={gallery.post}
                        youlike={youLike}
                        data={gallery.date}
                    />
                </div>
            )
        }


        if (fedds === null || fedds.length === 0) {
            return (<><div style={{ 'display': 'flex', 'justifyContent': 'center', 'width': '100%', color: '#FFFFFF' }}><h5>Nada para mostrar ainda.</h5></div></>)
        } else {
            return (
                <div className="list-prod" id='list-prod' style={{ 'width': '100%', 'fontSize': '15px' }}>
                    {feed.map(renderCards)}
                </div>
            )
        }
    }

    async function sendPost() {
        document.getElementById('btnSendPost')['disabled'] = true
        const textPost = document.getElementById('text-post')['value']
        if (textPost.length > 3) {
            alert.info('Enviando post...')

            const token = localStorage.getItem(`token`)
            const dadosPost = { "post": textPost }
            var resposta;
            await api({
                method: 'POST',
                url: `/user/post`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: dadosPost
            }).then(resp => {
                document.getElementById('text-post')['value'] = ''
                respostaFedd = resp.data;
                alert.success('Post enviado.')
                alert.info('Atualizando')
                api({
                    method: 'GET',
                    url: `/user/posts`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    }
                }).then(resp => {
                    alert.success('Atualizado')
                    respostaFedd = resp.data;
                    localStorage.setItem(`viewPosts`, JSON.stringify(resp.data.posts[0]))
                    localStorage.setItem(`usersPosts`, JSON.stringify(resp.data.users[0]))
                }).catch(error => {
                    respostaFedd = error.toJSON();
                    if (respostaFedd.status === 500) {
                        alert.error('Sessão inválida! Faça login novamente.')
                    } else {
                        alert.show(`Erro ${respostaFedd.status} - ${respostaFedd.message}`);
                    }
                })
                //localStorage.setItem(`viewPosts`, JSON.stringify(resp.data.posts[0]))
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 500) {
                    alert.error('Erro interno.')
                } else {
                    alert.show(`Erro ${resposta.status} - ${resposta.message}`);
                }
            })



        } else {
            alert.info('Texto muito curto.')
        }
        document.getElementById('btnSendPost')['disabled'] = false
    }

    return (<>
        <Fragment>
            <div className='logo-page'>
                <h3>Feed</h3>
            </div>
            <textarea id='text-post' style={{ margin: '10px 0 15px 0', width: '100%', height: '100px', maxWidth: '100%', maxHeight: '150px' }}></textarea>
            <button className='btn-bar btn-g btn-l' id='btnSendPost' onClick={sendPost}>Postar</button>
            <br></br>
            <br></br>
            <FeedPosts></FeedPosts>
        </Fragment>
    </>)
}

export default Feed;
