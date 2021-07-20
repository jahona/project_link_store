import * as express from "express"
import * as path from "path"

class App {
  public application: express.Application;

  constructor() {
    this.application = express();
  }
}

const app = new App().application;
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../src/views'))
app.use(express.static(path.join(__dirname, '../src/public')));

app.use('/main', (req, res, next) => {
  res.render('index');
});

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