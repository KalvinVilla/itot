import { dirname, relative } from "path";
import { fileURLToPath } from "url";

import pino from "pino";

const root = dirname(fileURLToPath(import.meta.url));
const strip_extension = (path) => path.slice(0, path.lastIndexOf("."));

export default function logger({
  url = null,
  name = strip_extension(relative(root, fileURLToPath(url))),
}) {
  return pino({
    base: { name },
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:dd-mm-yyyy HH:mm:ss",
        colorize: true,
        ignore: "pid,hostname,filename",
      },
    },
    level: "info",
  });
}
