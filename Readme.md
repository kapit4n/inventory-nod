# api
Inventory code with node js and sequelize mysql

API for https://github.com/kapit4n/ng-vendei-full

# generate model
- npx sequelize-cli model:generate --name Product --attributes name:sstring,description:string

- npx sequelize-cli db:migrate:undo
- npx sequelize-cli db:migrate
- npx sequelize-cli db:seed:all
