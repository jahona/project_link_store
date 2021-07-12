import * as express from 'express'
import { Page } from '../database/models/Page'
import RedisClient from "../util/redis"
import got from 'got';
import { fetchArticle } from '../util/siteCrawling';

const redisClient = new RedisClient().getInstance();
const router = express.Router();

redisClient.on('insert-crawling-queue', (data) => {
    redisClient.RPUSH('crawling-queue', JSON.stringify(data));
    redisClient.publish('event-page', 'insert');
})

// TODO: RedisClient 분리
const subscriber = new RedisClient().getInstance();
subscriber.subscribe('event-page');
subscriber.on('message', async (channel, message) => {
    if (channel === 'event-page') {
        if (message === 'insert') {
            try {
                const response = await got.post('http://localhost:3000/page/run');
                console.log(response.body);
            } catch (error) {
                console.log(error.response.body);
            }            
        }
    }    
})

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

        redisClient.emit('insert-crawling-queue', rData);
    
        res.status(200).json({result: 'success', linkId: page.id});
});

router.post('/run',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const multi = redisClient.multi();
        
        multi.LRANGE('crawling-queue', 0, 9);
        multi.LTRIM('crawling-queue', 9, -1);
        multi.exec(async (err, reply) => {
        if (err) {
            console.log(`[Error] Redis Err: ${err}`);
        } else {
            console.log(`[Debug] channel: 'insert-crawling-queue', reply: ${reply[0]}`);

            const ldata = reply[0];
            for (let idx in ldata) {
                const data = JSON.parse(ldata[idx]);
                console.log(`[Info][Event][queue_run_prase] Strarting Crawling... ${JSON.stringify(data)}`);
                
                const result: any = await fetchArticle(data.link);

                await Page.update({
                    title: result.title,
                    content: result.description,
                    words: result.keywords,
                    praseCompleteDate: Date.now()
                }, {
                    where: {
                        id: data.linkId
                    }
                });
            }

            res.status(200).json({result: 'success'});
        }
    });
});

export default router;
