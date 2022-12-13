import express from "express";

import authentification from "./authentification.js";
import logger from "./logger.js";
import { get_host, new_host } from "./modules/db/host.js";
import { RequestParser } from "./request-parser.js";

const router = express.Router();
const log = logger(import.meta);

router.use("/", authentification);

router.use("/db", function (req, res, next) {
  const path = req.path.split("/");
  const { 1: table, 2: type } = path;

  const { output, limit, order } = req.body;

  req.sql = new RequestParser(type, table, output, limit, order);

  next();
});

router.post("/db/host/get/", get_host);
router.post("/db/host/new/", new_host);

log.info("Every root has been initialized !");

export default router;
