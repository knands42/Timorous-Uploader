import Busboy from "busboy";
import http from "http";
import { pipeline } from "stream/promises";
import fs from "fs";
import { logger } from "../logger";
import { Readable } from "stream";
import FileBytesTransform from "./FileBytesTransform";
import { Server } from "socket.io";

export default class UploadHandler {
    private lastMessageSentDate: Date = new Date();

    constructor(
        private io: Server,
        private socketId: string,
        private downloadsFolder: string,
        private messageTimeDelay = 200
    ) {}

    async onFile(
        _fieldName: string,
        file: Readable,
        fileName: string
    ): Promise<void> {
        const saveTo = `${this.downloadsFolder}/${fileName}`;
        const fileBytesTransform = new FileBytesTransform(
            this.io,
            this.socketId,
            fileName
        );
        await pipeline(file, fileBytesTransform, fs.createWriteStream(saveTo));

        logger.info(`File [${fileName}] finished`);
    }

    registerEvents(
        headers: http.IncomingHttpHeaders,
        onFinish: () => void
    ): Busboy.Busboy {
        const busboy = Busboy({ headers });
        busboy.on("file", this.onFile.bind(this));
        busboy.on("finish", onFinish);

        return busboy;
    }
}
