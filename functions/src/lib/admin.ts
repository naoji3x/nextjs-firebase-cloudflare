import { initializeApp } from 'firebase-admin/app'
import {
  getFirestore as _getFirestore,
  Firestore
} from 'firebase-admin/firestore'
import { TaskQueue } from 'firebase-admin/functions'
import { logger } from 'firebase-functions/v2'
import { setGlobalOptions } from 'firebase-functions/v2/options'

let initialized = false
let firestore: Firestore

const initialize = () => {
  if (initialized) {
    return
  }
  initialized = true
  const region = process.env.FUNCTIONS_REGION

  // v2のregionを設定
  setGlobalOptions({ region })
  initializeApp()
  // エミュレータはtaskに対応していないため、エミュレーターの場合はログに出力する。
  if (process.env.FUNCTIONS_EMULATOR) {
    Object.assign(TaskQueue.prototype, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enqueue: (data: any, params: any) =>
        logger.info('enqueue tasks: ', data, params),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete: (data: any) => logger.info('delete tasks: ', data)
    })
  }

  firestore = _getFirestore()
  firestore.settings({ ignoreUndefinedProperties: true })
}

export const getFirestore = () => {
  initialize()
  return firestore
}
