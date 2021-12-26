import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where, orderBy,
    serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import { update } from 'lodash';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBYqukSwjaP-sE41i3I70OJeDkq0tRikig",
    authDomain: "fir-9-2.firebaseapp.com",
    projectId: "fir-9-2",
    storageBucket: "fir-9-2.appspot.com",
    messagingSenderId: "1000263944402",
    appId: "1:1000263944402:web:e3705f98bb76b2238ac50b"
};
//init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()

const auth = getAuth()

//collection Ref
const colRef = collection(db, 'books')

//queries
// const q=query(colRef, where("author", "==","akkadate"),orderBy('createdAt','desc'))
const q = query(colRef, orderBy('createdAt', 'desc'))

//real time collection data ****
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
})


// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
        .then(() => {
            addBookForm.reset()
        })
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
        })
})

//get a single document
const docRef = doc(db, 'books', 'FxmrAfy8ToG6LtRh0JGG')

// getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data(), doc.id)
//     })

const unsubDoc = onSnapshot(docRef,(doc)=>{
    console.log(doc.data(),doc.id)
})

//updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    })
        .then(() => {
            updateForm.reset()
        })

})

//signing user up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred)=>{
            // console.log('user created:', cred.user)
            signupForm.reset()
        })
        .catch((err)=>{
            console.log(err.message)
        })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
    //   console.log('user signed out')
    })
    .catch(err => {
      console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email,password)
    .then((cred)=>{
        // console.log('user logged in :', cred.user)
    })
    .catch((err)=>{
        console.log(err.message)
    })
})


// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user)
  })
  
  // unsubscribing from changes (auth & db)
  const unsubButton = document.querySelector('.unsub')
  unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
  })