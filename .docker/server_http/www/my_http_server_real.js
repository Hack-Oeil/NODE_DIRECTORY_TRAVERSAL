const fs = require('fs');
const http = require('http');
const path = require('path');
require('dotenv').config({ path: './app/.env.myapp' })
const flag = require("./yoop_flag-d46dd5a4a7f.js");

// Ce fichier et le vrai lancé mais l'utilisateur ne le sait pas
const server = http.createServer((req, res) => {
    req.url = decodeURI(req.url);
    // si on va sur la page d'accueil
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
    // Sinon si le fichier existe dans le répetoire public
    else if (fs.existsSync(path.join(__dirname, `public/${req.url}`))) {
        let file = path.join(__dirname, `public/${req.url}`);
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
                    const username = process.env.HOOS_CTF_USERNAME || null;
                    const flagText = flag(process.env.FLAG, username);
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
});

server.listen(process.env.PORT, () => { console.log(`http://localhost:${process.env.PORT}`); });