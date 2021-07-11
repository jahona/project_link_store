import * as express from "express"
import { Page } from '../database/models/Page'
import RedisClient from "../util/redis"

const publisher = new RedisClient().getInstance();
const router = express.Router();

router.get('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send('/');
});

router.post('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const rData: any = {};
            
        const page = Page.build(req.body);
        await page.save();

        rData.link = req.body.link;
        rData.linkId = page.id;
        rData.timestamp = Date.now();

        publisher.RPUSH('page-queue', JSON.stringify(rData), (err, reply) => {
            if (err) {
                console.log(`[Error][RedisClient][save] Redis Err: ${err}`);
            } else {
                console.log(`[Debug][RedisClient][save] Remained Count: ${JSON.stringify(reply)}`);
                publisher.emit('page-event', 'insert');
            }
        });
            
        res.status(200).json({result: 'success', linkId: page.id});
});

publisher.on('page-event', function(message) {
    console.log("Subscriber received message in message '" + message);
    // redisClient.LPOP
    publisher.emit('queue_pop', 'page-queue');
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
    
  publisher.on('queue_pop', (channel) => {
    console.log(`[Debug][Event][queue_pop] channel: ${channel}`)
    publisher.LPOP(channel, (err, data) => {
      if (err) {
        console.log(`[Error][Event][queue_pop] Redis Err: ${err}`);
      } else {
        console.log(`[Debug][Event][queue_pop] channel: ${channel}, data: ${JSON.stringify(data)}`)
      }
    });
  });

// router.post('/pull', 
//     async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//         const redisClient = Redis.getInstance();
//         redisClient.emit('queue_run_prase', 'crawling_list');
        
//         res.status(200).json({result: 'success'});
// });

export default router;
