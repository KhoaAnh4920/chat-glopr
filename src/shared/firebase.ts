// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';

import firebase from 'firebase';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDldsEjTzD3xKUgHfttLK-bBqxuaG9G7Gg',
  authDomain: 'chat-glopr.firebaseapp.com',
  projectId: 'chat-glopr',
  storageBucket: 'chat-glopr.appspot.com',
  messagingSenderId: '514919268685',
  appId: '1:514919268685:web:11dc02febc22e56bd23704',
  measurementId: 'G-WF17KW42LG',
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
export { auth, firebase };
