# Timorous-Uploader

This project is a simple file uploader built with Node.js, utilizing Node.js Streams and socket.io to track the progress of file uploads.

The main goal of this project was to explore the capabilities of Node.js Streams and incorporate real-time progress tracking using socket.io.

## Inspiration

This project was inspired by the "Google Drive Clone - JS Expert Week 5.0" course taught by [Erick Wendel](https://cursos.erickwendel.com.br/). While developing this file uploader, I aimed to apply the concepts learned during the course and test my understanding of Node.js Streams and socket.io.

## Usage

In order to execute the application, first generate certificates (make sure to have the mkcert tool installed on your machine first):

```bash
npm run cert:install
npm run cert:generate
```

Then, start the application:

```bash
npm run start:dev
```

The application will be available at <https://localhost:3000>, but I didn't explicitly set create a command to send a multipart/form-data request to the server. I recommend using [Postman](https://www.postman.com/) to send the request.

You can also execute tests with the following command:

```bash
npm run test
# or
npm run test:watch
# or
npm run test:coverage
```
