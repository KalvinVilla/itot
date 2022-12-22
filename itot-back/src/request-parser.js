
/**
 * 
 * @param {
 * action: string
 * table: {
 *  name: string
 *  attributes: string | array
 *  values: string | array
 * }
 * table_join: [
 *  {
 *    name: string
 *    join: string
 *    attributes: string 
 * }
 * condition, [
 * {
 *    table: string
 *    attribute: string
 *    values: string | array
},
 * ]
 * ]
 * } SQLObject 
 * @param {function name(params) {
  
 }} response 
 */
export const build_request = ({action, table, table_join, conditions}, response) => {
  const REQUEST = []

  const build_table_attributes = ({name, attributes}) => {
      if(attributes !== undefined) {
          if(Array.isArray(attributes)) {
              return attributes.map(atr => {
                  return `${name}.${atr} as '${name}_${atr}'`
              })
          } else {
              return `${name}.${attributes} as '${name}_${attributes}'`
          }
      } else {
          return '*'
      }
  }
  const build_table_join = ({name, join}) => {
      return `INNER JOIN ${name} ON ${table.name}.${name}_${join} = ${table.name}.${join}`;
  }
  /*
  *   TODO Add system for multiple condition
  */
  const build_table_condition = ({table, attribute, values}) => {
      /*
          TODO if table === undefined use main table 
      */
      if((Array.isArray(values))) {
          return `WHERE ${table}.${attribute} in ${values.map(v => {return `'${v}'`})}`
      } else {
          return `WHERE ${table}.${attribute} = '${values}'`
      }
  }

  const build_table_values = (values) => {
      return Object.values(values).map((el) => {
          if (Number.isInteger(el)) {
            return el;
          } else if (el === "" || el === "null") {
            return "null";
          } else {
            return `'${el}'`;
          }
        });
  }



  const build_table_update = ({attributes, values}) => {
      const builder = []

      for(let i = 0; i < attributes.length; i++) {
          builder.push(`${attributes[i]}="${values[i]}"`)
      }

      return builder.join(', ')
  }

  switch(action) {
      case "get":
          // SET ACTION REQUEST 
          REQUEST.push('SELECT')
          // SET ATTRIBUTES REQUEST 
          REQUEST.push(build_table_attributes(table))
          table_join.forEach(table => {
              REQUEST.push(build_table_attributes(table))
          });
          REQUEST.push('FROM')
          REQUEST.push(table.name)
          // SET INNER JOIN
          table_join.forEach(table => {
              REQUEST.push(build_table_join(table))
          })
          // SET CONDITION
          conditions.forEach(table => {
              REQUEST.push(build_table_condition(table))
          })
          break
      case "new":
          REQUEST.push('INSERT INTO')
          REQUEST.push(table.name)
          REQUEST.push(`(${table.attributes})`)
          REQUEST.push('VALUES')
          REQUEST.push(`(${build_table_values(table.values)})`)
          break
      case "update":
          REQUEST.push('UPDATE')
          REQUEST.push(table.name)
          REQUEST.push('SET')
          REQUEST.push(build_table_update(table))
          conditions.forEach(table => {
              REQUEST.push(build_table_condition(table))
          })
          break
      case "remove":
          REQUEST.push('DELETE FROM')
          REQUEST.push(table.name)
          conditions.forEach(table => {
              REQUEST.push(build_table_condition(table))
          })
          break
      default :
          sql = "ERROR"
          break
  }


  // BUILD STRING
  response(REQUEST.join(' '))
}