import { getApps, initializeApp } from 'firebase/app'
import { getAuth as _getAuth } from 'firebase/auth'
import {
  getFirestore as _getFirestore,
  connectFirestoreEmulator,
  initializeFirestore
} from 'firebase/firestore'
import {
  getFunctions as _getFunctions,
  connectFunctionsEmulator
} from 'firebase/functions'
import {
  getStorage as _getStorage,
  connectStorageEmulator
} from 'firebase/storage'
import { firebaseEnv } from './env.mjs'

export const firebaseConfig = {
  apiKey: firebaseEnv.NEXT_PUBLIC_API_KEY,
  authDomain: firebaseEnv.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: firebaseEnv.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: firebaseEnv.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: firebaseEnv.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: firebaseEnv.NEXT_PUBLIC_APP_ID
}

export const emulatorsEnabled = () => {
  const useEmulators = firebaseEnv.NEXT_PUBLIC_USE_FIREBASE_EMULATORS
  return useEmulators ? useEmulators === 'true' : false
}

const firebase = getApps()?.length
  ? getApps()[0]
  : initializeApp(firebaseConfig)

initializeFirestore(firebase, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: emulatorsEnabled()
})

let initialized = false
const initialize = () => {
  if (initialized) return
  initialized = true

  if (emulatorsEnabled()) {
    connectFunctionsEmulator(getFunctions(), 'localhost', 5001)
    connectFirestoreEmulator(getFirestore(), 'localhost', 8080)
    connectStorageEmulator(getStorage(), 'localhost', 9199)
  }
}

export const getFirebaseApp = () => {
  console.log('getFirebaseApp')
  initialize()
  return firebase
}
export const getAuth = () => {
  console.log('getAuth')
  initialize()
  return _getAuth(firebase)
}
export const getFunctions = () => {
  console.log('getFunctions')
  initialize()
  return _getFunctions(firebase, 'asia-northeast1')
}
export const getFirestore = () => {
  console.log('getFirestore')
  initialize()
  return _getFirestore(firebase)
}
export const getStorage = () => {
  console.log('getStorage')
  initialize()
  return _getStorage(firebase)
}
