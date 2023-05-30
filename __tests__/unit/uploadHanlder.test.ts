import http from "http";
import { describe, test, expect } from "@jest/globals";
import UploadHandler from "../../src/Upload/UploadHandler";
import TestUtil from "../_util/testUtil";
import fs from "fs";
import { Server } from "socket.io";

describe("#UploadHandler test suite", () => {
    beforeEach(() => {
        const onData = jest.fn();
        jest.spyOn(fs, "createWriteStream").mockImplementation(() => {
            return {
                write: onData(),
            } as fs.WriteStream;
        });
    });

    describe("#registerEvents", () => {
        test("should call onFile and onFinish functions on Busboy instance", () => {
            const ioObj = new Server();
            const uploadHanler = new UploadHandler(ioObj, "1", "");

            jest.spyOn(uploadHanler, "onFile");

            const headers: http.IncomingHttpHeaders = {
                "content-type": "multipart/form-data; boundary=a",
            };

            const onFinish = jest.fn();
            const busBoyInstance = uploadHanler.registerEvents(
                headers,
                onFinish
            );

            const fileStream = TestUtil.generateReadableStream([
                "chunk",
                "of",
                "data",
            ]);
            busBoyInstance.emit("file", "fieldname", fileStream, "big.file");
            busBoyInstance.listeners("finish")[0].call(busBoyInstance);

            expect(uploadHanler.onFile).toHaveBeenCalled();
            expect(onFinish).toHaveBeenCalled();

            busBoyInstance.removeAllListeners("file");
        });
    });

    describe("#onFile", () => {
        const ioObj = new Server();
        const defaultNewDate = new Date(2023, 3, 1, 15, 20, 10);

        beforeEach(() => {
            jest.spyOn(ioObj, "to").mockImplementation(() => {
                return {
                    emit: (event: string, message: any) => {},
                } as any;
            });
        });

        beforeAll(() => {
            jest.useFakeTimers();
            jest.setSystemTime(defaultNewDate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        test("given a stream file it should save it on disk", async () => {
            const chunks = ["hello", "world"];
            const downloadsFolder = "/tmp";
            const handler = new UploadHandler(ioObj, "1", downloadsFolder);

            const params = {
                fieldname: "video",
                file: TestUtil.generateReadableStream(chunks),
                fileName: "big.file",
            };

            await handler.onFile(
                params.fieldname,
                params.file,
                params.fileName
            );

            const expectedfileName = `${downloadsFolder}/${params.fileName}`;
            expect(fs.createWriteStream).toHaveBeenCalledWith(expectedfileName);
        });
    });
});
