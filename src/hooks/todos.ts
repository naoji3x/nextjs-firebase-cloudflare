'use client'

import { onTodosChanged } from '#features/firebase/api/todo'
import { useEffect, useState } from 'react'
import { Todo } from 'shared/types/todo'

export const useTodos = (uid?: string) => {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    if (!uid) return
    // コンポーネントがアンマウントされたときにリスナーを解除する
    return onTodosChanged(uid, (newTodos) => setTodos(newTodos))
  }, [uid])

  return { todos }
}

export default useTodos
