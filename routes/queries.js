const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

function getAllProjects(request, response) {
  database('projects').select()
    .then(projects => {
      response.status(200).json({
        status: 'success',
        data: projects,
        message: 'Here are all the projects!'
      });
    })
    .catch(error => {
      response.status(500).json({ error });
    })
};

function getColor(request, response) {
  database('colors').where('id', request.params.color_id).select()
    .then(color => {
      if (color.length) {
        response.status(200).json({
          status: 'success',
          data: color,
          message: 'Here is your color!'
        })
      } else {
        response.status(404).json({
          status: 'failed',
          error,
          message: `This color doesn't exist!`
        })
      }
    })
    .catch(error => {
      response.status(500).json({ error })
    })
};

function getProjectPalettes(request, response) {
  database('projects').where('id', request.params.project_id).select()
    .then(project => {
      if (project.length) {
        database('palettes').where('proj_id', request.params.project_id).select()
          .then(palettes => {
            response.status(200).json({
              status: 'success',
              data: palettes,
              message: 'Here are all the palettes!'
            })
          })
          .catch(() => {
            response.status(404).json({
              error: `Ain't no palettes here.`
            })
          })
      }
    })
    .catch(error => {
      response.status(404).json({
        status: 'failed',
        error,
        message: `This project doesn't exist!`
      })
    })
};

function addProject(request, response) {
  const project = request.body;

  for (let requiredParemeter of ['name']) {
    if(!project[requiredParemeter]) {
      return response.status(422).send({ 
        error: `Expected format: { name: <String> }. You're missing a "${requiredParemeter}" property.`
      })
    }
  }

  database('projects').where('name', project.name).select()
    .then(existingProject => {
      if(!existingProject.length) {
        database('projects').insert(project, 'id')
          .then(project => {
            response.status(201).json({ id: project[0] })
          })
          .catch(error => response.status(500).json({ error }))
      } else {
        response.status(400).send({ error: `Project already exists.` });
      }
    })
    .catch(error => response.status(500).json({ error }));
};

function addColor(request, response) {
  const color = request.body;
  for (let requiredParemeter of ['hex', 'shape']) {
    if (!color[requiredParemeter]) {
      return response.status(422).send({ 
        error: `Expected format: { hex: <String>, shape: <String> }. You're missing a "${requiredParemeter}" property.`
      })
    }
  }

  database('colors').insert(color, 'id')
    .then(color => {
      response.status(201).json({ id: color[0] })
    })
    .catch(error => response.status(500).json({ error }))
}

function addPalette(request, response) {
  const palette = request.body;

  for (let requiredParemeter of [
    'color1', 
    'color2', 
    'color3', 
    'color4', 
    'color5', 
    'name'
  ]) {
    if (!palette[requiredParemeter]) {
      return response.status(422).send({ 
        error: `You're missing a "${requiredParemeter}" property.`,
        palette
      })
    }
  }

  database('projects').where('id', request.params.project_id).select()
    .then(projects => {
      if (projects.length) {
        database('palettes').insert({...palette, proj_id: request.params.project_id}, 'id')
          .then(palette => response.status(201).json({ id: palette[0] }))
          .catch(error => response.status(500).json({ error }))
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.project_id}`
        })
      }
    })
    .catch(error => {
      response.status(500).json('adding palette didnt work');
    })
};

function deletePalette(request, response) {
  database('palettes').where('id', request.params.palette_id).del()
    .then(() => response.status(200).json({message:'removed palette'}))
    .catch(error => response.status(500).json({ error }));
};

function deleteProject(request, response) {
  database('projects').where('id', request.params.project_id).del()
  .then(project => {
    database('palettes').where('proj_id', project.id).del()
      .then(() => response.status(200).json({message:`deleted all palettes`}))
      .catch(error => response.status(500).json({ error }))
  })
  .catch(error => response.status(404).json({ error, message: `Couldn't find this project!` }));
};

module.exports = {
  addColor,
  addProject,
  addPalette,
  getColor,
  getAllProjects,
  getProjectPalettes,
  deletePalette,
  deleteProject
};