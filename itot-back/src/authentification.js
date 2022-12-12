// import jwt from "jsonwebtoken";

import logger from "./logger.js";

const log = logger(import.meta);
/**
 *
 * Authorization
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
export default async function (request, response, next) {
  const header = request.headers.authentication;

  if (header && header !== null) {
    try {
      // const token = header.split(" ");
      // const userToken = jwt.verify(token[1], SECURITY_SECRET);
      const user = "Kavika"; // await User.findOne({ _id: userToken.id })

      if (user) {
        request.auth = {
          isAuthenticated: true,
          user,
        };
      }
    } catch (e) {
      log.warn("Invalid token detected.");
    }
  } else {
    request.auth = {
      isAuthenticated: false,
      user: null,
    };
  }

  next();
}
