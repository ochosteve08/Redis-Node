

const express = require("express");
const fetch = require("node-fetch");
const redis = require("redis");

const username = "steve";
const port = 4000;
const redis_port = 6739;
const client = redis.createClient(redis_port);

function formatOutput(username, numberOfRepos) {}

async function getRepos(req, res) {
    try{
      const username = req.params[USERNAME];
      const response = await fetch(`https://api.github.com/users/${username}`)
      const {public_repos} = await response.json();

      // cache data to redis
      client.set()
    }
    catch(err){
        console.error(err);
    }
}

// cache middleware
function cache(req, res, next) {
  const username = req.params[USERNAME];
  client.get(username, (err, data) => {
    if (err) throw err;
    if (data != null) {
      res.send(formatOutput(username, data));
    } else {
      next();
    }
  });
}

app.get(`/repos/:${username}`, cache, getRepos);

app.listen(port, () => {
  console.log("listening on port ${port}");
});
