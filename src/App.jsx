import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  fetchFirebaseData,
  fetchFirebaseDataById,
  fetchFirebaseDataByReference
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
