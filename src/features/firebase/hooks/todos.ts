'use client'

import { firestore } from '@/features/firebase/client'
import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Todo, todoConverter } from 'shared/types/todo'

const collectionName = (uid: string) => `users/${uid}/todos`

export const useTodos = (uid?: string) => {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    if (!uid) return
    const col = collection(firestore, collectionName(uid)).withConverter(
      todoConverter
    )
    const unsubscribe = onSnapshot(col, (snapshot) => {
      const newTodos: Todo[] = snapshot.docs
        .map((doc) => doc.data())
        .filter((t): t is Todo => t !== null)
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
