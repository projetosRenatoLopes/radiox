import { Link } from 'react-router-dom'
import { RiMenuLine, RiMenuUnfoldFill } from 'react-icons/ri'
import { BsFillPlayFill, BsFillPauseBtnFill } from 'react-icons/bs'
import ReactAudioPlayer from 'react-audio-player';
import { useState } from 'react';

const Menu = () => {
    const [btnPlayPause, setBtn] = useState('play')
    const [userAdmin, setUserAdmin] = useState(localStorage.getItem(`user`))
    const btnShow = () => {
        if (btnPlayPause === 'play') {
            return (<>
                <button className="btn-bar btn-g btn-l" onClick={play}><BsFillPlayFill />Play</button>
            </>
            )
        } else {
            return (<>
                <button className="btn-bar btn-g btn-l" onClick={pause}><BsFillPauseBtnFill />Pause</button>
            </>
            )
        }
    }

    const play = () => {
        // @ts-ignore
        document.getElementById('player').play()
        setBtn('pause')
    }

    const pause = () => {
        // @ts-ignore
        document.getElementById('player').pause()
        setBtn('play')
    }

    const MenuOptionsView = () => {
        
        if (userAdmin === undefined || userAdmin === null) {            
            return (<>
                <Link to={`/login`} id='login'><div onClick={menuOpen}>Login</div></Link>
                <Link to={`/home`}><div onClick={menuOpen}>Inicio</div></Link>
            </>)
        } else {            
            return (<>
                <Link to={`/user`}><div onClick={menuOpen}>{userAdmin}</div></Link>
                <Link to={`/home`}><div onClick={menuOpen}>Inicio</div></Link>
                <Link to={`/Feed`}><div onClick={menuOpen}>Feed</div></Link>
                <div onClick={logout}>Sair</div>
            </>)
        }
    }

    const logout = () => {
        menuOpen()
        localStorage.removeItem(`nickName`)
        localStorage.removeItem(`user`)
        localStorage.removeItem(`viewPosts`)
        localStorage.removeItem(`token`)
        sessionStorage.removeItem('userId')
        setUserAdmin(localStorage.getItem(`user`))
        const btnV = document.getElementById('login')
        btnV.click()
    }

    function menuOpen() {
        const menu = document.getElementById('menu');
        if (menu.style.display === 'none') {
            document.getElementById('icon-menu').style.display = 'none';
            document.getElementById('icon-menu-open').style.display = 'flex';
            document.getElementById('back-menu').style.display = 'flex';
            menu.style.display = 'inline';
        } else {
            document.getElementById('icon-menu').style.display = 'flex';
            document.getElementById('icon-menu-open').style.display = 'none';
            document.getElementById('back-menu').style.display = 'none';
            menu.style.display = 'none';
        }
    }
    
    return (<>
        <div id='menu' className='menu' style={{ 'display': 'none' }}>
            <div className='itens-menu'>
                <MenuOptionsView />
            </div>
        </div>
        <div className='title-page'>
            <ReactAudioPlayer id='player'
                src="http://c13.radioboss.fm:8347/autodj"
                controls={false}
            />
            {btnShow()}
            <Link to={'/login'}><button id='login' hidden></button></Link>
            <Link to={'/feed'}><button id='feed' hidden></button></Link>
            <Link to={'/home'}><button id='home' hidden></button></Link>
            <button id='setuser' onClick={()=>setUserAdmin(localStorage.getItem(`user`))} hidden></button>
            
            <div id='icon-menu' style={{ 'display': 'flex' }}>
                <RiMenuLine onClick={menuOpen} />
            </div>
            <div id='icon-menu-open' style={{ 'display': 'none' }}>
                <RiMenuUnfoldFill onClick={menuOpen} />
            </div>
        </div>
        <div id='back-menu' onClick={menuOpen}>
        </div>
    </>
    )

}

export default Menu;