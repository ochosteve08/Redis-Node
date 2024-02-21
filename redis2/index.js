const express = require("express");
const axios = require("axios");
const redis = require("redis");


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "working" });
});

// redis setup
let redisClient;

(async () => {
  redisClient = redis.createClient({
    host: "redis-server",
    port: 6379,
  });
  redisClient.on("error", (error) => {
    console.error(`Error: ${error} `);
  });
  await redisClient.connect();
})();

// const client= redis.createClient({
//   host: "localhost",
//   port: 6379,
//   password: 'password'

// })
// client.on('connect',()=>{
//   console.log('connected to redis')
// })
// client.on('error',(err)=>{
//   console.error('redis error:',err)
// })

const getTodo = async (req, res) => {
  const todoId = req.params.todoId;
  let results;
  let isCache = false;
  try {
    const cacheResults = await redisClient.get(todoId);
    if (isCache) {
      results = JSON.parse(cacheResults);
    } else {
      results = await fetchApiData(todoId);
      await redisClient.set(todoId, JSON.stringify(results));
    }
    res.status(200).json({
      fromCache: isCache,
      data: results,
    });
  } catch (err) {
    console.error(err);
  }
};
app.get("/todos/:todoId", getTodo);



const fetchApiData = async (todoId) => {
  const apiResponse = await axios.get(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`
  );
  console.log("Request sent to the API");
  return apiResponse.data;
};
app.listen(3000, () => {
  console.log("listening on port 3000");
});
