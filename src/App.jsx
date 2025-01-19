import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { db } from './firebase'
import { collection, query, where, orderBy, limit, getDoc, doc, getDocs } from 'firebase/firestore'
import Nav from './components/Nav'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Hangout from './pages/Hangout'
import Profile from './pages/Profile'
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
  }, [])

  /**
   * Fetches data from the Firestore collection with optional conditions
   * 
   * @param {string} table - Name of the Firestore collection to query
   * @param {Object} [options = {}] - The conditions to customize the query
   * @param {Array} [options.where] - where: [{ field: string, operator: string, value: any }, ...]
   * @param {Array} [options.orderBy] - orderBy: [{ field: string, direction: string }, ...]
   * @param {number} [options.limit] - limit: number
   * 
   * @returns {Promise<Object|null>}
   */
  async function fetchFirebaseData(table, options = {}) {
    try {
      let q = query(collection(db, table))

      if (options.where) {
        options.where.forEach(condition => {
          const { field, operator, value } = condition 
          q = query(q, where(field, operator, value))
        })
      }

      if (options.orderBy) {
        options.orderBy.forEach(condition => {
          const { field, direction } = condition 
          q = query(q, orderBy(field, direction))
        })
      }

      if (options.limit) {
        q = query(q, limit(options.limit))
      }

      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log('fetchFirebaseData: ', data)
      return data
    } catch (error) {
      console.error('Error fetching Firestore data (fetchFirebaseData): ', error)
    }
  }

  async function fetchFirebaseDataById(table, id) {
    try {
      const ref = doc(db, table, id)
      const docSnapshot = await getDoc(ref)
  
      if (docSnapshot.exists()) {
        const data = { id: docSnapshot.id, ...docSnapshot.data() }
        console.log('fetchFirebaseDataById: ', data)
        return data
      } else {
        return null
      }
    } catch (error) {
      console.error('Error fetching Firestore data (fetchFirebaseDataById): ', error)
    }
  }

  async function fetchFirebaseDataByReference(referenceTable, referenceId, table, field) {
    try {
      const ref = doc(db, referenceTable, referenceId)
      const q = query(collection(db, table), where(field, '==', ref))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log('fetchFirebaseDataByReference: ', data)
      return data
    } catch (error) {
      console.error("Error fetching Firestore data (fetchFirebaseDataByReference): ", error)
    }
  }

  return (
    <Router>
      <Nav />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/hangout" element={<Hangout />} />
        <Route exact path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
