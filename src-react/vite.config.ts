import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import type {IncomingMessage, ServerResponse} from "node:http";
import * as url from "node:url";
import * as fs from "node:fs";
import path from "node:path";
import mime from "mime-types";
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    svgr({
      include: "**/*.svg?react",
    }),
    viteTsconfigPaths(),
    {
      name: 'local-file-middleware',
      configureServer(server) {
        server.middlewares.use('/http_get', (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== 'GET') {
            res.statusCode = 405;
            res.end('Method Not Allowed');
            return;
          }
          const parsed = url.parse(req.url!, true);
          const filePath = parsed.query.path as string;

          if (!filePath || !fs.existsSync(filePath)) {
            res.writeHead(404);
            res.end('File not found');
            return;
          }

          const stat = fs.statSync(filePath);
          const range = req.headers.range;
          const mimeType = mime.lookup(filePath)
          let contentType = 'application/octet-stream';
          if (mimeType) {
            contentType = mimeType;
          }
          if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunkSize = end - start + 1;

            const stream = fs.createReadStream(filePath, { start, end });
            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize,
              'Content-Disposition': `inline; filename=${encodeURIComponent(path.basename(filePath))}`,
              'Content-Type': contentType,
            });
            stream.pipe(res);
          } else {
            const stream = fs.createReadStream(filePath);
            res.writeHead(200, {
              'Content-Length': stat.size,
              'Content-Disposition': `inline; filename=${encodeURIComponent(path.basename(filePath))}`,
              'Content-Type': contentType,
            });
            stream.pipe(res);
          }
        });

        server.middlewares.use('/local/file/write', (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end('Method Not Allowed');
            return;
          }
          const parsed = url.parse(req.url!, true);
          const filePath = parsed.query.path as string;

          const dir = path.dirname(filePath);
          fs.mkdirSync(dir, { recursive: true });

          let body = '';
          req.on('data', chunk => (body += chunk));
          req.on('end', () => {
            try {
              fs.writeFileSync(filePath, body, 'utf8');
              res.statusCode = 200;
              res.end('File saved successfully');
            } catch (e: any) {
              res.statusCode = 500;
              res.end('Failed to save file: ' + e.message);
            }
          });

        });

      },
    },
  ],
  base: './',
})

