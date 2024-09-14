import https from 'https';
import config from 'config';

import { ssl } from './services';

import app from './app';

const { key, cert } = ssl.generateSSLCertificates();

const environment = config.get<string>('environment');
const isDev = environment === 'development';

const port = config.get<number>('server.port');
const host = config.get<number>('server.host');

const httpsServer = https.createServer({ key, cert }, app);

const logo = `
\u001b[34m🅰 \u001b[32m🆄 \u001b[31m🆃 \u001b[33m🅷\u001b[0m - \u001b[34m🅼\u001b[0m \u001b[32m💻 By Shubham Singh 💻\u001b[0m

 █████╗ ██╗   ██╗████████╗██╗  ██╗        ███╗   ███╗
██╔══██╗██║   ██║╚══██╔══╝██║  ██║        ████╗ ████║
███████║██║   ██║   ██║   ███████║  ████  ██╔████╔██║
██╔══██║██║   ██║   ██║   ██╔══██║        ██║╚██╔╝██║
██║  ██║╚██████╔╝   ██║   ██║  ██║        ██║ ╚═╝ ██║
╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝        ╚═╝     ╚═╝       
`;

httpsServer.listen(port, host, () => {
  console.log(logo);
  console.log(
    `🟢 HTTPS server is running on \u001b[34mhttps://${host}:${port}/api\u001b[0m ✅`
  );
  if (isDev) {
    console.log(
      `📘 Swagger docs are available on \u001b[32mhttps://${host}:${port}/api/api-docs\u001b[0m ✅`
    );
  }
});
