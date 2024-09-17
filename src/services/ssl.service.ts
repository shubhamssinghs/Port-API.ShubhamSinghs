import path from 'path';
import * as fs from 'fs';
import config from 'config';
import { spawnSync } from 'child_process';

export const generateSSLCertificates = () => {
  const environment = config.get<string>('environment');
  const host = config.get<string>('server.host');

  const keyPath = path.join(__dirname, '..', '..', 'cert', 'private.key');
  const certPath = path.join(__dirname, '..', '..', 'cert', 'certificate.crt');

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.log(
      'No certificate directory found. Trying to create new certificates.'
    );

    const originalDir = process.cwd();

    try {
      console.log(`Generating SSL keys and certificate for ${environment}.\n`);

      const certDir = path.join(__dirname, '..', '..', 'cert');
      if (fs.existsSync(certDir)) {
        fs.rmdirSync(certDir, { recursive: true });
      }
      fs.mkdirSync(certDir);

      // Change directory to 'cert'
      process.chdir(certDir);

      spawnSync('openssl genrsa -out private.key 2048', { shell: false });

      // Generate certificate signing request (CSR)
      spawnSync(
        `openssl req -new -key private.key -out csr.pem -subj "/CN=${host}"`,
        { shell: false }
      );

      // Generate self-signed certificate
      spawnSync(
        'openssl x509 -req -days 365 -in csr.pem -signkey private.key -out certificate.crt',
        { shell: false }
      );

      // Delete CSR file
      fs.unlinkSync('csr.pem');

      console.log('SSL keys and certificate generated successfully.\n');

      // Change back to original directory
      process.chdir(originalDir);
    } catch (error) {
      console.error('Error generating SSL certificates:', error);

      // Change back to original directory if there's an error
      process.chdir(originalDir);

      return {
        key: undefined,
        cert: undefined
      };
    }
  }

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
};
