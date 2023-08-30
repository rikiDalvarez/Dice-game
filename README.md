# Dice-game

![github repo size](https://img.shields.io/github/repo-size/rikiDalvarez/Dice-game)
[![github last commit](https://img.shields.io/github/last-commit/rikiDalvarez/Dice-game)](https://github.com/rikiDalvarez/Dice-game)

Application built with hexagonal architecture and TDD.

## Login

![Login page](<./public/Screenshot 2023-08-30 at 17.06.43.png>)

## Register

![Register page](<./public/register.png>)

## Dashboard

![Dashboard page ranking list](<./public/Screenshot 2023-08-30 at 17.07.33.png>)

To start the server side navigate to the server folder and create a .env file with the following content:

```env
MONGO_URI="yourMongodbUri"
MONGO_URI_TEST="mongodbUriForTest"
NODE_ENV="development"
DATABASE_ENV='mongo'
TEST_DATABASE='test'
DATABASE="dicegame"
PORT="8012"

SQL_URI='mysql://127.0.0.1'
MYSQL_USER='root'
MYSQL_PASSWORD='password'
HOST='127.0.0.1'

JWT_SECRET='yoursecret'
```

Then run the following commands:

```bash
npm install
```

if you want to run the app with a mongodb database run:

```bash
npm run devmongo
```

if you wish to run the app with a mysql database run:

```bash
npm run devmysql
```
