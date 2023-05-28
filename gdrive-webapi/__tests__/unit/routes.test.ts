import { describe, test, expect } from "@jest/globals";
import { IncomingMessage, ServerResponse } from "http";
import Routes from "../../src/routes";

describe("#Routes test suite", () => {
    const defaultParams = {
        request: {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            method: "",
            body: {},
        } as Partial<IncomingMessage>,
        response: {
            setHeader: jest.fn(),
            writeHead: jest.fn(),
            end: jest.fn(),
        } as Partial<ServerResponse>,
        values: () =>
            Object.values(defaultParams) as [IncomingMessage, ServerResponse],
    };

    describe("#setSocketInstance", () => {
        test("setSocket should store io instance", () => {
            const routes = new Routes();
            const ioObj = {
                to: (id: string) => ioObj,
                emit: (event: string, message: any) => {},
                on: (event: string, callback: (socket: any) => void) => {},
            };

            routes.setSocketInstance(ioObj);
            expect(routes.io).toStrictEqual(ioObj);
        });
    });

    describe("#handler", () => {
        test("given an inexistent route it should choose default route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams,
            };

            params.request.method = "inexistent";
            await routes.handler(...params.values());
            expect(params.response.end).toHaveBeenCalledWith("hello world");
        });
        test("it should set any request with CORS enabled", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams,
            };
            await routes.handler(...params.values());
            expect(params.response.setHeader).toHaveBeenCalledWith(
                "Access-Control-Allow-Origin",
                "*"
            );
        });
        test("given method OPTIONS it shold choose options route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams,
            };

            params.request.method = "OPTIONS";
            await routes.handler(...params.values());
            expect(params.response.writeHead).toHaveBeenCalledWith(204);
            expect(params.response.end).toHaveBeenCalled();
        });
        test("given method POST it shold choose post route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams,
            };

            params.request.method = "POST";
            jest.spyOn(routes, "post").mockResolvedValueOnce();
            await routes.handler(...params.values());
            expect(routes.post).toHaveBeenCalled();
        });
        test("given method GET it shold choose get route", async () => {
            const routes = new Routes();
            const params = {
                ...defaultParams,
            };

            params.request.method = "GET";
            jest.spyOn(routes, "get").mockResolvedValueOnce();
            await routes.handler(...params.values());
            expect(routes.get).toHaveBeenCalled();
        });
    });

    describe("#get", () => {
        test("given method GET it should list all files downloaded", async () => {
            const route = new Routes();
            const params = {
                ...defaultParams,
            };

            const filesStatusesMock = [
                {
                    size: "182 kB",
                    lastModified: new Date("2021-09-06T23:15:46.000Z"),
                    owner: "caiofernandes",
                    file: "big.file",
                },
            ];

            jest.spyOn(route["fileHelper"], "getFileStatus").mockResolvedValue(
                filesStatusesMock
            );

            params.request.method = "GET";

            await route.handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(200);
            expect(params.response.end).toHaveBeenCalledWith(
                JSON.stringify(filesStatusesMock)
            );
        });
    });
});
