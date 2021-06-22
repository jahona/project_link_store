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
        res.send('/');
});

export default router;
