import { initializeApp } from 'firebase/app'
import { ref, getDatabase } from 'firebase/database' 
import { getAuth } from 'firebase/auth'

// Initialize Firebase
const fb = initializeApp({
  apiKey: 'AIzaSyDd4sKc1eN4qtprCxiKLWy8D_wK7rJURAI',
  authDomain: 'shackhand-autolearn.firebaseapp.com',
  databaseURL: 'https://shackhand-autolearn.firebaseio.com',
  projectId: 'shackhand-autolearn',
  storageBucket: 'shackhand-autolearn.appspot.com',
  messagingSenderId: '270389952986'
})

export const db = getDatabase(fb)
export const auth = getAuth(fb)
export const placesRef = ref(db, 'places')
// export const handsRef = ref(db, 'hands')
export const usersRef = ref(db, 'hands')
export const chatsRef = ref(db, 'chats')