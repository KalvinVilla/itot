import logger from "../../logger.js";
import { mysql_request } from "../../mysql.js";

const log = logger(import.meta);

export const new_host = async (req, res) => {
  const { name, type_id, ip, mac_address, room_id, switch_id, vlan_uid } =
    req.body;

  const { sql } = req;

  sql.keys = Object.keys(req.body);
  console.log(Object.values(req.body));
  sql.values = Object.values(req.body).map((el) => {
    if (Number.isInteger(el)) {
      return el;
    } else if (el === "" || el === "null") {
      return "null";
    } else {
      return `'${el}'`;
    }
  });

  console.log(sql);

  if (
    name === "undefined" ||
    type_id === "undefined" ||
    ip === "undefined" ||
    mac_address === "undefined" ||
    room_id === "undefined" ||
    switch_id === "undefined" ||
    vlan_uid === "undefined"
  )
    return;
  // res.status(200).json(MISSING_ARGUMENT);

  // const response = await create_host(name, type_id, ip, mac_address, room_id, switch_id, vlan_uid)
  const response = await mysql_request(sql.build());
  log.info([response], "Add new local user on mysql db : ");

  res.status(201).json({
    result: response,
    request: sql.build(),
  });
};

export const get_host = async (req, res) => {
  const {
    hosts,
    ids,
    vlans,
    ips,
    selectType,
    selectVlan,
    selectParent,
    selectRoom,
  } = req.body;
  const { sql } = req;

  if (hosts !== undefined) {
    sql.addCondition("name", hosts);
  }

  if (ids !== undefined) {
    sql.addCondition("id", ids);
  }

  if (vlans !== undefined) {
    sql.addCondition("vlan_uid", vlans);
  }

  if (ips !== undefined) {
    sql.addCondition("ip", ips);
  }

  if (selectType !== undefined) {
    sql.addTable("type", "id", selectType);
  }

  if (selectVlan !== undefined) {
    sql.addTable("vlan", "uid", selectVlan);
  }

  if (selectParent !== undefined) {
    sql.addTable("parent", "id", selectParent);
  }

  if (selectRoom !== undefined) {
    sql.addTable("room", "id", selectRoom);
  }

  const response = await mysql_request(sql.build());

  log.info(response, "send");

  res.status(200).json({
    request: sql.build(),
    result: response,
  });
};
