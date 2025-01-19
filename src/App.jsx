import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  fetchFirebaseData,
  fetchFirebaseDataById,
  fetchFirebaseDataByReference,
  writeFirebaseData
} from './firebase/firebaseCommands'
import { getCompatibility } from './scripts/mbti'
import { createGroupsByMbti } from './scripts/matcher'
import Nav from './components/Nav'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Hangout from './pages/Hangout'
import './App.css'

function App() {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    (async () => {
      const data = await fetchFirebaseData('users', {
        where: [
          { field: 'email', operator: '==', value: 'joe@gmail.com' }
        ]
      })
      setUserData(data)
      
      fetchFirebaseDataById('users', 'test_joe')
      fetchFirebaseDataByReference('users', 'test_joe', 'affiliations', 'user')
      console.log('MBTI compatibility for ESTJ: ', getCompatibility('ESTJ'))
      // writeFirebaseData('users', {
      //   age_range: 2,
      //   city: "Toronto",
      //   email: "jjames@gmail.com",
      //   interests: ['skateboarding', 'running', 'poker'],
      //   mbti: "intp",
      //   name: "Jamie James",
      //   password: "securepw123",
      //   pronouns: "she/her",
      //   socials: {linkedin: 'linkedin_jamie', insta: 'ig_jamie', discord: 'jjames'},
      // })
    })

    const users = [
        ['userA', 'INFJ'],
        ['userB', 'ESTP'],
        ['userC', 'ISFP'],
        ['userD', 'ENTP'],
        ['userE', 'ESFP'],
        ['userF', 'ENTJ']
    ]
    console.log('Users: ', users)
    console.log('Groups:', createGroupsByMbti(users, 3))
  }, [])

  return (
    <Router>
      <Nav />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/hangout" element={<Hangout />} />
      </Routes>
    </Router>
  )
}

export default App
