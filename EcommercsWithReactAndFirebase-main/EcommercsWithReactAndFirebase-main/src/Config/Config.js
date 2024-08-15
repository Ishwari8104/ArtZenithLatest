import * as firebase from 'firebase/app';

import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBSUhkxuhWkvp_qxORB9n9N9jvN_BjL63c",
  authDomain: "dummydb-80829.firebaseapp.com",
  projectId: "dummydb-80829",
  storageBucket: "dummydb-80829.appspot.com",
  messagingSenderId: "55971318889",
  appId: "1:55971318889:web:020448818c0289c608a6f8",
  measurementId: "G-K1E57HSM4C"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export { auth, fs, storage }