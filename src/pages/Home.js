import React, { Fragment } from "react";
import VerifySession from "../utils/verifySession";

const Home = () => {
    VerifySession()

    return (<>
        <Fragment>            
            <div className='logo-page'>
                <h3>Rádio Xibungos FM</h3>
            </div>
            <div className="gifsbottom">
                <img id="img-f" alt='f' src='https://i.giphy.com/media/hStvd5LiWCFzYNyxR4/giphy.webp' />
            </div>
            <img style={{ width: '100%' }} alt='music' id='music' src="https://i.gifer.com/origin/a0/a0fdfb0039405b9a8c222dd252be9565.gif" />

            <div className="gifsbottom">
                <img alt='dog-boy-dancing' src="https://cdn.dicionariopopular.com/imagens/numero-nove.gif?auto_optimize=low" />
                <img alt='que-demais' src="https://cdn.dicionariopopular.com/imagens/meme-feliz.gif?auto_optimize=low" />
                <img alt='humm-que-danca' src='https://cdn.dicionariopopular.com/imagens/homem-dancando.gif?auto_optimize=low' />
            </div>
        </Fragment>
    </>)
}

export default Home;
