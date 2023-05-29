import http from "http";
import { describe, test, expect } from "@jest/globals";
import UploadHandler from "../../src/uploadHandler";
import TestUtil from "../_util/testUtil";

describe("#UploadHandler test suite", () => {
    const ioObj = {
        to: (id: string) => ioObj,
        emit: (event: string, message: any) => {},
    };

    describe("#registerEvents", () => {
        test("should call onFile and onFinish functions on Busboy instance", () => {
            const uploadHanler = new UploadHandler(ioObj, "1");

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
        });
    });

    describe("#onFile", () => {
        test('given a stream file it should save it on disk', async () => {
            const chunks = ["hello", "world"];

            const downloadsFolder = "/tmp";
        })
    })
});
