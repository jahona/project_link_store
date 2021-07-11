import { Page } from '../database/models/Page';
import RedisClient from "./redis"

function RedisEventHandlerInit() {
  console.log(`[Info] Register Event Handler`);
  const redisClient = new RedisClient().getInstance();

  // redisClient.subscribe('page-event');

  // redisClient.on('subscribe', function(channel, count) {
  //   console.log("Subscriber count in channel '" + channel + "': " + count);
  // });

  redisClient.on('page-event', function(message) {
    console.log("Subscriber received message in message '" + message);
    // redisClient.LPOP
    redisClient.emit('queue_pop', 'page-queue');
    // const multi = redisClient.multi();
    /*
      큐에서 10개만 가져오기
      TODO: Config 정보로 빼기
    */
    // multi.LRANGE('page-queue', 0, 9);
    // multi.LTRIM('page-queue', 9, -1);
    // multi.exec(async (err, reply) => {
    //   if (err) {
    //     console.log(`[Error][Event][queue_run_prase] Redis Err: ${err}`);
    //   } else {
    //     console.log(`[Debug][Event][queue_run_prase] channel: ${channel}, reply: ${reply[0]}`);

    //     // const ldata = reply[0];
    //     // for (let idx in ldata) {
    //     //   const data = JSON.parse(ldata[idx]);
    //     //   console.log(`[Info][Event][queue_run_prase] Strarting Crawling... ${JSON.stringify(data)}`);

    //     //   // TODO: Implement Crawling

    //     //   await Page.update({
    //     //     praseCompleteDate: Date.now()
    //     //   }, {
    //     //     where: {
    //     //       id: data.linkId
    //     //     }
    //     //   });
    //     // }
    //   }
    // })
  });
    
  redisClient.on('queue_pop', (channel) => {
    console.log(`[Debug][Event][queue_pop] channel: ${channel}`)
    redisClient.LPOP(channel, (err, data) => {
      if (err) {
        console.log(`[Error][Event][queue_pop] Redis Err: ${err}`);
      } else {
        console.log(`[Debug][Event][queue_pop] channel: ${channel}, data: ${JSON.stringify(data)}`)
      }
    });
  });
    
  redisClient.on('queue_run_prase', (channel) => {
    console.log(`[Debug][Event][queue_run_prase] channel: ${channel}`)
    const multi = redisClient.multi();
    /*
      큐에서 10개만 가져오기
      TODO: Config 정보로 빼기
    */
    multi.LRANGE(channel, 0, 9);
    multi.LTRIM(channel, 9, -1);
    multi.exec(async (err, reply) => {
      if (err) {
        console.log(`[Error][Event][queue_run_prase] Redis Err: ${err}`);
      } else {
        console.log(`[Debug][Event][queue_run_prase] channel: ${channel}, reply: ${reply[0]}`);

        const ldata = reply[0];
        for (let idx in ldata) {
          const data = JSON.parse(ldata[idx]);
          console.log(`[Info][Event][queue_run_prase] Strarting Crawling... ${JSON.stringify(data)}`);

          // TODO: Implement Crawling

          await Page.update({
            praseCompleteDate: Date.now()
          }, {
            where: {
              id: data.linkId
            }
          });
        }
      }
    })
  });
}

export { RedisEventHandlerInit };