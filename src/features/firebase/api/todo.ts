'use client'

import 'firebase/firestore'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes
} from 'firebase/storage'
import { Todo, TodoInput } from 'shared/types/todo'
import { v4 as uuidv4 } from 'uuid'
import { getFirestore, getStorage } from '../client'
import { todoConverter } from '../types/todo-firebase'

const collectionName = (uid: string) => `users/${uid}/todos`

const handleUpload = async (
  blob: Blob,
  uid: string
): Promise<string | null> => {
  if (!blob) return null
  const path = 'images/' + uuidv4()
  console.log('Uploading file... ' + path)
  const storageRef = ref(getStorage(), path)
  try {
    await uploadBytes(storageRef, blob, { customMetadata: { owner: uid } })
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
  image ? await getDownloadURL(ref(getStorage(), image)) : undefined

export const addTodo = async (uid: string, todoToAdd: addTodoInput) => {
  const imagePath = todoToAdd.imageBlob
    ? await handleUpload(todoToAdd.imageBlob, uid)
    : undefined
  delete todoToAdd.imageBlob
  const todo = {
    ...todoToAdd,
    ...(imagePath ? { image: imagePath } : {})
  }

  const now = serverTimestamp()
  const docRef = await addDoc(collection(getFirestore(), collectionName(uid)), {
    ...todo,
    createdAt: now,
    updatedAt: now
  })
  return docRef.id
}

export const deleteTodo = async (uid: string, id: string) => {
  const docRef = doc(getFirestore(), collectionName(uid), id).withConverter(
    todoConverter
  )
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const { image } = docSnap.data()
    if (image) {
      const imageRef = ref(getStorage(), image)
      await deleteObject(imageRef)
    }
  }
  await deleteDoc(docRef)
}

export const updateTodo = async (
  uid: string,
  id: string,
  todoToUpdate: updateTodoInput
) => {
  const docRef = doc(getFirestore(), collectionName(uid), id)
  let image = undefined
  if (todoToUpdate.imageBlob) {
    image = await handleUpload(todoToUpdate.imageBlob, uid)
    delete todoToUpdate.imageBlob
  }

  await setDoc(
    docRef,
    {
      ...todoToUpdate,
      ...(image ? { image } : {}),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  )
}

export const doTodo = async (uid: string, id: string, done = true) => {
  const docRef = doc(getFirestore(), collectionName(uid), id)
  await setDoc(docRef, { done, updatedAt: serverTimestamp() }, { merge: true })
}

export const getTodo = async (uid: string, id: string) => {
  const docRef = doc(getFirestore(), collectionName(uid), id).withConverter(
    todoConverter
  )
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : null
}

export const onTodosChanged = (
  uid: string,
  callback: (todos: Todo[]) => void
) => {
  const col = collection(getFirestore(), collectionName(uid)).withConverter(
    todoConverter
  )
  const unsubscribe = onSnapshot(col, (snapshot) => {
    const newTodos: Todo[] = snapshot.docs
      .map((doc) => doc.data())
      .filter((t): t is Todo => t !== null)
      .sort((lhs, rhs) => rhs.scheduledAt.getTime() - lhs.scheduledAt.getTime())

    callback(newTodos)
  })
  return unsubscribe
}
