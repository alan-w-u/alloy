import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { db } from './firebase'
import { collection, query, where, orderBy, limit, getDoc, getDocs } from 'firebase/firestore'
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
  const fetchFirebaseData = async (table, options = {}) => {
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
      console.log(data)
      return data
    } catch (error) {
      console.error('Error fetching Firestore data: ', error)
    }
  }

  const fetchFirebaseDataById = async (table, id) => {
    try {
      const doc = doc(db, table, id)
      const docSnapshot = await getDoc(doc)
  
      if (docSnapshot.exists()) {
        return { id: docSnapshot.id, ...docSnapshot.data() }
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching Firestore data: ', error)
    }
  }

  return (
    <Router>
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
