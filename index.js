const express = require('express');
const app = express();

//Коллбэки
const getRepos = require('./callbacks/getRepos.js');
const getCommits = require('./callbacks/getCommits.js');
const getDiff = require('./callbacks/getDiff.js');
const getRepository = require('./callbacks/getRepository.js');
const getFile = require('./callbacks/getFile.js');
const deleteRepository = require('./callbacks/deleteRepository.js');
const addRepository = require('./callbacks/addRepository.js');

//Запросы
app.get('/api/repos', getRepos);

app.get('/api/repos/:repositoryId/commits/:commitHash', getCommits);

app.get('/api/repos/:repositoryId/commits/:commitHash/diff', getDiff);

app.get('/api/repos/:repositoryId', getRepository);

app.get('/api/repos/:repositoryId/tree/:commitHash/:path([^/]*)?', getRepository);

app.get('/api/repos/:repositoryId/blob/:commitHash/:pathToFile([^/]*)?', getFile);

app.delete('/api/repos/:repositoryId', deleteRepository);

app.post('/api/repos(/:repositoryId)?', addRepository);

app.use(function(request, response,) {
    response.status(404).send('URL not found');
});

app.listen(3000);