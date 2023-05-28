import https from "https";
import fs from "fs";
import { logger } from "./logger";
import { AddressInfo } from "net";
import { Server } from "socket.io";
import Routes from "./routes";

const PORT = process.env.PORT ?? 3000;

const localHostSSL = {
    key: fs.readFileSync("./certificates/key.pem"),
    cert: fs.readFileSync("./certificates/cert.pem"),
};

const routes = new Routes();
const serverHttps = https.createServer(
    localHostSSL,
    routes.handler.bind(routes)
);

const io = new Server(serverHttps, {
    cors: {
        origin: "*",
        credentials: false,
    },
});
routes.setSocketInstance(io);

io.on("connection", (socket) => logger.info(`someone connected: ${socket.id}`));

const startServer = (server: https.Server) => () => {
    const { address, port } = server.address() as AddressInfo;
    logger.info(`app running at http://${address}:${port}`);
};

serverHttps.listen(PORT, startServer(serverHttps));
