import logger from "../../logger.js";
import { mysql_request } from "../../mysql.js";

const log = logger(import.meta);

export const get_vlan = async (req, res) => {
  const {
    vlans,
    names,
    networks,
  } = req.body;
  const { sql } = req;

  if (vlans !== undefined) {
    sql.addCondition("uid", vlans);
  }

  if (names !== undefined) {
    sql.addCondition("name", names);
  }

  if (networks !== undefined) {
    sql.addCondition("networks", networks);
  }

  const response = await mysql_request(sql.build());

  log.info(response, "send");

  res.status(200).json({
    request: sql.build(),
    result: response,
  });
};
