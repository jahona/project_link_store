import { Page } from '../models/Page';
import SequelizeManager from '../sequelizer';

const tbname = 'Page';

console.log(`======Create ${tbname} Table======`);

const create_table = async () => {
  await Page.sync({force: true})
  .then(() => {
    console.log(`Success Create ${tbname} Table`);
  })
  .catch((err) => {
    console.log(`Error in Create ${tbname} Table: ${err}`);
  })
}

(async () => {
  const db = new SequelizeManager();

  await db.connect();

  await create_table();

  await db.close();
})();