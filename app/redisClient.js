const redis = require('redis');
const redisOptions = {
  prefix: 'watchdog:',
  no_ready_check: true,
};

function getRedisClient() {
  if (process.env.REDISCLOUD_URL) {
    return redis.createClient(process.env.REDISCLOUD_URL, redisOptions);
  }

  return redis.createClient(redisOptions);
}

module.exports = getRedisClient;
