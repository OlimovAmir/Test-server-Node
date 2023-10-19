const fs = require('fs');  // подключение модуля файловой системы
const path = require('path');

module.exports = function (app) {
    app.get('/', (req, res) => {
        function isFolder(path) {
            try {
                return fs.statSync(path).isDirectory();
            } catch (err) {
                return false;
            }
        }

        const base = './files/';
        let dirPath = '';

        if ('path' in req.query) {
            dirPath = path.join(base, req.query.path);
        }

        if (isFolder(base + dirPath)) {
            try {
                const items = fs.readdirSync(base + dirPath);
                const result = [];

                for (const item of items) {
                    const itemPath = path.join(dirPath, item);
                    const isDir = isFolder(itemPath);
                    const itemInfo = {
                        name: item,
                        isDirectory: isDir,
                    };

                    if (isDir) {
                        result.push(itemInfo);
                    } else {
                        const stats = fs.statSync(itemPath);
                        itemInfo.size = stats.size;
                        result.push(itemInfo);
                    }
                }

                if (result.length === 0) {
                    res.json({ error: 'Пустая папка' });
                } else {
                    res.json(result);
                }
            } catch (err) {
                res.json({ error: err.message });
            }
        } else {
            // Если указанный путь не является папкой, попробуйте вывести файлы в этой папке
            try {
                const items = fs.readdirSync(path.dirname(base + dirPath));
                const result = [];

                for (const item of items) {
                    const itemPath = path.join(path.dirname(dirPath), item);
                    const isDir = isFolder(itemPath);
                    const itemInfo = {
                        name: item,
                        isDirectory: isDir,
                    };

                    if (!isDir) {
                        const stats = fs.statSync(itemPath);
                        itemInfo.size = stats.size;
                        result.push(itemInfo);
                    }
                }

                if (result.length === 0) {
                    res.json({ error: 'Указанный путь не является папкой, и в этой директории нет файлов' });
                } else {
                    res.json(result);
                }
            } catch (err) {
                res.json({ error: err.message });
            }
        }
    });
};