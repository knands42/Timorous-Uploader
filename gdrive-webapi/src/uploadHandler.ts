import Busboy from "busboy";
import http from "http";

export default class UploadHandler {
    constructor(
        private io,
        private socketId: string,
        private downloadsFolder: string
    ) {}

    onFile(fieldName: string, file: string, fileName: string): void {}

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
