const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const respository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(respository)

  return response.json(respository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { url, title, techs, likes} = request.body

  if(!isUuid(id))
    return response.status(400).send()

  const repositoryIndex = repositories.findIndex( item => item.id === id)

  if(repositoryIndex < 0)
    return response.status(400).send()

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository;
  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( item => item.id === id)

  if(repositoryIndex < 0)
  return response.status(400).send()

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  if(!isUuid(id))
    return response.status(400).send()

  const repositoryIndex = repositories.findIndex( item => item.id === id)

  if(repositoryIndex < 0)
    return response.status(400).send()

  const repository = repositories[repositoryIndex]

  repository.likes = repository.likes+1

  repositories[repositoryIndex] = repository;
  return response.json(repository)
});

module.exports = app;
