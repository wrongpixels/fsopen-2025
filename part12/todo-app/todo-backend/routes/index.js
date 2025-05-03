const express = require('express');
const redis = require('../redis')
const router = express.Router();
const Todo = require('../mongo/models/Todo')

const configs = require('../util/config')

let visits = 0

router.get('/statistics', async (_, res) => {
  let data = await redis.getAsync('added_todos')
  if (!data)
  {
    data = await Todo.collection.countDocuments()
    await redis.setAsync('added_todos', data)
  } 
  res.json({added_todos: data})
})
/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

module.exports = router;
