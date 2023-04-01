import { createClient, RedisClientType, SetOptions } from 'redis';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export let redisClient: RedisClientType;

export const createTheRedisClient = () => {
  const client = createClient({
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });

  client.on('error', (error) => console.error(`Error : ${error}`));

  (async () => {
    await client.connect();
  })();

  redisClient = client as RedisClientType;
};

export const getCacheData = async (key: string) => {
  const cacheHit = await redisClient.get(key);

  if (cacheHit) {
    const { data, timestamp } = JSON.parse(cacheHit);

    if (Date.now() - timestamp < DAY_IN_MS) {
      return JSON.parse(data);
    }
  }

  return null;
};

export const setCacheData = async (key: string, data: any, options: SetOptions = {}) => {
  const cacheData = JSON.stringify({
    data: JSON.stringify(data),
    timestamp: Date.now(),
  });

  await redisClient.set(key, cacheData, options);
};
