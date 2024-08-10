import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore
} from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import { connectStorageEmulator, getStorage } from 'firebase/storage'
import { firebaseEnv } from './env.mjs'

export const firebaseConfig = {
  apiKey: firebaseEnv.NEXT_PUBLIC_API_KEY,
  authDomain: firebaseEnv.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: firebaseEnv.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: firebaseEnv.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: firebaseEnv.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: firebaseEnv.NEXT_PUBLIC_APP_ID
}

const emulatorsEnabled = () => {
  const useEmulators = firebaseEnv.NEXT_PUBLIC_USE_FIREBASE_EMULATORS
  return useEmulators ? useEmulators === 'true' : false
}

export const firebase = getApps()?.length
  ? getApps()[0]
  : initializeApp(firebaseConfig)

initializeFirestore(firebase, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: emulatorsEnabled()
})

export const firebaseApp = firebase

export const auth = getAuth(firebaseApp)
export const functions = getFunctions(firebaseApp, 'asia-northeast1')
export const firestore = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

if (emulatorsEnabled()) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
  connectFirestoreEmulator(firestore, 'localhost', 8080)
  connectStorageEmulator(storage, 'localhost', 9199)
}
