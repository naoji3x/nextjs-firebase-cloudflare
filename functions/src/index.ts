/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {
  getAuth,
  helloWorldKebab,
  helloWorldV2,
  scheduleMessage,
  sendMessage
} from '@/functions'
import { todoCreated, todoDeleted, todoUpdated } from '@/triggers'

// ** note **
// firebase functions v1では関数名に大文字が使えるが、v2からは使えない。
// ケバブケースにするためには、関数名をオブジェクトに入れる。
// 関数をエクスポートする際に、オブジェクトに入れることで、ケバブケースにできる。
export const hello = { world: { kebab: helloWorldKebab, v2: helloWorldV2 } }
export const auth = { get: getAuth }
export const message = {
  send: sendMessage,
  task: scheduleMessage
}
export const todo = {
  created: todoCreated,
  updated: todoUpdated,
  deleted: todoDeleted
}
