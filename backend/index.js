require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결
// process.env.MONGODB_URI는 .env 파일에 적은 주소를 가져옵니다.
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공!'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// Todo 데이터 구조(Schema) 정의
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});
const Todo = mongoose.model('Todo', todoSchema);

// --- API 엔드포인트 (기능들) ---

// 1. 모든 할 일 가져오기 (Read)
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// 2. 새로운 할 일 추가하기 (Create)
app.post('/api/todos', async (req, res) => {
  const newTodo = new Todo({ title: req.body.title });
  await newTodo.save();
  res.json(newTodo);
});

// 3. 할 일 상태 수정하기 (Update)
app.put('/api/todos/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.params.id, 
    { completed: req.body.completed }, 
    { new: true }
  );
  res.json(todo);
});

// 4. 할 일 삭제하기 (Delete)
app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: '삭제 완료' });
});

// 서버 실행 (Vercel 배포를 위해 로컬에서만 실행되도록 설정)
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 서버 실행 중: http://localhost:${PORT}`));
}

module.exports = app; // Vercel 배포를 위해 반드시 필요함!