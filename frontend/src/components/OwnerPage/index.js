import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import './index.css'

const OwnerPage = () => {

    const [stores, setStores] = useState([])
    const id = Cookies.get("id")

    useEffect(()=> {
            const getStores = async () =>{
            const jwtToken = Cookies.get('jwt_token')
            
            const url = 'https://storelistrating.onrender.com/api/owner/dashboard'
            const Id = {id}
            const options = {
                method: 'POST',
                headers : {
                    "Content-Type" : "application/json",
                    "authorization" : `Brearer ${jwtToken}`
                },
                body: JSON.stringify(Id)
            }
                const response = await fetch(url, options)
                const data = await response.json()
                setStores(data)
            }
            getStores()
        },[id])
    
    return(
        <>
        <Header />
        <ol className="stores-list-own">
        <h1>Stores</h1>
        {stores.map(each => (
        <li key={each.id} className="list owner-stores">
            <p className="title">Store Name : <span>{each.name}</span></p>
            <p className="title">Avg Rating : <span>{each.avgRating}</span></p>
        </li>
        ))}
        </ol>
        </>
    )
}

export default OwnerPage