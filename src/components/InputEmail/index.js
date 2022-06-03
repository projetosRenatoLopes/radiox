import './inputEmail.css'
import React from "react";
import { FaUserAlt } from 'react-icons/fa'



const InputEmail = ({ className, placeholder, defaultValue, onChange }) => {

    return (
        <>
            <div className="input-email">
                <FaUserAlt />
                <input type="text" id="user" defaultValue={defaultValue} className={className} placeholder={placeholder} onChange={onChange}></input>
            </div>

        </>
    )
};

export default InputEmail