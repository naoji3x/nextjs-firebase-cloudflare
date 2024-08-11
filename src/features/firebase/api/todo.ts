'use client'

import { getFirestore, getStorage } from '@/features/firebase/client'
import 'firebase/firestore'
import { addDoc, collection, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { TodoInput } from 'shared/types/todo'

const collectionName = (uid: string) => `users/${uid}/todos`

const handleUpload = async (file: File): Promise<string | null> => {
  if (!file) return null
  const path = 'images/' + crypto.randomUUID()
  console.log('Uploading file... ' + path)
  const storageRef = ref(getStorage(), path)
  try {
    await uploadBytes(storageRef, file)
    console.log('File uploaded successfully')
    return path
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

type todoInput = Omit<TodoInput, 'image'> & { imageFile?: File }
type addTodoInput = todoInput
type updateTodoInput = Partial<Omit<todoInput, 'uid'>>

export const getImageUrl = async (image?: string) =>
  image ? await getDownloadURL(ref(getStorage(), image)) : ''

export const addTodo = async ({
  uid,
  title,
  instruction,
  scheduledAt,
  done,
  imageFile
}: addTodoInput) => {
  const imagePath = imageFile ? await handleUpload(imageFile) : undefined
  const todo: TodoInput = {
    uid,
    title,
    instruction,
    scheduledAt,
    done,
    image: imagePath ?? undefined
  }
  const docRef = await addDoc(
    collection(getFirestore(), collectionName(uid)),
    todo
  )
  console.log('Document written with ID: ', docRef.id)
}

export const deleteTodo = async (uid: string, id: string) => {
  const docRef = doc(getFirestore(), collectionName(uid), id)
  console.log(docRef.path)
  await deleteDoc(docRef)
}

export const updateTodo = async (
  uid: string,
  id: string,
  update: updateTodoInput
) => {
  const docRef = doc(getFirestore(), collectionName(uid), id)
  if (update.imageFile) {
    const image = await handleUpload(update.imageFile)
    delete update.imageFile
    await setDoc(docRef, { ...update, image }, { merge: true })
  } else {
    await setDoc(docRef, update, { merge: true })
  }
  console.log('Document written with ID: ', docRef.id)
}

export const doneTodo = async (uid: string, id: string, done = true) => {
  const docRef = doc(getFirestore(), collectionName(uid), id)
  await setDoc(docRef, { done }, { merge: true })
  console.log('Document written with ID: ', docRef.id)
}
