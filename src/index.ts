import * as fs from 'fs';
import * as Websocket from 'ws';

if (!fs.existsSync('./lib/endpoints/'))
    fs.mkdirSync('./lib/endpoints/');

fs.readdirSync('./lib/endpoints/').forEach(async (val: string) => {
    console.log('./endpoints/' + val);
    const handler = await import('./endpoints/' + val);
    console.log('New handler found: %s', handler.handlerName);
});

const wss = new Websocket.Server({port: 8080}, () => console.log('Server running'));

wss.on('connection', ws => {
    // TODO implement security token

    // TODO implement handlers
});
