import logger from "../../logger.js";
import { mysql_request } from "../../mysql.js";
import { build_request } from "../../request-parser.js"

const log = logger(import.meta);

/**
 * 
 * @param {Array} list 
 * @returns {Array}
 */
const isUndefined = (list) => {
  return Object.values(list).map(el => {
    console.log(el)
    if(typeof el === 'undefined') return 1
    return 0;
  })
}

export const update_host = async (req, res) => {
  const { name, type_id, ip, mac, room_id, parent_id, vlan_uid, commentary } =
  req.body;
  const { sql_object } = req;

  // TODO CORRECT 
  sql_object.table.attributes = []
  sql_object.table.values = []

  if(typeof name !== 'undefined') { sql_object.table.attributes.push('name'); sql_object.table.values.push(name)}
  if(typeof type_id !== 'undefined') { sql_object.table.attributes.push('type_id'); sql_object.table.values.push(type_id)}
  if(typeof mac !== 'undefined') { sql_object.table.attributes.push('mac'); sql_object.table.values.push(mac)}
  if(typeof room_id !== 'undefined') { sql_object.table.attributes.push('room_id'); sql_object.table.values.push(room_id)}
  if(typeof parent_id !== 'undefined') { sql_object.table.attributes.push('parent_id'); sql_object.table.values.push(parent_id)}
  if(typeof vlan_uid !== 'undefined') { sql_object.table.attributes.push('vlan_uid'); sql_object.table.values.push(vlan_uid)}
  if(typeof commentary !== 'undefined') { sql_object.table.attributes.push('commentary'); sql_object.table.values.push(commentary)}
  
  sql_object.conditions.push({table: sql_object.table.name, attribute: 'ip', values: ip})

  build_request(sql_object, async request => {
    const response = await mysql_request(request);

    console.log(request)

    log.info(response, "send");
  
    res.status(200).json({
      request: request,
      result: response,
    });
  })
}

export const new_host = async (req, res) => {
  const { name, type_id, ip, mac, room_id, parent_id, vlan_uid } =
    req.body;
    const { sql_object } = req;

  sql_object.table.attributes = Object.keys(req.body)
  sql_object.table.values = Object.values(req.body)

  if (
    isUndefined([name, type_id, ip, mac, vlan_uid]).includes(1)
  ) {
    res.status(200).json({error: "error"});
    return;
  }
 
  build_request(sql_object, async request => {
    const response = await mysql_request(request);

    log.info(response, "send");
  
    res.status(200).json({
      request: request,
      result: response,
    });
  })
  
}

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
  const { sql_object } = req;



  if (hosts !== undefined) {
    //sql.addCondition("name", hosts);
    sql_object.conditions.push({table: sql_object.table.name, attribute: 'name', values: hosts})
  }

  if (ids !== undefined) {
    //sql.addCondition("id", ids);
    sql_object.conditions.push({table: sql_object.table.name, attribute: 'id', values: ids})
  }

  if (vlans !== undefined) {
    //sql.addCondition("vlan_uid", vlans);
    sql_object.conditions.push({table: sql_object.table.name, attribute: 'vlan_uid', values: vlans})
  }

  if (ips !== undefined) {
    //sql.addCondition("ip", ips);
    sql_object.conditions.push({table: sql_object.table.name, attribute: 'ip', values: ips})
  }

  if (selectType !== undefined) {
    //sql.addTable("type", "id", selectType);
    sql_object.conditions.push({table: sql_object.table.name, attribute: 'id', values: ips})
  }

  if (selectVlan !== undefined) {
    sql_object.table_join.push({table: "vlan", attributes: 'uid', values: ips})
    //sql.addTable("vlan", "uid", selectVlan);
  }

  if (selectParent !== undefined) {
    sql_object.table_join.push({table: "parent", attributes: 'id', values: selectParent})
    //sql.addTable("parent", "id", selectParent);
  }

  if (selectRoom !== undefined) {
    sql_object.table_join.push({table: "room", attributes: 'id', values: selectRoom})
    //sql.addTable("room", "id", selectRoom);
  }

  build_request(sql_object, async request => {
    const response = await mysql_request(request);

    log.info(response, "send");
  
    res.status(200).json({
      request: request,
      result: response,
    });
  })


};
