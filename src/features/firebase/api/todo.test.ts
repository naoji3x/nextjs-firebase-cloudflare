/** @jest-environment node */
// https://stackoverflow.com/questions/75890427/firestore-rules-tests-always-ends-with-timeout-error
import {
  addTodo,
  deleteTodo,
  doTodo,
  getTodo,
  onTodosChanged,
  updateTodo
} from '@/features/firebase/api/todo'
import { addDoc, collection } from 'firebase/firestore'
import { readFileSync } from 'fs'
import { Todo } from 'shared/types/todo'
import {
  getTestEnv,
  initializeTestEnvironment
} from 'tests/rules/rules-test-helper'

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

const readBlob = (path: string, name: string, type = 'image/png'): Blob => {
  const filePath = path
  const fileBuffer = readFileSync(filePath)
  return new Blob([fileBuffer], { type })
}

describe('todo', () => {
  const userId = 'dummy-user-id'

  beforeAll(async () => {
    await initializeTestEnvironment()
  })

  beforeEach(async () => {
    getFirestoreMock.mockReturnValue(
      getTestEnv().authenticatedContext(userId).firestore()
    )
    getStorageMock.mockReturnValue(
      getTestEnv().authenticatedContext(userId).storage()
    )
  })

  afterEach(async () => {
    await getTestEnv().clearFirestore()
    await getTestEnv().clearStorage()
  })

  afterAll(async () => {
    await getTestEnv().cleanup()
  })

  it('should add dnd deletes a todo', async () => {
    const todo = {
      uid: userId,
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }
    const id = await addTodo(todo)
    expect(id).toBeTruthy()

    await deleteTodo(userId, id)
    const deletedTodo = await getTodo(userId, id)
    expect(deletedTodo).toBeNull()
  })

  it('should add, update, do and delete a todo', async () => {
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

  it('should add a todo with an image', async () => {
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

  it('should listen to todos changes', async () => {
    let todos: Todo[] = []

    const unsubscribe = onTodosChanged(userId, (newTodos) => {
      todos = newTodos
    })

    expect(todos.length).toBe(0)

    const todo = {
      uid: userId,
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }

    const id = await addTodo(todo)
    expect(todos.length).toBe(1)

    await deleteTodo(userId, id)
    expect(todos.length).toBe(0)

    unsubscribe()
    await addTodo(todo)
    expect(todos.length).toBe(0)
  })

  it('should add a todo by firestore api', async () => {
    const firestore = getTestEnv().authenticatedContext(userId).firestore()
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
