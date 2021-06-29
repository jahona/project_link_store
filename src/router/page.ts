import * as express from "express"
import redis from "../util/redis"
const redisClient = redis.getInstance();

const router = express.Router();

router.get('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.send('/');
});

router.post('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const rData: any = {};
        rData.link = req.body.link;
        rData.timestamp = Date.now();
        redisClient.RPUSH('crawling_list', JSON.stringify(rData));
        
        res.status(200).json({result: 'success'});
});

export default router;
