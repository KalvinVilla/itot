/**
 *
 */
export class RequestParser {
  constructor(
    action,
    table,
    attributes,
    limit,
    order,
    tables = [],
    conditions = []
  ) {
    this.action = this.parseType(action);
    this.table = table;
    this.attributes = attributes;
    this.limit = limit;
    this.order = order;
    this.tables = tables;
    this.conditions = conditions;
    this.keys = [];
    this.values = [];
  }

  addTable(table, link, attributes) {
    this.tables.push({
      table,
      link,
      attributes,
    });
  }

  addCondition(column, condition) {
    this.conditions.push({
      column,
      condition,
    });
  }

  parseType(action) {
    if (action === "get") {
      return "SELECT";
    } else if (action === "new") {
      return "INSERT INTO";
    }
    return action;
  }

  parseAttributes() {
    if (this.attributes !== undefined) {
      if (Array.isArray(this.attributes)) {
        return this.attributes.map((attribute) => {
          return `${this.table}.${attribute} as '${this.table}_${attribute}'`;
        });
      } else {
        return (
          this.table +
          "." +
          this.attributes +
          " as '" +
          this.table +
          "_" +
          this.attributes +
          "'"
        );
      }
    } else {
      return "*";
    }
  }

  parseTables() {
    let attr = "";
    let inner = "";
    this.tables.forEach((t) => {
      const { table } = t;
      const { attributes } = t;
      const { link } = t;
      if (Array.isArray(attributes)) {
        attr +=
          "," +
          attributes.map((el) => {
            return `${table}.${el} as '${table}_${el}'`;
          });
      } else {
        attr += `, ${table}.${attributes} as '${table}_${attributes}'`;
      }

      inner += ` INNER JOIN ${table} ON ${this.table}.${table}_${link} = ${table}.${link}`;
    });

    return {
      attr,
      inner,
    };
  }

  parseConditions() {
    let conditions = "";
    this.conditions.forEach((c, key) => {
      const { column } = c;
      const { condition } = c;
      if (key === 0) {
        if (Array.isArray(condition)) {
          conditions = `WHERE ${this.table}.${column} in (${condition.map(
            (el) => {
              return `'${el}'`;
            }
          )})`;
        } else {
          conditions = `WHERE ${this.table}.${column} = '${condition}'`;
        }
      } else {
        if (Array.isArray(condition)) {
          conditions += ` OR ${this.table}.${column} in (${condition.map(
            (el) => {
              return `'${el}'`;
            }
          )})`;
        } else {
          conditions += ` OR ${this.table}.${column} = '${condition}'`;
        }
      }
    });

    return conditions;
  }

  parseOrder() {
    if (this.order === "ASC" || this.order === "DESC") {
      return `ORDER BY name ${this.order}`;
    }
    return "";
  }

  build() {
    const attributes = this.parseAttributes();
    const tables = this.parseTables();
    const conditions = this.parseConditions();
    const order = this.parseOrder();
    const limit = "";
    switch (this.action) {
      case "SELECT":
        return `${this.action} ${attributes} ${tables.attr} FROM ${this.table} ${tables.inner} ${conditions} ${order} ${limit}`.trim();
      case "INSERT INTO":
        return `${this.action} ${this.table} (${this.keys}) VALUES (${this.values})`.trim();
      case "UPDATE":
        return `${this.action} ${this.table} SET `
    }
  }
}
