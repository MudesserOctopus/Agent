import sql from "mssql";

const server = process.env.DB_HOST || 'localhost\\SQLEXPRESS';
const database = process.env.DB_NAME;


const config = {
  server: server,
  database: database,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
    trustedConnection: true, // This enables Windows Authentication
  },
};

// Explicitly remove any user/password that might be set from env vars
if (config.user !== undefined) delete config.user;
if (config.password !== undefined) delete config.password;

export const pool = sql.connect(config)
  .then((pool) => {
    console.log("Connected to SQL Server using Windows Authentication");
    console.log(`Server: ${server}, Database: ${database}`);
    return pool;
  })
  .catch((err) => {
    console.error("DB Connection Failed:", err);
    console.error("Trying to connect to:", server);
    console.error("Database:", database);
    console.error("\nTroubleshooting:");
    console.error("1. Ensure SQL Server Express is running");
    console.error("2. Verify your Windows user has access to the database");
    console.error("3. Check that DB_HOST and DB_NAME are set correctly");
    throw err;
  });

export default {sql, pool};
