import logger from "../../logger.js";
import { mysql_request } from "../../mysql.js";
import { build_request } from "../../request-parser.js"

const log = logger(import.meta);

export const update_vlan = async (req, res) => {
  const {
    uid,
    name,
    network,
    mask,
    gateway
  } = req.body;
  const { sql_object } = req

  sql_object.table.attributes = ['name', 'network', 'mask', 'gateway']
  sql_object.table.values = [name,network, mask, gateway]
  sql_object.conditions.push({table: sql_object.table.name, attribute: 'uid', values: uid})

  build_request(sql_object, async request => {
    const response = await mysql_request(request);

    log.info(response, "send");
  
    res.status(200).json({
      request: request,
      result: response,
    });
  })

}

export const new_vlan = async (req, res) => {
  const {
    uid,
    name,
    network,
    mask,
    gateway
  } = req.body;
  const { sql_object } = req

  sql_object.table.attributes = Object.keys(req.body)
  sql_object.table.values = Object.values(req.body)

  build_request(sql_object, async request => {
    const response = await mysql_request(request);

    log.info(response, "send");
  
    res.status(200).json({
      request: request,
      result: response,
    });
  })

}


export const get_vlan = async (req, res) => {
  const {
    vlans,
    names,
  } = req.body;
  const { sql_object } = req;

  if (vlans !== undefined) {
    //sql.addCondition("uid", vlans);
    sql_object.conditions.push({table: sql_object.table.name, attribute: 'uid', values: vlans})
  }

  if (names !== undefined) {
    //sql.addCondition("name", names);
    sql_object.conditions.push({table: sql_object.table.name, attribute: 'name', values: names})
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
