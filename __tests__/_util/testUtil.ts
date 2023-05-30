import { Readable, Transform, Writable } from "stream";

export default class TestUtil {
    static generateReadableStream(data: any): Readable {
        return new Readable({
            objectMode: true,
            async read() {
                for (const item of data) {
                    this.push(item);
                }

                this.push(null);
            },
        });
    }
}
