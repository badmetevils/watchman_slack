// import { Sequelize } from 'sequelize';

// const {
//   DB_USER = 'root',
//   DB_PASSWORD = 'root',
//   DB_NAME = 'test_db',
//   DB_PORT = '3306',
//   DB_HOST = 'localhost'
// } = process.env;

// const db: { [key: string]: any } = {};

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   port: parseInt(DB_PORT),
//   dialect: 'mysql',
//   pool: {
//     max: 10,
//     min: 0,
//     idle: 10000
//   }
// });

// db.sequelize = sequelize;
// db.dataType = Sequelize;

// export default db;

// class Database {
//   private DB_USER = 'root';
//   private DB_PASSWORD = 'root';
//   private DB_NAME = 'test_db';
//   private DB_PORT = '3306';
//   private DB_HOST = 'localhost';
//   private sequelize: Sequelize;

//   constructor() {
//     this.DB_USER = process.env.DB_USER || '';
//     this.DB_PASSWORD = process.env.DB_PASSWORD || '';
//     this.DB_NAME = process.env.DB_NAME || '';
//     this.DB_PORT = process.env.DB_PORT || '';
//     this.DB_HOST = process.env.DB_HOST || '';

//     this.sequelize = new Sequelize(this.DB_NAME, this.DB_USER, this.DB_PASSWORD, {
//       host: this.DB_HOST,
//       port: parseInt(this.DB_PORT),
//       dialect: 'mysql',
//       pool: {
//         max: 10,
//         min: 0,
//         idle: 10000
//       }
//     });
//   }

//   connect() {
//     this.sequelize
//       .authenticate()
//       .then(res => {
//         console.log('😉 Connected to the database');
//       })
//       .catch(error => {
//         console.log('😨Error in connecting to the database');
//       });
//   }
// }

// export default new Database();
