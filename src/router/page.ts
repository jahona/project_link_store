import * as express from "express"
import { Page } from '../database/models/Page'
import Redis from "../util/redis"

const router = express.Router();

router.get('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send('/');
});

router.post('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const redisClient = Redis.getInstance();
        const rData: any = {};
            
        const page = Page.build(req.body);
        await page.save();

        rData.link = req.body.link;
        rData.linkId = page.id;
        rData.timestamp = Date.now();
        redisClient.emit('queue_push', 'crawling_list', rData);

        res.status(200).json({result: 'success', linkId: page.id});
});

router.post('/pull', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const redisClient = Redis.getInstance();
        redisClient.emit('queue_run_prase', 'crawling_list');
        
        res.status(200).json({result: 'success'});
});

export default router;
