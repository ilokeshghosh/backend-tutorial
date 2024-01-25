import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([])


  useEffect(()=>{
    axios.get('/api/jokes').then(response=>{
      setJokes(response.data)
    }).catch(error=>console.error('Error is : ',error))
  },[])

  return (
    <>
      <h1>FullStack App Demo</h1>
      <h2>JOKES : {jokes.length}</h2>
      {jokes.map((joke,index)=>(
        <div key={index}>
          <h2>{joke.title}</h2> 

          <h2>{joke.description}</h2>
        </div>
      ))}
    </>
  )
}

export default App
