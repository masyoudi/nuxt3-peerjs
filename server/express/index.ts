import express from 'express';
import { ExpressPeerServer } from 'peer';
import { randomUUID } from 'node:crypto';
import { SSEManager } from '../utils/sse';

const app = express();
const server = app.listen(3001);

const peerServer = ExpressPeerServer(server, {
  path: '/',
  allow_discovery: true
});
const sseManager = new SSEManager();
let peerClients: string[] = [];

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/peer', peerServer);

app.get('/subscribe', (req, res) => {
  const client = { id: randomUUID(), res };
  sseManager.addClient(client);

  sseManager.broadcast(client, 'connect', { message: 'Connection Established' });
  sseManager.broadcast(client, 'peer:current', { clients: peerClients });

  req.on('close', () => sseManager.removeClient(client.id));
});

peerServer.on('connection', (client) => {
  const id = client.getId();

  if (peerClients.find((v) => v === id) || !id.startsWith('PARTICIPANT')) {
    return;
  }

  peerClients.push(id);

  sseManager.broadcasts('peer:connection', { client: id });
});

peerServer.on('disconnect', (client) => {
  const id = client.getId();
  peerClients = peerClients.filter((c) => c !== id);
  sseManager.broadcasts('peer:disconnect', { client: id });
});

export default fromNodeMiddleware(app);
