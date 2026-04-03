import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  // 1. 서버에서 목록 가져오기 (Read)
  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos')
      setTodos(res.data)
    } catch (err) {
      console.error("데이터 로딩 실패!", err)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // 2. 할 일 추가하기 (Create)
  const addTodo = async () => {
    if (!input) return
    try {
      // 백엔드 Schema에 맞춰 'title'로 보냅니다.
      await axios.post('http://localhost:5000/api/todos', { title: input })
      setInput('')
      fetchTodos() 
    } catch (err) {
      console.error("추가 실패!", err)
    }
  }

  // 3. 할 일 삭제하기 (Delete)
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`)
      fetchTodos()
    } catch (err) {
      console.error("삭제 실패!", err)
    }
  }

  // 4. 완료 상태 변경 (Update)
  const toggleComplete = async (todo) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${todo._id}`, {
        completed: !todo.completed
      })
      fetchTodos()
    } catch (err) {
      console.error("수정 실패!", err)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>창원대 Todo List</h1>
      
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input 
          style={{ flex: 1, padding: '10px' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo} style={{ padding: '10px', marginLeft: '5px', cursor: 'pointer' }}>추가</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '10px', 
            borderBottom: '1px solid #ddd',
            backgroundColor: todo.completed ? '#f9f9f9' : 'white'
          }}>
            <span 
              onClick={() => toggleComplete(todo)}
              style={{ 
                cursor: 'pointer', 
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#aaa' : '#000'
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App