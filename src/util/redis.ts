import * as redis from "redis"
import * as _ from "lodash"

export default class RedisClient {
  private _redis: redis.RedisClient;

  constructor(options: any = {}) {
    const opts = _.extend({
      host: "127.0.0.1",
      port: 6379,
      options: {
        
      }
    }, options);

    opts.options.host = opts.host;
    opts.options.port = opts.port;

    console.log(`[Info] try to connect redis, redis Info = ${JSON.stringify(opts.options)}`);
    this._redis = redis.createClient(opts.options);
  
    this._redis.on('connect', () => {
      console.log('[Info] redis connect');
    });

    this._redis.on('error', (err) => {
      console.log(`[Error] Redis Err: ${err}`);
    });
  }

  public getInstance() {
    return this._redis;
  }
}