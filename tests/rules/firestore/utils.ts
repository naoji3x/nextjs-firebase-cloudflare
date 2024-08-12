import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing'
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'

export const initializeTestEnvironment =
  async (): Promise<RulesTestEnvironment> => {
    const projectId = randomUUID()
    return await _initializeTestEnvironment({
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
