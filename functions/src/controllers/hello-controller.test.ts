import { helloWorldKebab, helloWorldV2 } from '@/controllers/hello-controller'

describe('hello-controller', () => {
  const auth = {
    uid: 'dummy-uid',
    token: {
      name: 'dummy-name',
      email: 'dummy-email'
    }
  }
  it('should return hello v2', async () => {
    const result = helloWorldV2(auth)
    expect(result).toEqual('Hello v2 world!: dummy-uid,dummy-name,dummy-email')
  })
  it('should return hello kebab', async () => {
    const result = helloWorldKebab(auth)
    expect(result).toEqual('Hello kebab world!: dummy-uid')
  })
})
