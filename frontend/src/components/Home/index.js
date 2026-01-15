import { useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const Home = () =>{

  const [stores, setStores] = useState([])
  const [rating, setRating] = useState("")
  const [id, setId] = useState("")
  
  const jwtToken = Cookies.get("jwt_token")

  useEffect(()=> {
  const getStores = async () =>{
      const jwtToken = Cookies.get('jwt_token')
      const url = 'https://storeslistbackend.onrender.com/api/user/stores'

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
    },[])

    const onChangeRating = event =>{
      setRating(event.target.value)
    }

    const onSubmitRating = async id => {
      const url = 'https://storeslistbackend.onrender.com/api/user/ratings'
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
      const data = await response.json()
      console.log(data)
    }
    
    return(
        <div className='user-page'>
        <Header />
        <h1>Stores</h1>
        <ol className="stores-list-user">
        {stores.map(each => 
          (
            <li key={each.id} className="list owner-stores">
              <p className="title">Store Name : <span>{each.storeName}</span></p>
              <p className="title">Address : <span>{each.address}</span></p>
              <p className="title">Email : <span>{each.email}</span></p>
              <p className="title">Rating : <span>{each.rating}</span></p>
              <div>
                <input type="text" onChange={onChangeRating} placeholder='Enter Rating 1-5' className='rating-input'/>
                <button className='submit-rating' onClick={() => onSubmitRating(each.id)}>Submit Rating</button>
              </div>
              {id === each.id && <p>Rating added</p>}
            </li>
        ))}
        </ol>
        </div>
    )
}

export default Home