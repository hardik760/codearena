const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

if (process.env.REDIS_URL) {
  client.connect()
    .then(() => console.log("Redis Connected"))
    .catch(err => console.error("Redis connection failed:", err.message));
} else {
  console.log("Redis URL not found, skipping connection.");
}

module.exports = client;