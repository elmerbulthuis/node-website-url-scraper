const Koa = require('koa');
const http = require('http');
const Worker = require('../worker');
const Logger = require('../utils/logger');

Logger.mute = true;
main();

async function main() {
  for (let count = 100; count <= 1000; count += 100) {
    const time = await workerTime(count);
    console.log([count, time].join(';'));
  }
}

async function workerTime(linkCount) {
  const koa = new Koa();
  koa.use(async (ctx) => {
    const linkList = new Array(linkCount)
      .fill(0)
      .map(
        (item, index) => `<a href="/${index}">${index}</a>`
      );
    const html = `<!DOCTYPE html>
  <html>
  <head>${ctx.path}</head>
  <body>
  ${linkList.join('\n')}
  </body>
  </html>
  `;

    ctx.body = html;
  });
  const server = http.createServer(koa.callback());
  const socketPool = new Set();
  server.on('connection', (socket) => {
    socketPool.add(socket);
    socket.on('close', () => socketPool.delete(socket));
  });

  try {
    await new Promise(resolve => server.listen(resolve));

    const address = server.address();
    const worker = new Worker(`http://localhost:${address.port}`);
    const begin = new Date().valueOf();
    await worker.startCrawling();
    const end = new Date().valueOf();
    return end - begin;
  } finally {
    socketPool.forEach(socket => socket.destroy());
    await new Promise(resolve => server.close(resolve));
  }
}
