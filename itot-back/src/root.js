import express from "express";

import authentification from "./authentification.js";
import logger from "./logger.js";

const router = express.Router();
const log = logger(import.meta);

router.use("/", authentification);

router.use("/db", function (req, res, next) {
  // const path = req.path.split("/");
  // const table = path[1];
  // const type = path[2];

  // const { output, limit, order } = req.body;

  next();
});

// router.post('/db/user/new/', new_user)

log.info("Every root has been initialized !");

export default router;
