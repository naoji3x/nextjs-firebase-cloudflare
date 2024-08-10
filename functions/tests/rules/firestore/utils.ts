import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'

let testEnv: RulesTestEnvironment

export const initializeTestEnvironment = async (projectId: string) => {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  testEnv = await _initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('../firestore.rules', 'utf8')
    }
  })
}

export const getTestEnv = () => testEnv
