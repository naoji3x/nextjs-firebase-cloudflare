'use client'

import { firestore } from '@/features/firebase/client'
import { Todo, WithId, firestoreToTodo, todoFirestoreSchema } from '@/types'
import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const collectionName = (uid: string) => `users/${uid}/todos`

export const useTodos = (uid?: string) => {
  const [todos, setTodos] = useState<WithId<Todo>[]>([])

  useEffect(() => {
    if (!uid) return
    const col = collection(firestore, collectionName(uid))
    const unsubscribe = onSnapshot(col, (snapshot) => {
      const newTodos: WithId<Todo>[] = snapshot.docs
        .map((doc) => {
          const parsedData = todoFirestoreSchema.safeParse(doc.data())
          if (!parsedData.success) {
            console.error(parsedData.error)
            return null
          } else {
            return {
              id: doc.id,
              ...firestoreToTodo(parsedData.data)
            }
          }
        })
        .filter((t): t is WithId<Todo> => t !== null)
        .sort(
          (lhs, rhs) => rhs.scheduledAt.getTime() - lhs.scheduledAt.getTime()
        )

      setTodos(newTodos)
    })
    // コンポーネントがアンマウントされたときにリスナーを解除する
    return () => unsubscribe()
  }, [uid])

  return { todos }
}

export default useTodos
