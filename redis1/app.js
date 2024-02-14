const express = require("express");
const axios = require("axios");
const redis = require("redis");
const app = express();

const Username = "steve";
const port = 4000;
const redis_port = 6739;
const client = redis.createClient(redis_port);

function formatOutput(username, numberOfRepos) {
  return `${username} has ${numberOfRepos} ${
    numberOfRepos > 1 ? "repos" : "repo"
  } `;
}

async function getRepos(req, res) {
  try {
    const username = req.params[Username];
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );
    const { public_repos } = await response.json();

    // cache data to redis
    client.setEx(username, 60, public_repos);
    res.send(formatOutput(username, public_repos));
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

// cache middleware
function cache(req, res, next) {
  const username = req.params[Username];

  client.get(username, (err, data) => {
    if (err) throw err;

    // if data exist in cache
    if (data != null) {
      console.log("this data is already cached");
      res.send(formatOutput(username, data));

      // else fetch data from database
    } else {
      console.log("this data is not cached");
      next();
    }
  });
}

app.get(`/repos/:${Username}`, cache, getRepos);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
