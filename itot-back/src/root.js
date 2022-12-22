import express from "express";

import authentification from "./authentification.js";
import logger from "./logger.js";
import { get_host, new_host, update_host } from "./modules/db/host.js";
import { get_vlan, new_vlan, update_vlan} from "./modules/db/vlan.js";

const router = express.Router();
const log = logger(import.meta);

router.use("/", authentification);

router.use("/db", function (req, res, next) {
  const path = req.path.split("/");
  const { 1: table, 2: action } = path;

  req.sql_object = {
    action: action,
    table: {
      name: table
    },
    table_join: [],
    conditions: []
  }

  next();
});

router.post("/db/host/get/", get_host);
router.post("/db/host/new/", new_host);
router.post("/db/host/update/", update_host)

router.post("/db/vlan/get/", get_vlan)
router.post("/db/vlan/new/", new_vlan);
router.post("/db/vlan/update/", update_vlan)

log.info("Every root has been initialized !");

export default router;
