// mssqlConfig.js
const config = {
    user: 'Azfaradmin',
    password: 'Blitz123',
    server: 'myfreesqldbserverr.database.windows.net',
    database: 'myFreeDB',
    port: 1433,
    options: {
      encrypt: true, // Encryption for Azure SQL Server
      trustServerCertificate: true, // Allow self-signed certs if necessary
      driver: 'ODBC Driver 17 for SQL Server'
    }
  };
  
  module.exports = config;
  