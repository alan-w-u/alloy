import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAsNSZAQnYDgAst8P4UDSEpqrCVDsJp9hc',
  authDomain: 'alloy-68f0f.firebaseapp.com',
  projectId: 'alloy-68f0f',
  storageBucket: 'alloy-68f0f.firebasestorage.app',
  messagingSenderId: '934487212977',
  appId: '1:934487212977:web:8bf6fc577c905c6eebf390'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
