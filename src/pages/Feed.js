import api from "../services/api";
import { useAlert } from "react-alert";
import React, { Fragment, useState } from "react";
import Card from "../components/Card";
import RefreshData from "../utils/refreshData";
import { compare } from "../utils/orderById";
import VerifySession from "../utils/verifySession";
import { BsCardImage } from 'react-icons/bs'
import { MdVideoLibrary } from 'react-icons/md'
import { BiImageAdd } from 'react-icons/bi'
import { GrClose } from 'react-icons/gr'

const Feed = () => {
    localStorage.removeItem('imgPostUpload');
    VerifySession()
    const alerts = useAlert();
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
        respostaFedd = error.toJSON();
        if (respostaFedd.status === 401) {
            localStorage.removeItem(`token`)
            localStorage.removeItem(`user`)
            localStorage.removeItem(`usersPosts`)
            localStorage.removeItem(`userId`)
            localStorage.removeItem(`nickName`)
            localStorage.removeItem('viewPosts')
            alerts.error('Sessão inválida! Faça login novamente.')
            const btnV = document.getElementById('login')
            btnV.click()
        } else {
            alerts.show(`Erro ${respostaFedd.status} - ${respostaFedd.message}`);
        }
    })

    function FeedPosts() {

        var fedds = JSON.parse(localStorage.getItem('viewPosts'))

        var setViewFedds;
        if (fedds !== null) {
            fedds.sort(compare)
            setViewFedds = fedds
        } else {
            setViewFedds = []
        }

        const [feed, setFeed] = useState(setViewFedds)

        React.useEffect(() => {
            const interval = setInterval(() => {
                RefreshData()
                const feddsActual = JSON.parse(localStorage.getItem('viewPosts'))
                if (feddsActual !== null) {
                    feddsActual.sort(compare)
                }
                if (JSON.stringify(feddsActual) !== JSON.stringify(fedds)) {
                    console.log(feddsActual)
                    console.log(fedds)
                    setFeed(feddsActual)
                    fedds = feddsActual;
                }
            }, 2000);
            return () => clearInterval(interval)
        }, []);

        const renderCards = (gallery, key) => {
            var youLike = false;
            if (gallery.likes !== null && gallery.likes !== undefined && gallery.likes !== '') {
                const likes = gallery.likes.split(',')
                const user = localStorage.getItem('userId')
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
                        photoUser={gallery.avatar}
                        comments={gallery.comments}
                        havemedia={gallery.havemedia}
                        typemedia={gallery.typemedia}
                        media={gallery.media}
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
        const radioVideo = document.getElementById('video')['checked']
        const radioImagem = document.getElementById('imagem')['checked']
        var media = '', haveMedia, typemedia = "";
        if (radioVideo === false && radioImagem === false) {
            media = '';
            haveMedia = false;
        } else if (radioVideo === true) {
            media = document.getElementById('videoFrame')['src'];
            haveMedia = true
            typemedia = 'video'
        } else {
            media = localStorage.getItem('imgPostUpload');
            haveMedia = true
            typemedia = 'imagem'
        }

        if (haveMedia === true && (media === null || media === '')) {
            alerts.info('Erro ao carregar ' + typemedia)
        } else {
            if (textPost.length > 3) {

                const token = localStorage.getItem(`token`)
                const dadosPost = { "post": textPost, "havemedia": haveMedia, "media": media, "typemedia": typemedia }
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
                    setMediaSelect('text')
                    respostaFedd = resp.data;
                    alerts.success('Post enviado.')
                    api({
                        method: 'GET',
                        url: `/user/posts`,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    }).then(resp => {
                        respostaFedd = resp.data;
                        localStorage.setItem(`viewPosts`, JSON.stringify(resp.data.posts))
                        localStorage.setItem(`usersPosts`, JSON.stringify(resp.data.users[0]))
                    }).catch(error => {
                        respostaFedd = error.toJSON();
                        if (respostaFedd.status === 500) {
                            alerts.error('Sessão inválida! Faça login novamente.')
                        } else {
                            alerts.show(`Erro ${respostaFedd.status} - ${respostaFedd.message}`);
                        }
                    })
                }).catch(error => {
                    resposta = error.toJSON();
                    if (resposta.status === 500) {
                        alerts.error('Erro interno.')
                    } else {
                        alerts.error(`Erro ${resposta.status} - ${resposta.message}`);
                    }
                })

            } else {
                alerts.info('Texto muito curto.')
            }
        }
        document.getElementById('btnSendPost')['disabled'] = false
    }

    const [mediaSelect, setMediaSelect] = useState('text')

    const AreaMedia = () => {
        const [linkVideo, setLinkVideo] = useState(null)
        const [imgView, setImgView] = useState('/img/black_flag.png')
        const PreviewVideo = () => {
            return (<>
                <iframe id='videoFrame' title="Preview Video" src={linkVideo} style={{ border: '1px solid #FFFFF', width: 'auto', height: 'auto' }}></iframe>
            </>)
        }

        function getYouTubeEmbedUrl() {
            const text = document.getElementById('media')['value']
            var url, test;

            try {
                let urlConvert = new URL(text)
                url = urlConvert;
                test = true;
            } catch (err) {
                test = false
            }



            if (test === true) {
                document.getElementById('media').style.border = '2px solid green'
                if (/(www\.)?youtube\.com|youtu\.be/i.test(url.host) === true && url.pathname.toLowerCase().indexOf('/embed') === 0) {
                    setLinkVideo(`${url}`);
                }
                //<iframe width="628" height="480" src="https://www.youtube.com/embed/AsZZkNprKCY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                else {
                    let videoId;
                    if (url.host.toLowerCase() === 'youtu.be') {
                        videoId = url.pathname.substring(1);
                    } else {
                        const params = new URLSearchParams(url.search);
                        if (params.has('v')) {
                            videoId = params.get('v');
                        }
                    }
                    videoId = 'https://youtube.com/embed/' + videoId;
                    setLinkVideo(videoId)
                }
            } else {
                document.getElementById('media').style.border = '2px solid RED'
                //('Link inválido')
                setLinkVideo(null)
            }
        }

        function validateFileType(event) {
            var pathFile = document.getElementById("mediaImg")['value'];
            var fileName = pathFile;
            var idxDot = fileName.lastIndexOf(".") + 1;
            var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
            if (extFile === "jpg" || extFile === "jpeg" || extFile === "png") {
                let reader = new FileReader();
                let file = event.target.files[0];

                reader.readAsDataURL(file);
                reader.onloadend = () => {
                    setImgView(`${reader.result}`);
                    localStorage.setItem('imgPostUpload', `${reader.result}`)
                };
            } else {
                localStorage.removeItem('imgPostUpload')
                document.getElementById("mediaImg")['value'] = ""
                setImgView('/img/black_flag.png')
                alerts.error("Selecione uma imagem no formato: jpg/jpeg ou png!");
            }
        }

        if (mediaSelect === 'img') {
            return (<div >
                <div style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
                    <label htmlFor="text" style={{ margin: '0 10px 0 0', color: '#202020', fontSize: '30px' }}><GrClose></GrClose></label>
                </div>
                <input hidden type='file' id='mediaImg' accept="image/jpg, image/jpeg, image/png" onChange={(e) => validateFileType(e)} style={{ border: '1px solid #FFFFFF', fontSize: '15px', backgroundColor: '#FFFFFF', width: '90%', margin: '0 0 5px 0' }}></input>
                <label htmlFor="mediaImg">
                    <div style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex', margin: '10px 0 0 0' }}>                        
                            <img alt='img-preview' src={imgView} style={{ maxWidth: '100%', maxHeight: '250px' }} />                        
                    </div>
                </label>
            </div>)
        } else if (mediaSelect === 'video') {
            return (<div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
               <div style={{width:'100%',display:'flex',justifyContent:'flex-end'}}>
                    <label htmlFor="text" style={{ margin: '0 10px 0 0', color: '#202020', fontSize: '30px' }}><GrClose></GrClose></label>
                </div>
                <input type='text' id='mediaVideo' placeholder="Cole aqui o link do vídeo..." onChange={() => getYouTubeEmbedUrl()} style={{ border: '1px solid #202020', fontSize: '15px', backgroundColor: '#FFFFFF', width: '90%', margin: '0 0 5px 0' }}></input>
                <div style={{display:'flex',justifyContent:'center',flexDirection:'column',alignItems:'center'}}>
                    <PreviewVideo></PreviewVideo>
                </div>
            </div>)
        } else {
            return (<></>)
        }
    }

    return (<>
        <Fragment>
            <div className='logo-page'>
                <h3>Feed</h3>
            </div>
            <div className="post-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: 'auto', background: 'rgba(255,255,255,0.1', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
                <div style={{  display: 'flex', flexDirection: 'column', alignItems: 'center',margin: '10px 0 10px 0', width: '90%', backgroundColor: '#FFFFFF' }}>
                    <textarea placeholder="Criar publicação..." id='text-post' style={{resize:'vertical',padding: '10px 0 10px 0', margin: '0 0 0 0', width: '95%', height: '100px', maxWidth: '95%', minWidth: '95%', maxHeight: '150px', minHeight: '20px' }}></textarea>
                    <div style={{ margin: '0 0 0 0', width: '100%', backgroundColor: '#FFFFFF',marginTop:'2px solid #202020' }}>
                        <div style={{ margin: '10px 0 10px 0' }}>
                            <input type='radio' name='mediaImgVideo' onChange={() => setMediaSelect('img')} id='imagem' hidden></input>
                            <label htmlFor="imagem" style={{ margin: '0 10px 0 10px', color: '#202020', fontSize: '30px' }}><BsCardImage /></label>
                            <input type='radio' name='mediaImgVideo' onChange={() => setMediaSelect('video')} id='video' hidden></input>
                            <label htmlFor="video" style={{ margin: '0 12px 0 0', color: '#202020', fontSize: '30px' }}><MdVideoLibrary /></label>
                            <input type='radio' name='mediaImgVideo' onChange={() => setMediaSelect('text')} id='text' defaultChecked hidden></input>
                        </div>
                    </div>
                    <AreaMedia></AreaMedia>
                    <div style={{ width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '10px 0 10px 0' }}>
                        <button className='btn-bar btn-g btn-l' id='btnSendPost' onClick={sendPost}>Postar</button>
                    </div>
                </div>
            </div>
            <br></br>
            <br></br>
            <FeedPosts></FeedPosts>
        </Fragment>
    </>)
}

export default Feed;
