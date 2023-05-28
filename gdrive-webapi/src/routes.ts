import { IncomingMessage, ServerResponse } from "http";
import path from "path";
import FileHelper from "./fileHelper";
import { logger } from "./logger";

export default class Routes {
    public io?: any;

    constructor(
        private downloadsFolder: string = path.join(
            __dirname,
            "../",
            "downloads"
        ),
        private fileHelper = FileHelper
    ) {
        logger.info("Downloads folder: " + downloadsFolder);
    }

    setSocketInstance(io: any) {
        this.io = io;
    }

    async defaultRoute(req: IncomingMessage, res: ServerResponse) {
        res.end("hello world");
    }
    async options(req: IncomingMessage, res: ServerResponse) {
        res.writeHead(204);
        res.end("hello world");
    }

    async post(req: IncomingMessage, res: ServerResponse) {
        logger.info("post");
        res.end("hello world");
    }

    async get(req: IncomingMessage, res: ServerResponse) {
        const files = await this.fileHelper.getFileStatus(this.downloadsFolder);

        res.writeHead(200);
        res.end(JSON.stringify(files));
    }

    async handler(req: IncomingMessage, res: ServerResponse) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        const method = req.method?.toLowerCase();
        const chosen = (method && this[method]) ?? this.defaultRoute;
        return chosen.apply(this, [req, res]);
    }
}
