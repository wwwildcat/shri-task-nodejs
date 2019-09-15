const fs = require('fs');
const path = require('path');

let pathToRepos = process.argv[2];

//Вспомогательная функция для удаления непустой директории
let deleteDir = function(pathToDir) {
    fs.readdirSync(pathToDir).forEach(item => {
        let pathToItem = path.resolve(pathToDir, item);
        if (fs.statSync(pathToItem).isFile()) {
            fs.unlinkSync(pathToItem);
        }
        else {
            deleteDir(pathToItem);
        }
    });
    fs.rmdirSync(pathToDir);
};
//Ручка DELETE /api/repos/:repositoryId
module.exports = function(request, response) {
    let pathToRepo = path.join(pathToRepos, request.params['repositoryId']);
    fs.access(pathToRepo, err => {//Проверка пути к репозиторию
        if(err) {
            response.status(404).send(pathToRepo + ' not found');
        }
        else {
            deleteDir(pathToRepo);
            response.send(request.params['repositoryId'] + ' has been deleted succesfully');
        }
    });
};