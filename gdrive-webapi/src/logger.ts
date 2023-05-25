import pino from "pino";

const logger = pino({
    prettyPrint: "pid,hostname",
});

export { logger };
