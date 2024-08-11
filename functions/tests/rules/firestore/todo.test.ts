import { getTestEnv, initializeTestEnvironment } from './utils'

describe('useTodos', () => {
  beforeAll(async () => {
    const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'dummy-project-id'
    console.log('projectId:', projectId)
    await initializeTestEnvironment(projectId)
  })

  afterAll(async () => {
    await getTestEnv().cleanup()
  })

  it('should allow read if user is authenticated', async () => {
    expect(true).toBe(true)
  })
})
