import * as express from "express"
import indexRouter from "./router/index"

class App {
  public application: express.Application;

  constructor() {
    this.application = express();
  }
}

const app = new App().application;
app.use(express.json())
app.use('/', indexRouter);

app.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`[Path] ${req.method} ${req.path} [Param] ${JSON.stringify(req.body)}`);
  next();
})

// app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   res.send("Hello World");
// });

export default app;
