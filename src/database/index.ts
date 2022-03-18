import { Sequelize } from 'sequelize-typescript';
import models from './models';
import config from './db_config';

const sequelize = new Sequelize(config);

sequelize.addModels(models);

sequelize.authenticate().then(async () => {
  await sequelize.sync({ force: false }).then(
    async function () {
      console.log('The database is connected and stable.');
    },
    function (err) {
      console.log('An error occurred while creating the table:', err);
    },
  );
});

export default sequelize;
