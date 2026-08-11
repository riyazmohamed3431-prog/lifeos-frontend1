import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDzjyhCUkel2LTHWHAplGt1hfIMS5vV36Y",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lifeos-33dfd.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lifeos-33dfd",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lifeos-33dfd.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "812432597831",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:812432597831:web:e10e5895a9210c3796e262"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export default app;