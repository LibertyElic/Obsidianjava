const fs = require('fs');
const path = require('path');
const http = require('http');

const SOURCE_DIR = __dirname;

const server = http.createServer((req, res) => {
    const decodedUrl = decodeURIComponent(req.url);
    let requestedPath = path.join(SOURCE_DIR, decodedUrl);
    requestedPath = path.normalize(requestedPath);

    if (!requestedPath.startsWith(SOURCE_DIR)) {
        res.writeHead(403);
        res.end('Erisim Engellendi.');
        return;
    }

    if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
        const ext = path.extname(requestedPath).toLowerCase();
        const mimeTypes = {
            '.json': 'application/json',
            '.jar': 'application/java-archive',
            '.zip': 'application/zip',
            '.toml': 'application/toml',
            '.txt': 'text/plain'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(requestedPath);
        stream.pipe(res);
        console.log(`[HTTP] Gonderildi: ${decodedUrl}`);
    } else {
        res.writeHead(404);
        res.end('Dosya bulunamadi.');
    }
});

// Port 0: İşletim sistemi boş bir port seçer
server.listen(0, '0.0.0.0', () => {
    const port = server.address().port;
    console.log(`[DYNAMIC_PORT] ${port}`); // Modun bu satırı yakalayacak
});