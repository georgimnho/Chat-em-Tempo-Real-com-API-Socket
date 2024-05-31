### Relatório sobre a Arquitetura do Sistema de Chat ao Vivo e o Processo de Desenvolvimento

#### 1. Introdução

Este relatório documenta a arquitetura e o processo de desenvolvimento de uma aplicação de chat ao vivo utilizando Node.js, Express e Socket.IO. A aplicação permite a comunicação em tempo real entre múltiplos usuários em diferentes abas do navegador.

#### 2. Arquitetura do Sistema

A arquitetura do sistema é composta por duas partes principais: o servidor e o cliente.

##### 2.1. Servidor

O servidor é construído utilizando Node.js e Express, e gerencia a comunicação em tempo real através do Socket.IO. A estrutura do servidor é a seguinte:

- **Express**: Framework utilizado para criar e configurar o servidor HTTP.
- **HTTP**: Módulo utilizado para criar o servidor HTTP que será utilizado pelo Socket.IO.
- **Socket.IO**: Biblioteca que permite a comunicação em tempo real entre o servidor e os clientes.

**Arquivo: `server.ts`**

```typescript
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
                this.io.emit('message', message); // Emitindo 'message' para todos os clientes
            });
        });
    }

    setupRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html')); // Usando path.join para compatibilidade
        });
    }
}

const app = new App();
app.listenServer();
```

##### 2.2. Cliente

O cliente é uma aplicação web que utiliza HTML e JavaScript, com a biblioteca Socket.IO para se comunicar com o servidor.

**Código do Cliente:**

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
          margin: 0;
          padding-bottom: 3rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Helvetica, Arial, sans-serif;
        }
  
        #form {
          background: rgba(0, 0, 0, 0.15);
          padding: 0.25rem;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          height: 3rem;
          box-sizing: border-box;
          backdrop-filter: blur(10px);
        }
        #input {
          border: none;
          padding: 0 1rem;
          flex-grow: 1;
          border-radius: 2rem;
          margin: 0.25rem;
        }
        #input:focus {
          outline: none;
        }
        #form > button {
          background: #333;
          border: none;
          padding: 0 1rem;
          margin: 0.25rem;
          border-radius: 3px;
          outline: none;
          color: #fff;
        }
  
        #messages {
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        #messages > li {
          padding: 0.5rem 1rem;
        }
        #messages > li:nth-child(odd) {
          background: #efefef;
        }
      </style>
    </head>
    <body>
      <ul id="messages"></ul>
      <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
      </form>

      <script type="module">
        import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';
      
        const socket = io();
        const messageList = document.getElementById('messages');
        const messageInput = document.getElementById('input');
        const messageForm = document.getElementById('form');
      
        messageForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const messageContent = messageInput.value.trim();
          if (messageContent) {
            socket.emit('message', { message: messageContent });
            messageInput.value = '';
          }
        });
      
        socket.on('message', (data) => {
          const messageItem = document.createElement('li');
          messageItem.textContent = data.message;
          messageList.appendChild(messageItem);
        });
      </script>
      
</body>
</html>
```

#### 3. Processo de Desenvolvimento

O desenvolvimento desta aplicação de chat ao vivo seguiu as etapas descritas abaixo:

##### 3.1. Configuração do Ambiente de Desenvolvimento

- **Node.js e npm**: Instalados para gerenciar pacotes e executar o servidor.
- **TypeScript**: Utilizado para adicionar tipagem estática ao código JavaScript.

##### 3.2. Implementação do Servidor

1. **Criação da Classe `App`**:
   - Configuração do servidor Express.
   - Criação do servidor HTTP.
   - Configuração do Socket.IO para comunicação em tempo real.
   - Definição das rotas e escuta de eventos Socket.IO.

2. **Implementação da Comunicação em Tempo Real**:
   - Escuta de conexões de clientes.
   - Tratamento do evento `message` enviado pelos clientes.
   - Emissão do evento `message` para todos os clientes conectados.

##### 3.3. Implementação do Cliente

1. **Configuração do Socket.IO no Cliente**:
   - Importação do módulo Socket.IO.
   - Conexão ao servidor.

2. **Tratamento de Envio de Mensagens**:
   - Captura do evento de envio do formulário.
   - Emissão do evento `message` para o servidor com o conteúdo da mensagem.

3. **Recebimento e Exibição de Mensagens**:
   - Adição de um ouvinte para o evento `message` emitido pelo servidor.
   - Criação e exibição de itens de lista para cada mensagem recebida.

#### 4. Conclusão

A aplicação de chat ao vivo desenvolvida permite comunicação em tempo real entre usuários, utilizando uma arquitetura baseada em Node.js, Express e Socket.IO. O processo de desenvolvimento seguiu uma abordagem modular, separando claramente a lógica do servidor e do cliente, facilitando a manutenção e a escalabilidade futura do sistema. A aplicação é um exemplo simples e eficaz de como implementar comunicação em tempo real na web.
