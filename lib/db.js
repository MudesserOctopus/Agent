import sql from "mssql";

const server = process.env.DB_HOST || 'localhost\\SQLEXPRESS';
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// SQL Server Authentication configuration
const config = {
  server: server,
  database: database,
  user: user,
  password: password,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
};

// Validate required environment variables
if (!user || !password) {
  console.error("ERROR: DB_USER and DB_PASSWORD are required for SQL Server Authentication");
  console.error("Please set these in your .env.local file:");
  console.error("  DB_USER=your_username");
  console.error("  DB_PASSWORD=your_password");
}

export const pool = sql.connect(config)
  .then((pool) => {
    console.log("Connected to SQL Server using SQL Server Authentication");
    console.log(`Server: ${server}, Database: ${database}, User: ${user}`);
    return pool;
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err);
    console.error("Trying to connect to:", server);
    console.error("Database:", database);
    console.error("User:", user);


    throw err;
  });

export default sql;
