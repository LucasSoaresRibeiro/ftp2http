const express = require('express')
const fs = require('fs');
const jsftp = require("jsftp");
const app = express();

// Configurações básicas do express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const baseRoute = process.env.app_path ? process.env.app_path : "";
const useBasicFTP = false;
 
app.use(baseRoute + '/', async function (req, res) {

    const file = req.query.file;
    const isDownload = req.query.download === 'true';

    /*
    if (useBasicFTP) {
        const client = new ftp.Client()
        client.ftp.verbose = true
        try {
            await client.access({
                host: req.query.host,
                port: req.query.port,
                user: req.query.user,
                password: req.query.password
            })
            // console.log(await client.list())
            await client.downloadTo(file, file);
    
            if (isDownload) {
                res.download(`./${file}`)
            } else {
                res.sendFile(`${__dirname}\\${file}`);
            }
        }
        catch(err) {
            console.log(err)
        }
        client.close()
        
    } else {

        const ftpConfig = {
            host: req.query.host,
            port: req.query.port,
            user: req.query.user,
            password: req.query.password
        };

        const oustFileName = Date.now().toString();

        var c = new Client();
        c.on('ready', function() {
        c.get(file, function(err, stream) {
            if (err) throw err;
            stream.once('close', function() {
                c.end();
                if (isDownload) {
                    res.download(`./${oustFileName}`)
                } else {
                    res.sendFile(`${__dirname}\\${oustFileName}`);
                }

                // delete file
                setTimeout(() => {
                    fs.unlink(`${__dirname}\\${oustFileName}`, (err) => {
                        if (err) {
                            throw err;
                        }
                    });
                }, 3000);

            });
            stream.pipe(fs.createWriteStream(oustFileName));
        });
        });
        
        c.connect(ftpConfig);
    }
    */

    const ftpConfig = {
        host: req.query.host,
        port: req.query.port,
        user: req.query.user,
        pass: req.query.password
    };

    const ftp = new jsftp(ftpConfig);

    const oustFileName = Date.now().toString();

    ftp.get(file, (err, socket) => {

        if (err) {
            res.status(500).send(err);
            return;
        }
        
        socket.on("data", d => {
            fs.appendFileSync(oustFileName, d);
        });
        
        socket.on("close", err => {

            if (err) {

                console.error("There was an error retrieving the file.");
                res.status(500).send(err);

            } else {

                if (isDownload) {
                    res.download(`./${oustFileName}`)
                } else {
                    res.sendFile(`${__dirname}\\${oustFileName}`);
                }
            }

            // delete file
            setTimeout(() => {
                fs.unlink(`${__dirname}\\${oustFileName}`, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }, 3000);

        });
        
        socket.resume();
    });

})

if (baseRoute == "") {
    app.listen(3000)
} else {
    module.exports = app;
}