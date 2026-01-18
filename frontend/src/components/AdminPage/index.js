import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import Header from "../Header"
import "./index.css"

const AdminPage = () => {

    const [details, setDetails] = useState([])
    const [stores, setStores] = useState([])
    const [users, setUsers] = useState([])
    const [user, setUser] = useState([])
    const [userId, setUserId] = useState("")

    const jwtToken = Cookies.get('jwt_token')

    const [addStore, setAddStore] = useState(false)
    const [addUser, setAddUser] = useState(false)

    const [storeDetails, setStoreDetails] = useState({name : "", email : "", address : "", owner_id: ""})
    const [userDetails, setUserDetails] = useState({name:"", password :"", email:"",address:"", role:""})

    const handleuserChange = (e) => {
        const {name, value} = e.target
        setUserDetails((prev)=> ({...prev, [name] : value,}))
    }

    const handleStoreChange = e => {
        const {name, value} = e.target
        setStoreDetails((prev)=> ({...prev, [name] : value,}))
    }

    const onAddUserDetails = async() => {
        const url = 'https://storelistrating.onrender.com/api/admin/users'
        const options = {
            method : 'POST',
            headers : {
            "Content-Type" : "application/json",
            "authorization" : `Brearer ${jwtToken}`

        },
        body: JSON.stringify(userDetails),
        }
        const response = await fetch(url, options)
        if(response.ok){
            alert("User added successfully")
        }
        
    }

    const onAddStoreDetails = async() => {
        const url = 'https://storelistrating.onrender.com/api/admin/stores'
        const options = {
            method : 'POST',
            headers : {
            "Content-Type" : "application/json",
            "authorization" : `Brearer ${jwtToken}`

        },
        body: JSON.stringify(storeDetails),
        }
        const response = await fetch(url, options)
        if(response.ok){
            alert("store added successfully")
        }
    }



    useEffect(()=> {
        const getDashboard = async () =>{
             const jwtToken = Cookies.get('jwt_token')
            const url = 'https://storelistrating.onrender.com/api/admin/dashboard'

            const options = {
                method: 'GET',
                headers : {
                    "authorization" : `Brearer ${jwtToken}`
                }}
            const response = await fetch(url, options)
            const data = await response.json()
            setDetails(data)
        }
        getDashboard()
    },[])

    useEffect(()=> {
        const getStores = async () =>{
             const jwtToken = Cookies.get('jwt_token')
            const url = 'https://storelistrating.onrender.com/api/admin/stores'

            const options = {
                method: 'GET',
                headers : {
                    "authorization" : `Brearer ${jwtToken}`
                }}

            const response = await fetch(url, options)
            const data = await response.json()
            setStores(data)
        }
        getStores()
    },[])

   
    useEffect(()=>{
        const getUsers = async () =>{
            const jwtToken = Cookies.get('jwt_token')
            const url = 'https://storelistrating.onrender.com/api/admin/users'

            const options = {
                method: 'GET',
                headers : {
                    "authorization" : `Brearer ${jwtToken}`
                }}

            const response = await fetch(url, options)
            const data = await response.json()
            setUsers(data)
        }
        getUsers()
    },[])

    
    const onSearchUserId = () => {
        const getUsers = async () =>{
            const jwtToken = Cookies.get('jwt_token')
            const url = `https://storelistrating.onrender.com/api/admin/users/${userId}`

            const options = {
                method: 'GET',
                headers : {
                    "authorization" : `Brearer ${jwtToken}`
                }}

            const response = await fetch(url, options)
            
            const data = await response.json()
            setUser(data)
            }
        getUsers()  
        }

    const onClickAddStore = () => {
        setAddStore(true)
    }

    const onClickAddUser = () => {
        setAddUser(true)
    }
    

    return(
        <>
        <Header/>
        <div className="admin-page-container">
            <div className="searchuser">
                <input type="search" onChange={(e)=>setUserId(e.target.value)} placeholder="search user by id"/>
                <button onClick={onSearchUserId}>search</button>
                {user.name !== undefined &&
                <div className="list"><p className="title">Name : <span>{user.name}</span></p>
                    <p className="title">Email : <span>{user.email}</span></p>
                    <p className="title">Address : <span>{user.address}</span></p>
                    <p className="title">Role : <span>{user.role}</span></p>
                </div>}
            </div> 
            <div className="counter-div">
                <p className="count">Total Stores Count : <span className="countnum">{details.stores}</span></p>
                <hr/>
                <p className="count">Total Users Count : <span className="countnum">{details.users}</span></p>
                <hr/>
                <p className="count">Total Ratings Count : <span className="countnum">{details.rating}</span></p>
            </div>
                <div className="table-div">
                <h1>Stores</h1>
                <table border="1" style={{ borderCollapse: "collapse", width: "90%" }}>
                <thead>
                    <tr>
                    <th>Store</th>
                    <th>Address</th>
                    <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(row => (
                    <tr key={row.id}>
                        <td>{row.storeName}</td>
                        <td>{row.address}</td>
                        <td>{row.rating}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
                <button className="add-btn" onClick={onClickAddStore}>Add Store</button>
                {addStore && 
                <form className="addform">
                    <p className="title">Add Store Details</p>
                        <input type="text" name="name" onChange={handleStoreChange} value={storeDetails.name} placeholder="Enter Name"/>
                        <input type="text" name="email" onChange={handleStoreChange} value={storeDetails.email} placeholder="Email"/>
                        <input type="text" name="address" onChange={handleStoreChange} value={storeDetails.address} placeholder="Enter Address"/>
                        <input type="text" name="owner_id" onChange={handleStoreChange} value={storeDetails.owner_id} placeholder="Enter Owner Id"/>
                        <button className="submit-button" onClick={onAddStoreDetails}>Submit</button>
                </form>}
                </div>
                <div className="table-div">
                    <h1>Users</h1>
                <table border="1" style={{ borderCollapse: "collapse", width: "90%" }}>
                <thead>
                    <tr>
                    <th>Store</th>
                    <th>Address</th>
                    <th>Rating</th>
                    <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(row => (
                    <tr key={row.id}>
                        <td>{row.name}</td>
                        <td>{row.address}</td>
                        <td>{row.email}</td>
                        <td>{row.role}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
                <button className="add-btn" onClick={onClickAddUser}>Add User</button>
                {addUser && (
                    <form className="addform">
                        <p className="title">Add User Details</p>
                        <input type="text" name="name" onChange={handleuserChange} value={userDetails.name} placeholder="Enter Name"/>
                        <input type="text" name="password" onChange={handleuserChange} value={userDetails.password} placeholder="Enter password"/>
                        <input type="text" name="email" onChange={handleuserChange} value={userDetails.email} placeholder="Email"/>
                        <input type="text" name="address" onChange={handleuserChange} value={userDetails.address} placeholder="Enter Address"/>
                        <input type="text" name="role" onChange={handleuserChange} value={userDetails.role} placeholder="Enter Role"/>
                        <button className="submit-button" onClick={onAddUserDetails}>Submit</button>
                    </form>
                )}
                
            </div>
        </div>
    </>
    )
}

export default AdminPage