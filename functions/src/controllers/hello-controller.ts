import { Auth } from 'shared/types/auth'

export const helloWorldV2 = (auth?: Auth): string =>
  'Hello v2 world!: ' + auth?.uid + ',' + auth?.token.name ||
  '' + ',' + auth?.token.email ||
  ''

export const helloWorldKebab = (auth?: Auth): string =>
  'Hello kebab world!: ' + auth?.uid
