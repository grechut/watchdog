const redis = require('redis');
const options = {
  prefix: 'watchdog:',
  no_ready_check: true,
};

function client() {
  if (process.env.REDISCLOUD_URL) {
    return redis.createClient(process.env.REDISCLOUD_URL, options);
  }

  return redis.createClient(options);
}

module.exports = client;
