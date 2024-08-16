'use client'

import 'firebase/firestore'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { getFirestore } from '../client'
import { deviceTokenConverter } from '../types/device-token-firebase'

const collectionName = (uid: string) => `users/${uid}/device-tokens`

export const upsertDeviceToken = async (uid: string, token: string) => {
  const docRef = doc(getFirestore(), collectionName(uid), token).withConverter(
    deviceTokenConverter
  )
  const docSnap = await getDoc(docRef)
  const now = serverTimestamp()
  await setDoc(
    docRef,
    {
      updatedAt: now,
      ...(docSnap.exists() ? {} : { createdAt: now })
    },
    { merge: true }
  )

  return (await getDoc(docRef)).data()
}
export const deleteDeviceToken = async (uid: string, token: string) => {
  const docRef = doc(getFirestore(), collectionName(uid), token)
  await deleteDoc(docRef)
}

export const listDeviceTokens = async (uid: string) => {
  const col = collection(getFirestore(), collectionName(uid)).withConverter(
    deviceTokenConverter
  )
  const snapshot = await getDocs(col)
  return snapshot.docs.map((doc) => doc.data())
}
