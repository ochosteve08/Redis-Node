// cache-aside pattern is used to when there is need to query data frequently
// and want to fill cache on demand to save cost

const crypto = require("crypto");
const { connect } = require('...database');

function getHashKey(searchCriteria) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(searchCriteria))
    .digest("hex");
}

async function findTopMovies() {
  const { mongo, redis } = await connect();
  const searchCriteria = {
    languages: { $eq: "English" },
    imdbRating: { $gte: 8.5 },
  };
  const key = getHashKey(searchCriteria);
  const cacheValue = await redis.execute(["GET", key]);

  if (!!cacheValue) {
    console.log("CACHE HIT");
    return JSON.parse(cacheValue);
  }
  console.log("CACHE MISS");
  const result = await mongo
    .collection("movies")
    .find(searchCriteria)
    .toArray();
  await redis.execute(["SET", key, JSON.stringify(result), EX, 60]);
  return result;
}
try {
  await findTopMovies();
} catch (err) {
  console.log(err);
}
