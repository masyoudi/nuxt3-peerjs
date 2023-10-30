import type { Response } from 'express';

interface Client {
  id: string;
  res: Response;
}

const headers: Record<string, string> = {
  'Content-Type': 'text/event-stream',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
  'X-Accel-Buffering': 'no'
};

export class SSEManager {
  private clients: Client[];

  constructor() {
    this.clients = [];
  }

  addClient({ id, res }: Client) {
    for (let key in headers) {
      res.setHeader(key, headers[key]);
    }
    res.flushHeaders();

    this.clients.push({ id, res });
  }

  removeClient(id: string) {
    const client = this.clients.find((c) => c.id === c.id);
    if (!client) {
      return;
    }

    client.res.end();

    this.clients = this.clients.filter((c) => c.id !== id);
  }

  broadcast(client: Client, eventName: string, data: Record<string, any>) {
    client.res.write(`id: ${client.id}\nevent: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  broadcasts(eventName: string, data: Record<string, any>) {
    this.clients.forEach((client) => this.broadcast(client, eventName, data));
  }
}
