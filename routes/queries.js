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
  var palette = parseInt(request.params.palette_id);
  var projId = parseInt(request.params.project_id);
  var user = projects.find(p => p.proj_id === projId);
  if (user) {
    var paletteExists = user.palettes.includes(palette);
    if (paletteExists) {
      user.palettes = user.palettes.filter(id => id !== palette);
      response.status(200).json({
        status: 'success',
        data: user.palettes,
        message: 'Palette has been removed!'
      });
    } else {
      response.status(404).json({
        status: 'failed',
        message: 'This palette never existed!'
      });
    };
  } else {
    response.status(404).json({
      status: 'failed',
      message: 'This user does\'t exist!'
    });
  };
};

function deleteProject(request, response) {
  var user = parseInt(request.params.project_id);
  var projectExists = projects.find(p => p.proj_id === user);
  if (projectExists) {
    projects = projects.filter(p => p.proj_id !== user);
    response.status(200).json({
      status: 'success',
      message: 'Project has been removed!'
    });
  } else {
    response.status(404).json({
      status: 'failed',
      message: 'This project never existed!'
    });
  };
};

module.exports = {
  addColor,
  addProject,
  addPalette,
  getAllProjects,
  getProjectPalettes,
  deletePalette,
  deleteProject
};