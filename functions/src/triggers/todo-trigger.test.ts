import { todo as todoTrigger } from '@/index'
import { getFirestore } from '@/lib/admin'
import { randomUUID } from 'crypto'
import firebaseFunctionsTest from 'firebase-functions-test'
import { makeChange } from 'firebase-functions-test/lib/v1'

let queueTodoMessageMock = jest.fn().mockReturnValue('dummy-task-id')
const deleteTaskMock = jest.fn()

jest.mock('../services/todo-message-service', () => ({
  queueTodoMessage: () => queueTodoMessageMock()
}))

jest.mock('../services/message-service', () => ({
  deleteTask: () => deleteTaskMock()
}))

const { wrap, firestore } = firebaseFunctionsTest({
  projectId: process.env.FUNCTIONS_TEST_PROJECT_ID
})
const { makeDocumentSnapshot } = firestore

const collectionName = (uid: string) => `users/${uid}/todos`
const docName = (uid: string, todoId: string) =>
  `${collectionName(uid)}/${todoId}`

describe('todo-trigger', () => {
  const uid = 'dummy-uid'
  it('should create and update a todo', async () => {
    const todoId = randomUUID()

    const todo = {
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }

    const docRef = getFirestore().doc(docName(uid, todoId))
    await docRef.set(todo)

    const snap = await docRef.get()
    expect({
      ...snap.data(),
      scheduledAt: snap.data()?.scheduledAt.toDate()
    }).toEqual(todo)

    await docRef.set(
      { title: 'updated title', taskId: 'dummy' },
      { merge: true }
    )
    const snapAfter = await docRef.get()
    expect(snapAfter.data()?.taskId).toEqual('dummy')
  })

  it('should insert taskId', async () => {
    const todoId = randomUUID()
    const dummyTaskId = 'dummy-task-id-for-create'
    queueTodoMessageMock = jest.fn().mockReturnValue(dummyTaskId)

    const todo = {
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }

    const snapshot = makeDocumentSnapshot(todo, docName(uid, todoId))
    const wrapped = wrap(todoTrigger.created)
    const event = {
      params: { uid, todoId },
      data: snapshot
    }
    await wrapped(event)
    expect(queueTodoMessageMock).toHaveBeenCalled()

    const snap = await snapshot.ref.get()
    expect(snap.data()?.taskId).toBe(dummyTaskId)
  })

  it('should replace taskId', async () => {
    const todoId = randomUUID()
    const dummyTaskId = 'dummy-task-id-for-update'
    queueTodoMessageMock = jest.fn().mockReturnValue(dummyTaskId)

    const date = new Date()
    date.setDate(date.getDate() + 1)

    const todo = {
      title: 'title',
      instruction: 'instruction',
      scheduledAt: date,
      done: false,
      taskId: 'dummy-task-id'
    }

    const wrapped = wrap(todoTrigger.updated)
    const snapBefore = makeDocumentSnapshot(todo, docName(uid, todoId))
    const snapAfter = makeDocumentSnapshot(
      { ...todo, title: 'updated title' },
      docName(uid, todoId)
    )
    const change = makeChange(snapBefore, snapAfter)
    const event = {
      params: { uid, todoId },
      data: change
    }
    await wrapped(event)

    const snap = await snapAfter.ref.get()
    expect(snap.data()?.taskId).toBe(dummyTaskId)

    expect(deleteTaskMock).toHaveBeenCalledTimes(1)
    expect(queueTodoMessageMock).toHaveBeenCalledTimes(1)
  })
})
