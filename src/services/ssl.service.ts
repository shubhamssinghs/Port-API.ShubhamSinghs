import path from 'path';
import * as fs from 'fs';
import config from 'config';
import { spawnSync, execSync } from 'child_process';

export const generateSSLCertificates = () => {
  const environment = config.get<string>('environment');
  const host = config.get<string>('server.host');

  const certDir = path.join(__dirname, '..', '..', 'cert');
  const keyPath = path.join(certDir, 'private.key');
  const certPath = path.join(certDir, 'certificate.crt');

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.log(
      'No certificate directory found. Trying to create new certificates.'
    );

    if (fs.existsSync(certDir)) {
      fs.rmSync(certDir, { recursive: true });
    }
    fs.mkdirSync(certDir, { recursive: true });

    console.log(`Generating SSL keys and certificate for ${environment}.\n`);

    try {
      // Generate private key
      spawnSync('openssl', ['genrsa', '-out', keyPath, '2048'], {
        stdio: 'inherit',
        shell: true
      });

      // Generate certificate signing request (CSR)
      spawnSync(
        'openssl',
        [
          'req',
          '-new',
          '-key',
          keyPath,
          '-out',
          path.join(certDir, 'csr.pem'),
          '-subj',
          `/CN=${host}`
        ],
        { stdio: 'inherit', shell: true }
      );

      // Generate self-signed certificate
      execSync(
        `openssl x509 -req -days 365 -in ${path.join(certDir, 'csr.pem')} -signkey ${keyPath} -out ${certPath}`,
        { stdio: 'inherit' }
      );

      // Delete CSR file
      fs.unlinkSync(path.join(certDir, 'csr.pem'));

      console.log('SSL keys and certificate generated successfully.\n');
    } catch (error) {
      console.error('Error generating SSL certificates:', error);
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
