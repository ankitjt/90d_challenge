let firebaseConfig = {
  apiKey: "AIzaSyC7mI1e9jw8Cyfuoq-oZLxB9WGwwn300iM",
  authDomain: "habittracker-9c39e.firebaseapp.com",
  projectId: "habittracker-9c39e",
  storageBucket: "habittracker-9c39e.appspot.com",
  messagingSenderId: "745734155984",
  appId: "1:745734155984:web:c38224001620ad84d9f8d5",
  measurementId: "G-9BVXXCJ3WQ"
};

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
// const auth = firebase.auth()