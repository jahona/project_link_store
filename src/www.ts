import app from "./app"
import { createServer } from "http";
// import SequelizeManager from "./database/sequelizer"

const port : number = Number(process.env.PORT) || 3000;

const server = createServer(app);

server.listen(port, async () => {
    console.log(`[Info] Server Start Listening ${port}`);

    // const db = new SequelizeManager();
    // await db.connect();
    // await db.sync();
})

export default server;
