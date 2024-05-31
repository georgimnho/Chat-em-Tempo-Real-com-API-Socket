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

**Código do Cliente (inserido no arquivo HTML):**

```html
<script type="module">
  // Importa o módulo socket.io do CDN
  import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

  // Conecta ao servidor Socket.IO
  const socket = io();

  // Seleciona os elementos HTML necessários
  const messageList = document.getElementById('messages'); // Lista de mensagens
  const messageInput = document.getElementById('input'); // Campo de entrada de mensagem
  const messageForm = document.getElementById('form'); // Formulário de envio de mensagem

  // Adiciona um evento de envio ao formulário
  messageForm.addEventListener('submit', (event) => { // Adiciona um evento de envio ao formulário
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário

    // Obtém o conteúdo da mensagem e remove espaços em branco das extremidades
    const messageContent = messageInput.value.trim();

    // Verifica se a mensagem não está vazia
    if (messageContent) {
      // Emite o evento 'message' para o servidor com o conteúdo da mensagem
      socket.emit('message', { message: messageContent });

      // Limpa o campo de entrada de mensagem
      messageInput.value = '';
    }
  });

  // Adiciona um ouvinte para o evento 'message' recebido do servidor
  socket.on('message', (data) => {
    // Cria um novo item de lista para a mensagem recebida
    const messageItem = document.createElement('li');
    // Define o texto do item de lista como o conteúdo da mensagem
    messageItem.textContent = data.message;
    // Adiciona o item de lista à lista de mensagens
    messageList.appendChild(messageItem);
  });
</script>
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
