import {useState} from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import './index.css'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [role, setRole] = useState("")
    const [showErr, setShowErr] = useState(false)
    const [ErrMsg, setErrMsg] = useState("")

    const navigate = useNavigate()


  const submitForm = async event => {
        event.preventDefault()
        const url = 'https://storeslistbackend.onrender.com/api/auth/login'
        const userDetails = {email, password}
        const options = {
        method: 'POST',
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(userDetails),
        }
        const response = await fetch(url, options)
        const data = await response.json()
        Cookies.set("email", email)

        if(response.ok){
            Cookies.set('jwt_token', data.jwt_token, {expires: 30})
            Cookies.set("id", data.id, {expires : 30})
            if (role ==="user"){
            navigate('/user', {replace:  true})
            }else if(role === "admin"){
                navigate('/admin', {replace : true})
            }else if (role === "owner"){
              navigate('/owner', {replace: true})
            }
        }else{
            setShowErr(true)
            setErrMsg(data.error_msg)
        }
    
  }

  const onClickUserLogin=() => {
    setShowForm(true)
    setRole('user')
  }

  const onClickOwnerLogin = () => {
    setShowForm(true)
    setRole('owner')
  }

  const onClickAdminLogin = () => {
    setShowForm(true)
    setRole('admin')
  }

  const loginForm = () => (
    <form className='form' onSubmit={submitForm}>
        <p className='role'>Login as {role}</p>
        <div className='input-container'>
            <label htmlFor='email'>Enter Email</label>
            <input type="text" id="email" onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className='input-container'>
            <label htmlFor='password'>Enter Password</label>
            <input type="password" id="password" onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        {setErrMsg && <p className='err-msg'>{ErrMsg}</p>}
        <button type='submit' className='submit-button'>Submit</button>
    </form>
  )

        
        return(
            <div className='login-container'>
            <h1 className='login-head'>Login Page</h1>
            <div className='login-btn-div'>
                <button className='login-btn' onClick={onClickUserLogin}>Login as user</button>
                <button className='login-btn' onClick={onClickOwnerLogin}>Login as Owner</button>
                <button className='login-btn' onClick={onClickAdminLogin}>Login as Admin</button>
            </div>
            {showForm && loginForm()}
            </div>

        )
    
}

export default Login