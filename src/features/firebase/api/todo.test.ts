/** @jest-environment node */
// https://stackoverflow.com/questions/75890427/firestore-rules-tests-always-ends-with-timeout-error

import {
  addTodo,
  deleteTodo,
  doTodo,
  getTodo,
  updateTodo
} from '@/features/firebase/api/todo'
import { RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { addDoc, collection } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { initializeTestEnvironment } from 'tests/rules/firestore/utils'

const getFirestoreMock = jest.fn()
const getStorageMock = jest.fn()

jest.mock('@/features/firebase/client', () => {
  const client = jest.requireActual<
    typeof import('@/features/firebase/client')
  >('@/features/firebase/client')
  return {
    __esModule: true,
    ...client,
    getFirestore: () => getFirestoreMock(),
    getStorage: () => getStorageMock()
  }
})

let testEnv: RulesTestEnvironment

const readBlob = (path: string, name: string, type = 'image/png'): Blob => {
  const filePath = path
  const fileBuffer = readFileSync(filePath)
  return new Blob([fileBuffer], { type })
}

describe('todo', () => {
  const userId = 'dummy-user-id'
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment()
  })

  beforeEach(async () => {
    getFirestoreMock.mockReturnValue(
      testEnv.authenticatedContext(userId).firestore()
    )
    getStorageMock.mockReturnValue(
      testEnv.authenticatedContext(userId).storage()
    )
  })

  afterEach(async () => {
    await testEnv.clearFirestore()
    await testEnv.clearStorage()
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  it('adds, updates, does and deletes a todo', async () => {
    const todo = {
      uid: userId,
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }

    const id = await addTodo(todo)
    expect(id).toBeTruthy()

    const newTodo = await getTodo(userId, id)
    expect(newTodo).not.toBeNull()
    expect(newTodo?.id).toBe(id)
    expect(newTodo?.uid).toBe(todo.uid)
    expect(newTodo?.title).toBe(todo.title)
    expect(newTodo?.instruction).toBe(todo.instruction)
    expect(newTodo?.scheduledAt.getTime()).toBe(todo.scheduledAt.getTime())
    expect(newTodo?.done).toBe(todo.done)

    const newInstruction = 'new instruction'
    await updateTodo(userId, id, { instruction: newInstruction })
    const updatedTodo = await getTodo(userId, id)
    expect(updatedTodo?.instruction).toBe(newInstruction)

    await doTodo(userId, id)
    const doneTodo = await getTodo(userId, id)
    expect(doneTodo?.done).toBeTruthy()

    await deleteTodo(userId, id)
    const deletedTodo = await getTodo(userId, id)
    expect(deletedTodo).toBeNull()
  })

  it('adds a todo with an image', async () => {
    const blob = readBlob('tests/assets/sample.png', 'sample.png')
    const id = await addTodo({
      uid: userId,
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false,
      imageBlob: blob
    })
    expect(id).not.toBeNull()

    const newTodo = await getTodo(userId, id)
    expect(newTodo).not.toBeNull()
    expect(newTodo?.image).toBeTruthy()
  })

  it('adds a todo by firestore api', async () => {
    const firestore = testEnv.authenticatedContext(userId).firestore()
    const todo = {
      uid: userId,
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }
    const collectionName = (uid: string) => `users/${uid}/todos`
    const docRef = await addDoc(
      collection(firestore, collectionName(userId)),
      todo
    )
    expect(docRef.id).toBeTruthy()
  })
})
