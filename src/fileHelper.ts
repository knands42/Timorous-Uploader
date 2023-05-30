import fs from "fs/promises";
import prettyBytes from "pretty-bytes";

export type FileStatus = {
    size: string;
    lastModified: Date;
    owner: string;
    file: string;
};

export default class FileHelper {
    static async getFileStatus(
        downloadsFolder: string
    ): Promise<Array<FileStatus>> {
        const currentFile = await fs.readdir(downloadsFolder);
        const statuses = await Promise.all(
            currentFile.map((file) => fs.stat(`${downloadsFolder}/${file}`))
        );

        const fileStatuses: Array<FileStatus> = [];
        for (const fileIndex in currentFile) {
            const { birthtime, size } = statuses[fileIndex];
            fileStatuses.push({
                size: prettyBytes(size),
                file: currentFile[fileIndex],
                lastModified: birthtime,
                owner: process.env.USER ?? "unknown",
            });
        }

        return fileStatuses;
    }
}
