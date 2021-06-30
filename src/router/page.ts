import * as express from "express"
import { Page } from '../database/models/Page'
import redis from "../util/redis"

const router = express.Router();

router.get('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send('/');
});

router.post('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const redisClient = redis.getInstance();
        const rData: any = {};
        rData.link = req.body.link;
        rData.timestamp = Date.now();
        redisClient.RPUSH('crawling_list', JSON.stringify(rData));
        
        //const page = Page.build(req.body);
        //await page.save();

        res.status(200).json({result: 'success'});
});

export default router;
