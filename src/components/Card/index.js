import * as React from 'react';
import { AiFillLike, AiFillDislike } from 'react-icons/ai'
import api from '../../services/api';
import { useAlert } from "react-alert";
import RefreshData from '../../utils/refreshData';
//modal
import { useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
const noAvatar = '/img/noavatar.png';

const Card = ({ uuid, userPost, likes, post, name, youlike, data }) => {
    var youLiked = youlike
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const alert = useAlert();
    var arrLikes = [];
    var arrLikesName = [];
    if (likes !== null && likes !== "") {
        arrLikes = likes.split(',')
        var users = JSON.parse(localStorage.getItem('usersPosts'))
        arrLikes.forEach(element => {
            users.forEach(user => {
                if (element === user.id)
                    arrLikesName.push(user.name);
            });
        });
    }

    //const [namesLiked, setNamesLiked] = useState(arrLikes.length)

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
            youLiked = verYouLike;
        }, 2000);
        return () => clearInterval(interval)
    }, []);
    var imgUser = noAvatar;
    //'#65676b'
    return (
        <>
            <div className="card" key={uuid}>
                <div className='title' style={{ display: 'flex' }} >
                    <div className='avatar' style={{backgroundColor:'#65676b',width: '40px', height: '40px', justifyContent: 'center', margin: '10px 0 5px 10px', borderRadius: '50%' }}>
                        <img alt='avatar' src={imgUser} style={{width:'100%',height:'100%',borderRadius: '50%'}} ></img>
                    </div>
                    <div className='name-date' style={{ display: 'inline', margin: '10px 0 5px 10px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h5 className="user-name" style={{ fontSize: '15px', margin: '0 0 0 5px' }}>{`${name} -`}</h5>
                            <p style={{ margin: '0 0 0 5px', }}>{`${userPost}`}</p>
                        </div>
                        <p style={{ margin: '5px 0 0 10px', padding: '0', fontSize: '12px', color: '#65676b' }}>{dataPost}</p>
                    </div>
                </div>
                <div className="post-body" style={{ margin: '0 6px 0 6px' }}>
                    <div className="card-text" style={{ 'display': 'flex', 'alignItems': 'center', 'width': '100%' }}>
                        <div style={{ 'padding': '0 5px 0 5px' }}>{post}</div>
                    </div>
                </div>
                <div className='bottom-post' style={{ margin: '0 6px 0 6px' }}>
                    <div onClick={openModal} style={{ borderBottom: ' 1px solid #20202038', display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: '#198754', margin: '0 0 0 10px' }} ><AiFillLike></AiFillLike></div>
                        <p id={`countlikes${uuid}`} style={{ margin: '5px 0 5px 5px', color: '#65676b' }}>{arrLikesName.length}</p>
                    </div>
                    <div className='likes' style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 10px 5px 0', alignItems: 'center' }}>
                        <div style={{ 'display': 'flex', alignItems: 'center', 'margin': '0 7px 0 0' }}>
                            {btnLikeShow()}
                        </div>
                        {/* <div id={`likes-${uuid}`} style={{ zIndex: 9999999, width: '95%',backgroundColor: '#FAFAFA', position: 'absolute', margin:'55px 0 0 15px',border:'1px solid #202020' }}>Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, </div> */}
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
                            <div style={{ 'display': 'flex', whiteSpace: 'normal' }}>
                                {name}
                            </div>
                        </Typography>
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                            <strong>{post}</strong>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div style={{ 'display': 'flex', whiteSpace: 'normal' }}>
                                {arrLikesName.length} Likes:
                            </div>
                            <div style={{ 'display': 'flex', whiteSpace: 'normal' }}>
                                {arrLikesName.toString().replace(/[,]/g, ", ")}
                            </div>
                        </Typography>
                    </Box>
                </Modal >
            </div >
        </>
    )
}


export default Card;