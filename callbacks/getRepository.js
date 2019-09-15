const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

let pathToRepos = process.argv[2];

//Ручка GET /api/repos/:repositoryId(/tree/:commitHash/:path)
module.exports = function(request, response) {
    let pathToRepo = path.join(pathToRepos, request.params['repositoryId']);
    let commitHash = 'master';
    let params = ['ls-tree', commitHash];
    if (request.params['commitHash']) {//Проверка наличия в запросе ветки или хэша коммита
        commitHash = request.params['commitHash'];
        if (request.params['path']) {//Проверка наличия в запросе дальнейшего пути
            params[1] += ':' + request.params['path'];
        }
    }
    fs.access(pathToRepo, err => {//Проверка пути к репозиторию
        if(err) {
            response.status(404).send(pathToRepo + ' not found');
        }
        else {
            let out = '';
            const gitTree = spawn('git', params, {cwd: pathToRepo});
            gitTree.stdout.on('data', chunk => {
                out += chunk.toString();
            });
            gitTree.on('close', code => {
                if(!out) {//Проверка существования ветки или хэша коммита
                    response.status(404).send(commitHash + ' not found');
                }
                else {
                    let objects = out.split(/\n./);
                    let objectsJSON = objects.map(obj => ({
                        "name": obj.match(/(?<=\t).*/)[0],
                        "type": obj.match(/(?<=\s)\S*/)[0],
                        "SHA-1": obj.match(/[a-f0-9]{40}/)[0]
                    }));
                    response.json(objectsJSON);
                }
            });
        }
    });
};