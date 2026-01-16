import React from 'react';
import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import { useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import './index.css'

const Header = () =>{

    const [newpassword, setNewPassword] = useState("")
    const [confirmpassword, setConfirmpassword] = useState("")
    const [showErr, setShowErr] = useState(false)

    const navigate = useNavigate()

    const onClickLogout = () => {
        Cookies.remove("jwt_token")
        Cookies.remove("id")
        navigate('/', {replace : true})
    }

    const email=Cookies.get("email")
    
    const onSubmitPassword = async () => {

        if(newpassword !== confirmpassword){
            setShowErr(true)
        }
        const details = {email,password : newpassword}
        const url = 'https://storeslistbackend.onrender.com/api/auth/update-password'
        const options = {
            method : "PUT",
            headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(details),
        }
        const res = await fetch(url, options)
        await res.json()
        
    }

    const onChangePassword = e => {
        setNewPassword(e.target.value)
    }

    const onChangeConfirmPassword = e => {
        setConfirmpassword(e.target.value)
    }

    return(
        <nav>
            <img src="https://res.cloudinary.com/dsqphsoxb/image/upload/v1723546423/samples/logo.png" alt="logo" className='logo'/>
            <Popup trigger={<button className='chng-pass-btn'> Change Password </button>} modal nested>
                {close => (
                <div className="modal modal-card">
                <div className="content password-form">
                    <input type="password" placeholder='Enter new Password' onChange={onChangePassword}/>
                    {showErr && <p className='error-msg'>Enter same password</p>}
                    <input type='password' placeholder='confirm password' onChange={onChangeConfirmPassword}/>
                    <button className='logout-btn' onClick={onSubmitPassword}>Submit</button>
                </div>
                <div>
                <button onClick={() => close()}>Close modal</button>
                </div>
                </div>
                )}
                </Popup>
            <button className='logout-btn' onClick={onClickLogout}>Logout</button>
        </nav>
    )
}

export default Header