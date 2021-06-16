import * as express from "express"
const router = express.Router();

router.get('/', 
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let response: any = {};
        response.result = 'success';
        res.send(response);
});

export default router;
