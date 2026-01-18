import { useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const Home = () =>{

  const [stores, setStores] = useState([])
  const [rating, setRating] = useState("")
  const [id, setId] = useState(undefined)
  
  const jwtToken = Cookies.get("jwt_token")

  useEffect(()=> {
  const getStores = async () =>{
      const jwtToken = Cookies.get('jwt_token')
      const url = 'https://storelistrating.onrender.com/api/user/stores'

      const options = {
        method: 'GET',
        headers : {
          "Content-Type" : "application/json",
            "authorization" : `Brearer ${jwtToken}`
        }}

    const response = await fetch(url, options)
    const data = await response.json()
    setStores(data)
    }
    getStores()
    },[id])

    const onChangeRating = event =>{
      setRating(event.target.value)
    }

    const onSubmitRating = async id => {
      const url = 'https://storelistrating.onrender.com/api/user/ratings'
      const details ={store_id :id, rating}
      setId(id)
      const options = {
        method: 'POST',
        headers : {
            "Content-Type" : "application/json",
            "authorization" : `Brearer ${jwtToken}`
        },
        body: JSON.stringify(details),
      }

      const response = await fetch(url, options)
      if (response.ok){
        setRating("")
        setId(undefined)
        alert("Rating added")
      }
      
    }
    
    return(
        <>
        <Header />
        <div className='user-page'>
        <h1>Stores</h1>
        <table border="1" style={{ borderCollapse: "collapse", width: "90%" }}>
          <thead>
            <tr>
              <th>Store</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Submit Rating</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(row => (
              <tr key={row.id}>
                <td>{row.storeName}</td>
                <td>{row.address}</td>
                <td>{row.rating}</td>
                <td>
                  <input type="text" onChange={onChangeRating} placeholder='Enter Rating 1-5' className='rating-input'/>
                  <button className='submit-rating' onClick={() => onSubmitRating(row.id)}>Submit Rating</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </>
    )
}

export default Home