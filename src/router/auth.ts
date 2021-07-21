import * as express from "express"
const router = express.Router();

router.post('/login', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const { userId } = req.body;

        // userKey 체크

        // mfa 요청
});

router.post('/mfa',
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        
});

export default router;
