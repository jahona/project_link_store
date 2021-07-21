import SequelizeManager from '../sequelizer';

console.log(`======Migration DB======`);

(async () => {
  const db = new SequelizeManager();

  await db.connect();

  await db.sync();

  await db.close();
})();