import * as express from "express"
import redis from "./util/redis"
redis.connect();

class App {
  public application: express.Application;

  constructor() {
    this.application = express();
  }
}

const app = new App().application;
app.use(express.json())
app.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`[Path] ${req.method} ${req.path} [Param] ${JSON.stringify(req.body)}`);
  next();
})

import indexRouter from "./router/index"
import pageRouter from "./router/page"

app.use('/', indexRouter);
app.use('/page', pageRouter);

export default app;