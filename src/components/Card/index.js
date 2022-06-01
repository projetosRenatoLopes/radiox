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

const Card = ({ uuid, userPost, likes, post, name, youlike, data }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(false);
    const handleClose = () => setOpen(false);
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
            return (<button className='btn-bar btn-g btn-r' onClick={removeLike} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AiFillDislike></AiFillDislike></button>)
        } else {
            return (<button className='btn-bar btn-g btn-l' onClick={sendLike} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AiFillLike></AiFillLike></button>)
        }
    }

    async function sendLike() {
        const token = localStorage.getItem(`token`)
        const userId = sessionStorage.getItem('userId')

        var postLikes;
        var newLikes = []
        if (likes !== null && likes !== "" && likes !== undefined) {
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
            alert.success('LIKE - ' + post)
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

    async function removeLike() {
        const token = localStorage.getItem(`token`)
        const userId = sessionStorage.getItem('userId')

        var postLikesRemove;
        var newLikesRemove = []
        if (likes !== null) {
            postLikesRemove = likes.split(',')
            //newLikes = postLikes
            postLikesRemove.forEach(element => {
                if (element !== userId) {                    
                    newLikesRemove.push(element);
                }
            });

            if(newLikesRemove.length > 0){
                // @ts-ignore
                newLikesRemove = newLikesRemove.join(',')
            }

            const dadosPost = { "id": uuid, "likes": newLikesRemove }
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
                alert.success('LIKE REMOVIDO - ' + post)
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
                        <p style={{ marginLeft: '5px' }}>{`${userPost}`}</p>
                    </div>
                    <div style={{ 'display': 'flex', alignItems: 'center', 'margin': '0 7px 0 0' }}>
                        {btnLikeShow()}
                        <strong onClick={openModal}>{arrLikesName.length}</strong>
                    </div>
                    {/* <div id={`likes-${uuid}`} style={{ zIndex: 9999999, width: '95%',backgroundColor: '#FAFAFA', position: 'absolute', margin:'55px 0 0 15px',border:'1px solid #202020' }}>Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, Renato Lopes, Joao Victor, </div> */}
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
                        <Typography id="modal-modal-title" variant="h6" component="h2" style={{ 'display': 'flex', 'justifyContent': 'center' }}>
                            <strong>{post}</strong>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div style={{ 'justifyContent': 'center', 'display': 'flex' }}>
                                Likes: {arrLikesName.length} - {arrLikesName.toString().replace(',', ', ')}
                            </div>
                        </Typography>
                    </Box>
                </Modal >
            </div >
        </>
    )
}


export default Card;