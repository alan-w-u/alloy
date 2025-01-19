import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  fetchFirebaseData,
  fetchFirebaseDataById,
  fetchFirebaseDataByReference,
  writeFirebaseData
} from './firebase/firebaseCommands'
import { getCompatibility } from './scripts/mbti'
import Nav from './components/Nav'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Hangout from './pages/Hangout'
import './App.css'

function App() {
  useEffect(() => {
    fetchFirebaseData('users', {
      where: [
        { field: 'name', operator: '==', value: 'Joe Doe' }
      ]
    })
    fetchFirebaseDataById('users', 'test_joe')
    fetchFirebaseDataByReference('users', 'test_joe', 'affiliations', 'user')
    console.log('MBTI compatibility for ESTJ: ', getCompatibility('ESTJ'))
    writeFirebaseData('users', {
      age_range: 2,
      city: "Toronto",
      email: "jjames@gmail.com",
      interests: ['skateboarding', 'running', 'poker'],
      mbti: "intp",
      name: "Jamie James",
      password: "securepw123",
      pronouns: "she/her",
      socials: {linkedin: 'linkedin_jamie', insta: 'ig_jamie', discord: 'jjames'},
    })
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
