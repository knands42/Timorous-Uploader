import { describe, test, expect } from "@jest/globals";
import FileHelper from "../../src/fileHelper";
import fs from "fs/promises";
import { Dirent, Stats } from "fs";

describe("#Routes test suite", () => {
    describe("#getFileStatus", () => {
        test("it should return file status in correct format", async () => {
            const statMock: Partial<Stats> = {
                dev: 169056660,
                mode: 33206,
                nlink: 1,
                uid: 0,
                gid: 0,
                rdev: 0,
                blksize: 4096,
                ino: 2533274792082317,
                size: 181889,
                blocks: 360,
                atimeMs: 1685243926106.73,
                mtimeMs: 1685243926106.73,
                ctimeMs: 1685243960188.08,
                birthtimeMs: 1685243926040.5244,
                atime: new Date("2023-05-28T03:18:46.107Z"),
                mtime: new Date("2023-05-28T03:18:46.107Z"),
                ctime: new Date("2023-05-28T03:19:20.188Z"),
                birthtime: new Date("2023-05-28T03:18:46.041Z"),
            };

            const mockUser = "caiofernandes";
            process.env.USER = mockUser;
            const filename = "big.file";

            jest.spyOn(fs, "stat").mockResolvedValue(
                statMock as Promise<Stats>
            );
            jest.spyOn(fs, "readdir").mockResolvedValue([
                filename,
            ] as unknown as Dirent[]);

            const result = await FileHelper.getFileStatus("/tmp");

            const expectedResult = {
                size: "182 kB",
                lastModified: new Date("2023-05-28T03:18:46.041Z"),
                owner: "caiofernandes",
                file: filename,
            };

            expect(fs.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
            expect(result).toMatchObject([expectedResult]);
        });
    });
});
