import mysql from "mysql";

import logger from "./logger.js";

const log = logger(import.meta);

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

const db = mysql.createConnection({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
});

const mysql_connect = () => {
  db.connect((err) => {
    if (err) log.error(err);
    log.info("Mysql database connected");
  });
};

mysql_connect();

export const mysql_disconnect = () => {
  db.end((err) => {
    if (err) log.error(err);
    log.info("Mysql database disconnected");
  });
};

db.on("error", (error) => {
  log.error(error, "Error with database, trying to ");

  setTimeout(() => {
    mysql_connect();
  }, 5000);
});

export const mysql_request = async (request) => {
  return new Promise((resolve) => {
    db.query(request, function (err, result) {
      if (err) {
        resolve(err);
      } else {
        resolve(result);
      }
    });
  });
};

export const mysql_version = async () => {
  return await mysql_request("SHOW VARIABLES LIKE '%version%'");
};
