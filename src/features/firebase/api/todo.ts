'use client'

import { getFirestore, getStorage } from '@/features/firebase/client'
import { randomUUID } from 'crypto'
import 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { todoConverter, TodoInput } from 'shared/types/todo'

const collectionName = (uid: string) => `users/${uid}/todos`

const handleUpload = async (blob: Blob): Promise<string | null> => {
  if (!blob) return null
  const path = 'images/' + randomUUID()
  console.log('Uploading file... ' + path)
  const storageRef = ref(getStorage(), path)
  try {
    await uploadBytes(storageRef, blob)
    console.log('File uploaded successfully')
    return path
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

type todoInput = Omit<TodoInput, 'image'> & { imageBlob?: Blob }
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
  imageBlob
}: addTodoInput) => {
  const imagePath = imageBlob ? await handleUpload(imageBlob) : undefined
  const todo: TodoInput = {
    uid,
    title,
    instruction,
    scheduledAt,
    done
  }
  if (imagePath) {
    todo.image = imagePath
  }
  const docRef = await addDoc(
    collection(getFirestore(), collectionName(uid)),
    todo
  )
  return docRef.id
}

export const deleteTodo = async (uid: string, id: string) => {
  const docRef = doc(getFirestore(), collectionName(uid), id)
  await deleteDoc(docRef)
}

export const updateTodo = async (
  uid: string,
  id: string,
  update: updateTodoInput
) => {
  const docRef = doc(getFirestore(), collectionName(uid), id)
  if (update.imageBlob) {
    const image = await handleUpload(update.imageBlob)
    delete update.imageBlob
    await setDoc(docRef, { ...update, image }, { merge: true })
  } else {
    await setDoc(docRef, update, { merge: true })
  }
}

export const doTodo = async (uid: string, id: string, done = true) => {
  const docRef = doc(getFirestore(), collectionName(uid), id)
  await setDoc(docRef, { done }, { merge: true })
}

export const getTodo = async (uid: string, id: string) => {
  const docRef = doc(getFirestore(), collectionName(uid), id).withConverter(
    todoConverter
  )
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : null
}
