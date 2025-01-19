import { db } from './firebase'
import { collection, query, where, orderBy, limit, getDoc, doc, getDocs, addDoc, deleteDoc, updateDoc } from 'firebase/firestore'

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
export async function fetchFirebaseData(table, options = {}) {
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

export async function fetchFirebaseDataById(table, id) {
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

export async function fetchFirebaseDataByReference(referenceTable, referenceId, table, field) {
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

export async function writeFirebaseData(referenceTable, data) {
  try {
    const tableRef = collection(db, referenceTable)
    const docRef = await addDoc(tableRef, data)

    console.log("Document written with ID: ", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error writing data (writeFirebaseData): ", error)
  }
}

export async function deleteFirebaseData(referenceTable, referenceId) {
  try {
    const docRef = doc(db, referenceTable, referenceId)
    await deleteDoc(docRef)

    console.log("Document deleted with ID: ", referenceId)
    // return referenceId
  } catch (error) {
    console.error("Error deleting data (deleteFirebaseData): ", error)
  }
}

export async function editFirebaseData(referenceTable, referenceId, field, newData) {
  try {
    const docRef = doc(db, referenceTable, referenceId)
    await updateDoc(docRef, {
      [field]: newData      
    })

    console.log("Edited Document with ID: ${referenceID}, ${referenceId: updatedData}")
  } catch (error) {
    console.error("Error Edited data (editFirebaseData): ", error)
  }
}