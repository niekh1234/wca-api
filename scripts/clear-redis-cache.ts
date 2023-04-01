import dotenv from 'dotenv';
import { createTheRedisClient, redisClient } from '../src/lib/redis';
dotenv.config();

const KEYS_TO_DEL = ['records', 'record'];

const clearRedisCache = async () => {
  await createTheRedisClient();

  for (const key of KEYS_TO_DEL) {
    await redisClient.del(key);
  }

  console.log('Redis cache cleared');
  process.exit(0);
};

clearRedisCache();
