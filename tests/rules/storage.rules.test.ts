/** @jest-environment node */
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { randomUUID } from 'crypto'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { readFileSync } from 'fs'
import {
  getTestEnv,
  initializeTestEnvironment
} from 'tests/rules/rules-test-helper'

const file = readFileSync('./tests/assets/sample.png')

describe('firestore rules', () => {
  const userId1 = 'dummy-user-id1'
  const userId2 = 'dummy-user-id2'

  beforeAll(async () => {
    await initializeTestEnvironment()
  })

  afterEach(async () => {
    await getTestEnv().clearStorage()
  })

  afterAll(async () => {
    await getTestEnv().cleanup()
  })

  const collectionName = (uid: string) => `users/${uid}/todos`

  it("should be able to add and read your image and protect it from others' modifications", async () => {
    const storage1 = getTestEnv().authenticatedContext(userId1).storage()
    const path = `images/${randomUUID()}.png`
    const fileRef1 = ref(storage1, path)

    // 自分のデータの書き込み読み込みはOK。
    const docRef1 = await assertSucceeds(
      uploadBytes(fileRef1, file, { customMetadata: { owner: userId1 } })
    )

    await assertSucceeds(getDownloadURL(fileRef1))

    // 他人のデータの書き込みはNG、読み込みはOK。
    const storage2 = getTestEnv().authenticatedContext(userId2).storage()
    const fileRef2 = ref(storage2, path)

    await assertSucceeds(getDownloadURL(fileRef2))

    await assertFails(
      uploadBytes(fileRef2, file, { customMetadata: { owner: userId2 } })
    )

    await assertFails(
      uploadBytes(fileRef2, file, { customMetadata: { owner: userId1 } })
    )

    // 未認証の人の読み書きNG。
    const storage3 = getTestEnv().unauthenticatedContext().storage()
    const fileRef3 = ref(storage3, path)

    await assertFails(getDownloadURL(fileRef3))
    await assertFails(
      uploadBytes(fileRef3, file, { customMetadata: { owner: userId1 } })
    )
  })
})
