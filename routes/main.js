const fs = require('fs');  // подключение модуля файловой системы
const path = require('path');

module.exports = function (app) {
    app.get('/', (req, res) => {

        const base = './files/';
        let dirPath = '';
        function isFolder(base) { // проверка является ли папкой или файл
            try {
                return fs.statSync(base).isDirectory();
            } catch (err) {
                return false;
            }
        }

        if ('path' in req.query) {

            dirPath = req.query.path;  //localhosl:8000?path=item1
        }
        function checkDirectoryContents(base, dirPath) {
            try {
                const fullPath = path.join(base, dirPath);
                const stats = fs.statSync(fullPath);

                if (stats.isDirectory()) {
                    console.log("Это папка");
                    const contents = fs.readdirSync(fullPath); // Получаем список файлов и подкаталогов
                    console.log("Содержимое папки:");

                    const contentsInfo = contents.map(item => {
                        const itemPath = path.join(fullPath, item);
                        const itemStats = fs.statSync(itemPath);
                        return {
                            name: item,
                            isDirectory: itemStats.isDirectory(),
                            size: itemStats.isFile() ? itemStats.size : 'this is folder',
                        };
                    });
                    console.log(contentsInfo);
                    // Теперь можно отправить содержимое папки в ответ на запрос
                    res.json(contentsInfo);
                } else {
                    throw new Error("Указанный путь не является папкой");
                }
            } catch (err) {
                console.error(err.message);
                res.json({ error: err.message });
            }
        }

        // Пример использования функции
        checkDirectoryContents(base, dirPath); // Замените на свои значения
    });
}