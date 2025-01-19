import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  fetchFirebaseData,
  fetchFirebaseDataById,
  fetchFirebaseDataByReference,
  writeFirebaseData,
  deleteFirebaseData,
  editFirebaseData
} from './firebase/firebaseCommands'
import {
  fetchGoogleApiData,
  fetchGoogleApiDataById
} from './googleApi'
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
      if (window.google) {
        // fetchGoogleApiData('bowling')
        // fetchGoogleApiDataById('ChIJi82IoUhxhlQROLLcjD_L99I')
      }

      const data = await fetchFirebaseData('users', {
        where: [
          { field: 'email', operator: '==', value: 'joe@gmail.com' }
        ]
      })
      setUserData(data[0])

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
    })()

    // editFirebaseData("users", "test_steve", "socials.linkedin", "BigSteve")
    // deleteFirebaseData("users", "1AjgUbxbGadZF54YZtqQ")

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
        <Route exact path="/" element={<Home userData={userData} />} />
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/hangout" element={<Hangout />} />
      </Routes>
    </Router>
  )
}

export default App
