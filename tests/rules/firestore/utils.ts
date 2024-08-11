import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing'
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'

export const initializeMockEnvironment =
  async (): Promise<RulesTestEnvironment> => {
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
    const projectId = randomUUID()
    const mockEnv = await _initializeTestEnvironment({
      projectId,
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8')
      }
    })

    return mockEnv
  }
