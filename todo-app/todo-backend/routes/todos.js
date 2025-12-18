const express = require('express');
const redis = require('../redis');
const { Todo } = require('../mongo')
const router = express.Router();

const getFromRedis = async () => {
  let cnt = await redis.getAsync('added_todos')
  if (cnt === null) {
    cnt = 0
    redis.setAsync('added_todos', 0)
  } else {
    cnt = Number(cnt)
  }
  return cnt
}

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* GET todos statistics */
router.get('/statistics/', async (_, res) => {
  const cnt = await getFromRedis()
  res.send({ 'added_todos': cnt });
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const cnt = await getFromRedis()
  redis.setAsync('added_todos', cnt + 1)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  req.todo.text = req.body.text
  req.todo.done = req.body.done
  const updatedTodo = await req.todo.save()
  if (!updatedTodo) return res.sendStatus(404)
  res.send(updatedTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
