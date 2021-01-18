const express = require('express');
const cors = require('cors');

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  try {
    return response.json(repositories);
  } catch (err) {
    return response.status(500).send();
  }
});

app.post('/repositories', (request, response) => {
  try {
    const { title, url, techs } = request.body;

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    };
    repositories.push(repository);

    return response.status(201).json(repository);
  } catch (err) {
    return response.status(500).send();
  }
});

app.put('/repositories/:id', (request, response) => {
  try {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryFindIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryFindIndex < 0) {
      return response.status(400).json({
        error: 'O repositório que você está tentando buscar, não existe'
      });
    }

    const repositoryUpdated = {
      id,
      title,
      url,
      techs,
      likes: repositories[repositoryFindIndex].likes
    };

    repositories[repositoryFindIndex] = repositoryUpdated;

    return response.json(repositoryUpdated);
  } catch (err) {
    return response.status(500).send();
  }
});

app.delete('/repositories/:id', (request, response) => {
  try {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex >= 0) {
      repositories.splice(repositoryIndex, 1);
    } else {
      return response.status(400).json({
        error: 'O repositório que você está tentando deletar, não existe'
      });
    }

    return response.status(204).send();
  } catch (err) {
    return response.status(500).send();
  }
});

app.post('/repositories/:id/like', (request, response) => {
  try {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    if (repositoryIndex === -1) {
      return response
        .status(400)
        .json({ error: 'Repositorio não encontrado.' });
    }

    repositories[repositoryIndex].likes++;
    return response.json(repositories[repositoryIndex]);
  } catch (err) {
    return response.status(500).send();
  }
});

module.exports = app;
