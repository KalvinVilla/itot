import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import ip from "ip";

import root from "./root.js";
import logger from "./logger.js";
import { mysql_disconnect } from "./mysql.js";

const log = logger(import.meta);

const { SERVER_PORT } = process.env;
const { npm_package_name, npm_package_version } = process.env;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", root);

app.get("/", async (req, res, next) => {
  res.status(201).json({
    result: {
      npm_package_name,
      npm_package_version,
    },
  });
  next();
});

const server = app.listen(SERVER_PORT, (error) => {
  if (error) {
    log.error(error, "Error on started listening");
  } else {
    console.log("|------------------------------------------------------|");
    console.log("|          itot backend started listening              |");
    console.log(
      `|            local : http://localhost:${SERVER_PORT}             |`
    );
    console.log(
      `|           network : http://${ip.address()}:${SERVER_PORT}          |`
    );
    console.log("|------------------------------------------------------|");
  }
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, function () {
    server.close(function () {
      log.info("shudown in progress !");
      mysql_disconnect();
      process.exit(0);
    });
  });
}
