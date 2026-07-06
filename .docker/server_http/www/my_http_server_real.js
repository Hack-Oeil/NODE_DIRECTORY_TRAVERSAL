const fs = require('fs');
const http = require('http');
const path = require('path');
require('dotenv').config({ path: './app/.env.myapp' })
const { flag, username } = require('./yoop_flag-d46dd5a4a7f.js');

// Ce fichier et le vrai lancé mais l'utilisateur ne le sait pas
const server = http.createServer((req, res) => {
    req.url = decodeURI(req.url);
    const lang = process.env.LANGUAGE || 'fr';
    
    // si on va sur la page d'accueil
    if (req.url === '/') {
        let indexFile = path.join(__dirname, 'i18n', `index_${lang}.html`);
        if (!fs.existsSync(indexFile)) {
            indexFile = path.join(__dirname, 'public', 'index.html');
        }
        fs.readFile(indexFile, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Sinon si le fichier existe dans le répetoire public (ou i18n)
    else {
        let fileUrl = req.url;
        let file = path.join(__dirname, 'public', fileUrl.replace(/^\//, ''));
        
        if (fileUrl.endsWith('.html')) {
            const baseName = fileUrl.slice(0, -5).replace(/^\//, ''); // remove .html and leading slash
            const langFileUrl = `${baseName}_${lang}.html`;
            const i18nFile = path.join(__dirname, 'i18n', langFileUrl);
            if (fs.existsSync(i18nFile)) {
                file = i18nFile;
            }
        }
        
        if (fs.existsSync(file)) {
        // On vérifie que c'est bien un fichier
        if(fs.lstatSync(file).isFile()) {              
            fs.readFile(file, (err, data) => {
                let mimeType = 'text/html';
            	switch(path.extname(file)) {
                	case '.js' :  mimeType = 'application/javascript; charset=utf8'; break;
                    case '.css' : mimeType = 'text/css; charset=utf8'; break;
                    case '.jpg' : mimeType = 'image/jpeg'; break;
                    case '.png' : mimeType = 'image/png'; break;
                }
               	res.writeHead(200, { 'Content-Type': mimeType });

                const html = data.toString(); // Convertit le Buffer en string
                if(html.indexOf(process.env.FLAG) !== -1) {
                    const flagText = flag(req)(process.env.FLAG, username(req));
                    res.end(html.replace(process.env.FLAG, flagText));
                } else {
                    res.end(data);
                }
            });
        }
        else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Not Found');
        }
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Not Found');
        }
    }
});

server.listen(process.env.PORT, () => { console.log(`http://localhost:${process.env.PORT}`); });