import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const SearchBooking = () => {
  const navigate = useNavigate()
    const [id, setId] = useState()
    const handleSearchBooking = () => {
      navigate(`/my-booking?search=${id}`)
    } 
  return (
    <div>
      searcn booking
      <input type="text" onChange={(e) => setId(e.target.value)} />
      <button onClick={handleSearchBooking}>sSearch</button>
    </div>
  )
}

export default SearchBooking
