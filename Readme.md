

- npx sequelize db:create

- npx sequelize-cli model:generate --name Product --attributes name:string,price:string,description:string
- npx sequelize-cli db:migrate

- npx sequelize-cli seed:generate --name demo-products

- npx sequelize-cli db:seed:all