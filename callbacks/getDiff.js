const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

let pathToRepos = process.argv[2];

//Ручка GET /api/repos/:repositoryId/commits/:commitHash/diff
module.exports = function(request, response) {
    let pathToRepo = path.join(pathToRepos, request.params['repositoryId']);
    fs.access(pathToRepo, err => {//Проверка пути к репозиторию
        if(err) {
            response.status(404).send(pathToRepo + ' not found');
        }
        else {
            let out = '';
            const gitDiff = spawn('git', ['diff', request.params['commitHash'] + '~', request.params['commitHash']], {cwd: pathToRepo});
            gitDiff.stdout.on('data', chunk => {
                out += chunk.toString();
            });
            gitDiff.on('close', code => {
                if(!out) {//Проверка существования ветки или хэша коммита
                    response.status(404).send(request.params['commitHash'] + ' not found');
                }
                else {
                    let modifiedFiles = out.split(/\s(?=diff --git)/);
                    let diffJSON = modifiedFiles.map(file => {
                        let changeHunks = file.match(/@@.*/s)[0].split(/\s(?=@@.*@@)/);
                        let changeHunksJSON = changeHunks.map(hunk => ({
                            "range": hunk.match(/(?<=@@)[^@]*/)[0].trim(),
                            "lines": hunk.match(/(?<=@@.*@@).*/s)[0]
                        }));
                        return {
                            "pathToFile": file.match(/(?<=\+\+\+ b\/).*/)[0],
                            "changeHunks": changeHunksJSON
                        }
                    });
                    response.json(diffJSON);
                }
            });
        }
    });
};