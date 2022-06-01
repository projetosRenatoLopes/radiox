

const NotFound = () => {
    
        const imgErro = '/img/404.png'
        return (
            <>
                <div className='title-page'>
                    <p>404 - Página não Encontrada!</p>
                </div>

                <div className='logo-page'>
                    <img src={imgErro} className="img-logo-page" alt="img-logo" style={{ 'maxWidth': '30rem', 'minWidth': '16rem' }}></img>
                </div>
                <br></br>
                <div className="div-button" style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center' }}>
                    <button className="btn btn-success" onClick={()=>window.location.href = '/home'}>Voltar ao início </button>
                </div>
            </>
        )
}

export default NotFound;
