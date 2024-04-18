import { initializeApp } from 'firebase/app'
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBP3v_CRpsbLnlaEnYUvjnr28XwWJCXG4k",
    authDomain: "alpha-393a4.firebaseapp.com",
    projectId: "alpha-393a4",
    storageBucket: "alpha-393a4.appspot.com",
    messagingSenderId: "968379729419",
    appId: "1:968379729419:web:342087a46da2e4a523290e"
};

initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

const colRef = collection(db, 'books')

const q = query(colRef, orderBy('createdAt'))
// const q = query(colRef, where("author", "==", "Jane Austen"), orderBy('createdAt'))

// for this import getDocs method from firebase/firestore 
// getDocs(colRef)
//     .then((snapshot) => {
//         let books = []
//         snapshot.docs.forEach((doc) => {
//             books.push({ ...doc.data(), id: doc.id })
//         })
//         console.log(books)
//     })
//     .catch((err) => {
//         console.log(err)
//     })

// function here fires everytime there is a change in the collection 
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)
})

const addBookForm = document.querySelector('.add') 
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
        .then(() => addBookForm.reset())
})

const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)
    deleteDoc(docRef)
        .then(() => deleteBookForm.reset())
})

const docRef = doc(db, 'books', 'P4ic8WIjd0t4RUbg0KiB')
getDoc(docRef)
    .then((doc) => {
        console.log(doc.data(), doc.id)
    })

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
})

const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)
    updateDoc(docRef, {
        title: 'update title'
    })
        .then(() => {
            updateForm.reset()
        })
})

const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('User created: ', cred.user)
            signupForm.reset()
        })
        .catch((err) => console.log(err.message))
})

const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            // console.log("The user signed out.");
        })
        .catch((err) => {
            console.log(err.message);
        })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            // console.log("User logged in:", cred.user)
        })
        .catch((err) => {
            console.log(err.message);
        })
})

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('User status changed:', user);
})

const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('Unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})
