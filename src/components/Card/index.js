import * as React from 'react';
import { AiFillLike } from 'react-icons/ai'
import { FaRegCommentAlt } from 'react-icons/fa'
import api from '../../services/api';
import { useAlert } from "react-alert";
import RefreshData from '../../utils/refreshData';
//modal
import { useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const Card = ({ uuid, userPost, likes, post, name, youlike, data, photoUser, comments, havemedia, typemedia, media }) => {
    const mediaField = havemedia;    
    const [commentsActualPost, setCommentsActualPost] = useState([])
    const avatarUserTemp = localStorage.getItem('avatar')
    var avatarUser = '/img/noavatar.png';
    if (avatarUserTemp !== null && avatarUserTemp !== undefined && avatarUserTemp !== 'null') {
        avatarUser = avatarUserTemp;
    }
    var strCommentsCount = '0 comentário'
    if (comments === undefined || comments === null || comments === 'null' || comments === "") {
        strCommentsCount = `0 comentário`
    } else {
        if (comments.length < 2) {
            strCommentsCount = `${comments.length} comentário`
        } else {
            strCommentsCount = `${comments.length} comentários`
        }
    }

    if (JSON.stringify(comments) !== JSON.stringify(commentsActualPost)) {        
        setCommentsActualPost(comments)
    }
    const [avatar, setAvatar] = useState('/img/noavatar.png')
    var youLiked = youlike
    const [open, setOpen] = useState(false);
    const [openPhoto, setOpenPhoto] = useState(false);
    const handleClose = () => setOpen(false);
    const handleClosePhoto = () => setOpenPhoto(false);
    const alert = useAlert();
    var arrLikes = [];
    var arrLikesName = [];
    const users = JSON.parse(localStorage.getItem('usersPosts'))
    if (likes !== null && likes !== "") {
        arrLikes = likes.split(',')
        arrLikes.forEach(element => {
            users.forEach(user => {
                if (element === user.id)
                    arrLikesName.push(user.name);
            });
        });
    }

    const btnLikeShow = () => {

        if (youLiked === true) {
            return (<div className='btn-post btn-g btn-unlike' onClick={removeLike} ><AiFillLike id={`unlike${uuid}`} ></AiFillLike> Curtir</div>)
        } else {
            return (<div className='btn-post btn-g btn-like' onClick={sendLike}><AiFillLike id={`like${uuid}`} ></AiFillLike> Curtir</div>)
        }
    }

    async function sendLike() {
        youLiked = true
        document.getElementById(`like${uuid}`)['disabled'] = true;
        //document.getElementById(`countLikes-${uuid}`)['value'] = actualLikes + 1
        const token = localStorage.getItem(`token`)

        const dadosPost = { "id": uuid, "action": 'like' }
        await api({
            method: 'POST',
            url: `/user/like`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            },
            data: dadosPost
        }).then(resp => {
            if (resp.status === 200) {
                //alert.success('LIKE - ' + post)
                RefreshData()
            } else {
                alert.error('ERRO AO REMOVER LIKE - ' + post)
                youLiked = false
            }

        }).catch(error => {
            youLiked = false
            alert.show(`${error.message}`);
        })
    }

    async function removeLike() {
        document.getElementById(`unlike${uuid}`)['disabled'] = true;
        youLiked = false
        const token = localStorage.getItem(`token`)
        if (likes !== null) {

            const dadosPost = { "id": uuid, "action": 'unlike' }
            await api({
                method: 'POST',
                url: `/user/like`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: dadosPost
            }).then(resp => {
                if (resp.status === 200) {
                    //alert.success('LIKE REMOVIDO - ' + post)
                    RefreshData()
                } else {
                    alert.error('ERRO AO REMOVER LIKE - ' + post)
                    youLiked = true

                }
            }).catch(error => {
                youLiked = true
                alert.show(`${error.message}`);
            })
        }
    }


    const convDataPost = new Date(parseInt(data))
    var dia = convDataPost.getDate(),
        mes = (convDataPost.getMonth() + 1),
        ano = convDataPost.getFullYear(),
        hora = convDataPost.getHours(),
        min = convDataPost.getMinutes();
    // @ts-ignore
    if (min < 10) { min = '0' + min }
    // @ts-ignore
    if (hora < 10) { hora = '0' + hora }
    // @ts-ignore
    if (dia < 10) { dia = '0' + dia }
    // @ts-ignore
    if (mes < 10) { mes = '0' + mes }
    var dataPost;
    const date = new Date();
    const hr = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
    const day = String(date.getDate() + '/' + String(date.getMonth() + 1) + '/' + date.getFullYear())
    const hrPost = `${hora}:${min}`
    if (`${hora}:${min}` === hr && day === `${dia}/${mes}/${ano}`) {
        dataPost = 'Agora'
        // } else if (day === `${dia}/${mes}/${ano}`) {
        //     const teste = new Date(date - convDataPost )
        //     const elapsedTime = (parseInt(hr) - parseInt(`${hora}:${min}`))
        //     dataPost = `Há ${elapsedTime} minutos`
    } else {
        dataPost = `${dia}/${mes}/${ano} - ${hora}:${min}`
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    function openModal() {
        setOpen(true)
    }
    function viewPhoto() {
        setOpenPhoto(true)
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            var verYouLike = false;
            if (likes !== null && likes !== undefined && likes !== '') {
                const likesPost = likes.split(',')
                const user = localStorage.getItem('userId')
                likesPost.forEach(element => {
                    if (element === user) {
                        verYouLike = true
                    }
                });
            }
            if (photoUser !== null) {
                setAvatar(photoUser)
            } else {
                setAvatar('/img/noavatar.png')
            }
          
            if (commentsActualPost !== comments) {                
                setCommentsActualPost(comments)                
            }
            youLiked = verYouLike;
        }, 2000);
        return () => clearInterval(interval)
    }, []);

    function ocultComments() {
        document.getElementById(`commets-post-${uuid}}`).style.display = 'none'
    }

    function showComments() {
        const commetsForm = document.getElementById(`commets-post-${uuid}}`).style.display
        if (commetsForm === 'inline') {
            document.getElementById(`commets-post-${uuid}}`).style.display = 'none'
        } else {
            document.getElementById(`commets-post-${uuid}}`).style.display = 'inline'
        }
    }

    function RenderComments() {

        const renderComments = (gallery, key) => {
            var avatarComment = '/img/noavatar.png';
            if (gallery.avatar === null || gallery.avatar === undefined || gallery.avatar === "") {
                avatarComment = '/img/noavatar.png'
            } else {
                avatarComment = gallery.avatar
            }

            return (
                <div key={gallery.id} className='comment' style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '8px 0 8px 0', width: '100%' }}>
                    <div className='avatar' style={{ backgroundColor: '#65676b', width: '40px', height: '40px', justifyContent: 'center', borderRadius: '50%', minWidth: '40px', minHeight: '40px' }}>
                        <img alt='img' src={avatarComment} style={{ width: '100%', height: '100%', borderRadius: '50%' }} ></img>
                    </div>
                    <div className="input-comment" style={{ display: 'inline', backgroundColor: 'rgb(240 242 245)', borderRadius: '30px', justifyContent: 'flex-start', alignItems: 'center', padding: '0 10px 0 10px', minHeight: '40px', margin: '0 0 0 8px' }}>
                        <p style={{ margin: '8px 8px 2px 8px', fontSize: '12px', fontStyle: 'unset' }}>{gallery.name}</p>
                        <p style={{ margin: '0 8px 8px 8px' }}>{gallery.comment}</p>
                    </div>
                </div>
            )
        }

        if (commentsActualPost === null || commentsActualPost.length === 0) {
            return (<><div style={{ 'display': 'flex', 'justifyContent': 'center', 'width': '100%', color: '#FFFFFF' }}><h5>Nenhum comentário ainda.</h5></div></>)
        } else {
            return (
                <div className="list-prod" id='list-prod' style={{ 'width': '100%', 'fontSize': '15px', maxHeight: '200px', overflowY: 'scroll' }}>
                    {commentsActualPost.map(renderComments)}
                </div>
            )
        }
    }

    const sendComment = async (e) => {
        if (e.key === 'Enter') {
            const textComment = document.getElementById(`comment-text-${uuid}`)['value']
            if (textComment === "") {
                alert.info('Comentário vazio.')
            } else {
                const token = localStorage.getItem(`token`)
                const dadosPost = { "idpost": uuid, "comment": textComment }
                var respostaComment;
                await api({
                    method: 'POST',
                    url: `/user/comment`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: dadosPost
                }).then(resp => {
                    document.getElementById('text-post')['value'] = ''
                    respostaComment = resp.data;
                    document.getElementById(`comment-text-${uuid}`)['value'] = ""
                    alert.success('Comentário enviado.')
                    api({
                        method: 'GET',
                        url: `/user/posts`,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    }).then(resp => {
                        respostaComment = resp.data;
                        localStorage.setItem(`viewPosts`, JSON.stringify(resp.data.posts))
                        localStorage.setItem(`usersPosts`, JSON.stringify(resp.data.users[0]))
                    }).catch(error => {
                        respostaComment = error.toJSON();
                        if (respostaComment.status === 500) {
                            alert.error('Sessão inválida! Faça login novamente.')
                        } else {
                            alert.show(`Erro ${respostaComment.status} - ${respostaComment.message}`);
                        }
                    })
                }).catch(error => {
                    respostaComment = error.toJSON();
                    if (respostaComment.status === 500) {
                        alert.error('Erro interno.')
                    } else {
                        alert.error(`Erro ${respostaComment.status} - ${respostaComment.message}`);
                    }
                })
            }
        }
    }

    var displayImg = 'none';
    var displayVideo = 'none';
    var displayMedia = 'none'
    if (havemedia === "false") {
        displayVideo = 'none'
        displayImg = 'none'
        displayMedia = 'none'
    } else {
        if (typemedia === 'video') {
            displayMedia = 'flex'
            displayVideo = 'flex'
            displayImg = 'none'
        } else {
            displayMedia = 'flex'
            displayImg = 'flex'
            displayVideo = 'none'
        }
    }
    // const Media = () => {
    // }

    return (
        <>
            <div className="card" key={uuid}>
                <div className='title' style={{ display: 'flex' }} >
                    <div className='avatar' style={{ backgroundColor: '#65676b', width: '40px', height: '40px', justifyContent: 'center', margin: '10px 0 5px 10px', borderRadius: '50%' }}>
                        <img alt='img' src={avatar} style={{ width: '100%', height: '100%', borderRadius: '50%' }} ></img>
                    </div>
                    <div className='name-date' style={{ display: 'inline', margin: '10px 0 5px 10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h5 className="user-name" style={{ fontSize: '15px', margin: '0 0 0 5px' }}>{`${name} -`}</h5>
                            <p style={{ margin: '0 0 0 5px', }}>{`${userPost}`}</p>
                        </div>
                        <p style={{ margin: '5px 0 0 10px', padding: '0', fontSize: '12px', color: '#65676b' }}>{dataPost}</p>
                    </div>
                </div>
                <div className="post-body" style={{ margin: '0 0 0 0', display: 'inline', alignItems: 'center' }}>
                    <div className="card-text" style={{ 'display': 'flex', 'alignItems': 'center', 'width': '100%', margin: '0 0 5px 0' }}>
                        <div style={{ padding: '0 5px 0 5px', whiteSpace:'break-spaces', width:'100%', maxHeight:'400px', overflowY: 'auto' }}>{post}</div>
                    </div>
                    <div className='card-media' style={{ display: displayMedia, alignItems: 'center', justifyContent: 'center', width: '100%', position: 'relative', overflow: 'hidden', paddingTop: '56.25%' }}>
                        {/* <Media></Media> */}
                        <iframe id='video-post' style={{ display: displayVideo, position: 'absolute', top: '0', left: '0', bottom: '0', right: '0', width: '100%', height: '100%' }} src={media} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                            <img onClick={viewPhoto} id='img-post' style={{ display: displayImg, position: 'absolute', top: '0', bottom: '0', height: '100%' }} alt='img-post' src={media}></img>
                        </div>
                    </div>
                </div>
                <div className='bottom-post' style={{ margin: '0 6px 0 6px' }}>
                    <div style={{ borderBottom: ' 1px solid #20202038', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={openModal} >
                            <div style={{ color: '#198754', margin: '0 0 0 10px' }} ><AiFillLike></AiFillLike></div>
                            <p id={`countlikes${uuid}`} style={{ margin: '5px 0 5px 5px', color: '#65676b' }}>{arrLikesName.length}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => showComments()}>
                            <p style={{ color: '#65676b', margin: '0 10px 0 0' }}>{strCommentsCount}</p>
                        </div>
                    </div>
                    <div className='likes' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #20202038' }}>
                        <div style={{ 'display': 'flex', alignItems: 'center', 'margin': '0 7px 0 0' }}>
                            {btnLikeShow()}
                        </div>
                        <div style={{ 'display': 'flex', alignItems: 'center', 'margin': '0 7px 0 0' }}>
                            <div className='btn-post btn-g btn-like' onClick={() => showComments()}><FaRegCommentAlt id={`comment${uuid}`} style={{ alignItems: 'center', justifyContent: 'center' }}></FaRegCommentAlt> Comentar</div>
                        </div>
                    </div>
                    <div className='space-comment' id={`commets-post-${uuid}}`} style={{ borderTop: '1px solid #20202038', display: 'none' }}>
                        <div className='comment' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8px 0 8px 0', width: '100%' }}>
                            <div className='avatar' style={{ backgroundColor: '#65676b', width: '40px', height: '40px', justifyContent: 'center', borderRadius: '50%', minWidth: '40px', minHeight: '40px' }}>
                                <img alt='img' src={avatarUser} style={{ width: '100%', height: '100%', borderRadius: '50%' }} ></img>
                            </div>
                            <div className="input-comment" style={{ backgroundColor: 'rgb(240 242 245)', borderRadius: '30px', justifyContent: 'flex-start', alignItems: 'center', display: 'flex', padding: '0 0 0 10px', height: '40px', width: '100%', margin: '0 0 0 8px' }}>
                                <input type="text" id={`comment-text-${uuid}`} placeholder='Escreva um comentário...' style={{ margin: '0 0 0 0', width: '100%' }} onKeyDown={(e) => sendComment(e)} ></input>
                            </div>
                        </div>
                        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ color: '#65676b', margin: '0 10px 0 0' }}>Comentários:</p>
                            <p style={{ color: '#65676b', margin: '0 10px 0 0' }} onClick={() => ocultComments()}>Fechar</p>
                        </div>
                        <RenderComments></RenderComments>
                    </div>
                </div>
            </div>
            <br></br>
            <div>

            </div >
            <div>
                <Modal

                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {name}

                        </Typography>
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                            <strong>{post}</strong>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {arrLikesName.length} Likes:
                            <br></br>
                            {arrLikesName.toString().replace(/[,]/g, ", ")}

                        </Typography>
                    </Box>
                </Modal >
                <Modal

                    open={openPhoto}
                    onClose={handleClosePhoto}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <img width={'100%'} src={media} alt='img-post' ></img>
                            {arrLikesName.length} Likes:
                            <br></br>
                            {arrLikesName.toString().replace(/[,]/g, ", ")}

                        </Typography>
                    </Box>
                </Modal >
            </div >
        </>
    )
}


export default Card;