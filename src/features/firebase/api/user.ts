import { arrayUnion, doc, setDoc } from 'firebase/firestore'
import { getFirestore } from '../client'

const collectionName = (uid: string) => `users/${uid}`

export const upsertToken = async (uid: string, token: string) => {
  const docRef = doc(getFirestore(), collectionName(uid))
  await setDoc(docRef, { tokens: arrayUnion(token) }, { merge: true })
}
