import express, { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

class App {
    private app: Application;
    private http: http.Server;
    private io: Server;

    constructor() {
        this.app = express();
        this.http = http.createServer(this.app);
        this.io = new Server(this.http);
        this.listenSocket();
        this.setupRoutes();
    }

    listenServer() {
        this.http.listen(3000, () => console.log('servidor rodando vasco'));
    }

    listenSocket() {
        this.io.on('connection', (socket) => {
            console.log('user connected =>', socket.id);

            socket.on('message', (message) => {
                console.log("~ file: Server.ts:24 ~ App ~ socket.on ~ msg:", message);
                this.io.emit('message', message); 
            });
        });
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    }
}

const app = new App();
app.listenServer();
