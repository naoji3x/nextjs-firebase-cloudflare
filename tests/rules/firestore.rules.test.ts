/** @jest-environment node */
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore'
import {
  getTestEnv,
  initializeTestEnvironment
} from 'tests/rules/rules-test-helper'

describe('firestore rules', () => {
  const userId1 = 'dummy-user-id1'
  const userId2 = 'dummy-user-id2'

  beforeAll(async () => {
    await initializeTestEnvironment()
  })

  afterEach(async () => {
    await getTestEnv().clearFirestore()
  })

  afterAll(async () => {
    await getTestEnv().cleanup()
  })

  const collectionName = (uid: string) => `users/${uid}/todos`

  it("should be able to add and read your todo and protect it from others' modifications", async () => {
    const firestore1 = getTestEnv().authenticatedContext(userId1).firestore()
    const todo = {
      uid: userId1,
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }

    // 自分のデータの書き込み読み込みはOK。
    const docRef1 = await assertSucceeds(
      addDoc(collection(firestore1, collectionName(userId1)), todo)
    )

    const snapshot1 = await assertSucceeds(getDoc(docRef1))
    expect(snapshot1.data()?.instruction).toEqual(todo.instruction)

    // 他人のデータの書き込みはNG、読み込みはOK。
    const firestore2 = getTestEnv().authenticatedContext(userId2).firestore()
    const docRef2 = doc(firestore2, docRef1.path)

    await assertSucceeds(getDoc(docRef2))
    await assertFails(setDoc(docRef2, { instruction: 'updated' }))

    await assertFails(
      addDoc(collection(firestore2, collectionName(userId1)), todo)
    )

    // 未認証の人の読み書きNG。
    const firestore3 = getTestEnv().unauthenticatedContext().firestore()
    const docRef3 = doc(firestore3, docRef1.path)

    await assertFails(getDoc(docRef3))
    await assertFails(setDoc(docRef3, { instruction: 'updated' }))
  })
})
