/** @jest-environment node */
// https://stackoverflow.com/questions/75890427/firestore-rules-tests-always-ends-with-timeout-error

import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing'
import { randomUUID } from 'crypto'
import {
  collection,
  doc,
  DocumentData,
  Firestore,
  setDoc
} from 'firebase/firestore'
import { readFileSync } from 'fs'

let testEnv: RulesTestEnvironment

export const initializeTestEnvironment = async () => {
  const projectId = randomUUID()
  testEnv = await _initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: 'localhost',
      port: 8080
    },
    storage: {
      rules: readFileSync('storage.rules', 'utf8'),
      host: 'localhost',
      port: 9199
    }
  })
}

export const getTestEnv = () => testEnv

export const setCollection = <T extends DocumentData>(
  firestore: Firestore,
  id: string,
  instances: T[]
) => {
  Promise.all(
    instances.map((_) =>
      setDoc(doc(collection(firestore, id), randomUUID()), _)
    )
  )
}
