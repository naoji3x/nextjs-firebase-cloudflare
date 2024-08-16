import { FirestoreDataConverter } from 'firebase/firestore'
import { DeviceToken, deviceTokenBase } from 'shared/types/device-token'
import { z } from 'zod'
import { timestampsFirebase } from './timestamp-firebase'
export const deviceTokenFirebaseSchema = z.object({
  ...deviceTokenBase,
  ...timestampsFirebase
})
export type DeviceTokenFirebase = z.infer<typeof deviceTokenFirebaseSchema>

export const deviceTokenConverter: FirestoreDataConverter<DeviceToken> = {
  // date型は直接firestoreに保存できないが、Timestamp型に自動で変換される。
  toFirestore: (deviceToken) => {
    delete deviceToken.id
    return deviceToken
  },
  // date型をTimestampから元に戻す。
  fromFirestore: (snapshot) => {
    const data = snapshot.data({ serverTimestamps: 'estimate' })
    const parsedData = deviceTokenFirebaseSchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error(parsedData.error.errors.map((e) => e.message).join('\n'))
    }
    const firestore = parsedData.data
    return {
      id: snapshot.id,
      ...firestore,
      createdAt: firestore.createdAt ? firestore.createdAt.toDate() : undefined,
      updatedAt: firestore.updatedAt ? firestore.updatedAt.toDate() : undefined
    }
  }
}
