# api
Inventory code with node js and sequelize mysql

API for https://github.com/kapit4n/ng-vendei-full

# generate model
- npx sequelize-cli model:generate --name Product --attributes name:string,description:string

- npx sequelize-cli model:generate --name Client --attributes name:string,code:string,address:string

- npx sequelize-cli model:generate --name Cashier --attributes name:string,code:string,address:string

- npx sequelize-cli model:generate --name Category --attributes name:string,code:string,description:string

- npx sequelize-cli model:generate --name Category --attributes name:string,code:string,description:string

- npx sequelize-cli migration:create --name modify_products_add_new_fields


- npx sequelize-cli db:migrate:undo
- npx sequelize-cli db:migrate
- npx sequelize-cli db:seed:all
