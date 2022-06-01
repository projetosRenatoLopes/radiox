import React from 'react';

const Load = () => {
  const token = localStorage.getItem(`token`)
  setTimeout(() => {
      if (token !== null && token !== undefined) {
          window.location.href ='/feed'
      } else {
        window.location.href ='/home'
      }
  }, 5000);  


  return (
    <>
      <div className='title-page'>
        <p>Carregando...</p>
      </div>

      <div className='logo-page'>
        <img src='https://acegif.com/wp-content/uploads/loading-23.gif' className="img-logo-page" alt="img-logo" style={{ 'maxWidth': '20rem', 'minWidth': '16rem' }}></img>
      </div>
    </>
  )
}

export default Load;


