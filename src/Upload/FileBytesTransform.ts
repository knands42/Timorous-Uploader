import { Server } from "socket.io";
import { Transform, TransformCallback } from "stream";
import { logger } from "../logger";

export default class FileBytesTransform extends Transform {
    private lastMessageSentDate: Date = new Date();
    private processedAlready = 0;
    private ON_UPLOAD_EVENT = "file-upload";

    constructor(
        private io: Server,
        private socketId: string,
        private fileName: string,
        private messageTimeDelay = 200
    ) {
        super({ objectMode: true });
    }

    private canExecute(lastExecution: Date) {
        return new Date().getTime() - lastExecution.getTime() >= this.messageTimeDelay;
    }

    async _transform(
        chunk: any,
        _encoding: BufferEncoding,
        callback: TransformCallback
    ): Promise<void> {
        try {
            this.processedAlready += chunk.length;

            if (!this.canExecute(this.lastMessageSentDate)) {
                return callback(null, chunk);
            }

            this.lastMessageSentDate = new Date();

            this.io.to(this.socketId).emit(this.ON_UPLOAD_EVENT, {
                processedAlready: this.processedAlready,
                fileName: this.fileName,
            });
            this.push(chunk);
            callback(null, chunk);
        } catch (error: any) {
            logger.error(`Error during the file upload!`, error);
            callback(error);
        }
    }
}
