import {useState} from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import './index.css'

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showForm, setShowForm] = useState("")
    const [role, setRole] = useState("user")
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [showErr, setShowErr] = useState(false)
    const [ErrMsg, setErrMsg] = useState("")

    const navigate = useNavigate()

  const submitForm = async event => {
        event.preventDefault()
        const url = 'https://storelistrating.onrender.com/api/auth/login'
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
            switch(role){
                case "user":
                    navigate('/user', {replace:  true})
                    break;
                case "admin":
                    navigate('/admin', {replace : true})
                    break;
                case "owner":
                    navigate('/owner', {replace: true})
                    break;
                default:
                    return null
            }
        }else{
            setShowErr(true)
            setErrMsg(data.error_msg)
        }
    
  }

  const onClickSignup = async (event) => {
        event.preventDefault()
        const url = 'https://storelistrating.onrender.com/api/auth/signup'
        const userDetails = {name, email, password, address, role}
        const options = {
        method: 'POST',
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(userDetails),
        }
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(response)
        if (response.ok){
            navigate('/user', {replace:  true})
        }else{
            setShowErr(true)
            setErrMsg(data.error_msg)
        }
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
            <input type="current-password" id="password" onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        <select onChange={(e)=>setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
        </select>
        {showErr && <p className='err-msg'>{ErrMsg}</p>}
        <button type='submit' className='submit-button'>Submit</button>
    </form>
  )

  const signupForm = () => (
    <form className='form' onSubmit={onClickSignup}>
        <p>Login as User</p>
        <div className='input-container'>
            <label htmlFor='name'>Enter Name</label>
            <input type="text" id="name" onChange={(e)=>setName(e.target.value)}/>
        </div>
        <div className='input-container'>
            <label htmlFor='email'>Enter Email</label>
            <input type="text" id="email" onChange={(e)=>setEmail(e.target.value)}/>
        </div>
        <div className='input-container'>
            <label htmlFor='password'>Enter Password</label>
            <input type="password" id="password" onChange={(e)=>setPassword(e.target.value)}/>
        </div>
        <div className='input-container'>
            <label htmlFor='address'>Enter Address</label>
            <input type="text" id="address" onChange={(e)=>setAddress(e.target.value)}/>
        </div>
        {showErr && <p className='err-msg'>{ErrMsg}</p>}
        <button type='submit' className='submit-button'>Submit</button>
    </form>
  )

    return(
        <div className='login-container'>
        <h1 className='login-head'>Login Page</h1>
        <div className='login-btn-div'>
            <button className='login-btn' onClick={()=>setShowForm("Login")}>Login</button>
            <h2>OR</h2>
            <button className='login-btn' onClick={()=>setShowForm("Signup")}>Sign up</button>
        </div>
        {showForm==="Login" && loginForm()}
        {showForm === "Signup" && signupForm()}
        </div>

    )
    
}

export default Login