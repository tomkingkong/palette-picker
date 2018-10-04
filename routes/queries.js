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

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => response.status(500).json({ error }))
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
  var userPalette = JSON.parse(request.body.palette);
  var user = parseInt(request.params.project_id);
  var project = projects.find(p => p.proj_id === user);
  var newPalette = { pal_id: palettes.length + 1 };
  if (project) {
    var newPalette = Object.assign({}, { colors: userPalette }, newPalette);
    palettes.push(newPalette);
    project.palettes.push(newPalette.pal_id);
    response.status(200).json({
      status: 'success',
      data: newPalette,
      message: 'Added new palette!'
    });
  } else {
    response.status(404).json({
      error: 'This project does not exist!'
    })
  };
};


function getProjectPalettes(request, response) {
  var user = parseInt(request.params.project_id);
  var project = projects.find(p => p.proj_id === user);
  if (!project) {
    response.status(404).json({
      status: 'failed',
      message: 'This project doesn\'t exist!'
    });
  } else if (project.palettes.length) {
    var projectPalettes = project.palettes.map(pal => palettes.find(p => p.pal_id === pal));
    response.status(200).json({
      status: 'success',
      data: projectPalettes,
      message: 'Retreived palettes!'
    });
  } else {
    response.status(404).json({
      status: 'failed',
      message: 'This project doesn\'t have any palettes!'
    });
  };
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
  var projectExists = projects.find(proj => proj.proj_id === user);
  if (projectExists) {
    projects = projects.filter(proj => proj.proj_id !== user);
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
  getAllColors,
  getAllProjects,
  getProjectPalettes,
  deletePalette,
  deleteProject
};