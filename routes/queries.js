var express = require('express');
var app = express();

var colors = app.locals.colors = [
  { color_id: 1, hex: '#000fff' },
  { color_id: 2, hex: '#123fff' },
  { color_id: 3, hex: '#456ccc' },
  { color_id: 4, hex: '#555bbb' },
  { color_id: 5, hex: '#222aaa' },
]
var palettes = app.locals.palettes = [
  { pal_id: 1, colors: [1, 2, 3, 4, 5] },
  { pal_id: 2, colors: [1, 4, 2, 3, 5] },
  { pal_id: 3, colors: [4, 1, 3, 2, 5] },
]
var projects = app.locals.projects = [
  { proj_id: 1, palettes: [1, 3], name: 'cool' },
  { proj_id: 2, palettes: [2, 3], name: 'beans' },
  { proj_id: 3, palettes: [3], name: 'dawg' },
  { proj_id: 4, palettes: [1], name: 'swag' },
  { proj_id: 5, palettes: [], name: 'blah' },
]

function getAllProjects(request, response) {
  if (projects) {
    response.status(200).json({
      status: 'success',
      data: projects,
      message: 'Added new color!'
    });
  } else {
    response.status(404).json({
      error: `Try adding a project first, cause there ain't none.`
    });
  }
};

function getAllColors(request, response) {
  if (colors) {
    response.status(200).json({
      status: 'success',
      data: colors,
      message: 'Here\'s all the colors Duke.'
    });
  } else {
    response.status(404).json({
      error: 'I can\'t believe there aren\'t any colors.'
    });
  };
};

function addProject(request, response) {
  var name = request.body.name.toLowerCase();
  var projectExists = projects.find(proj => proj.name == name);
  var newProject = { proj_id: projects.length + 1, palettes: [] };
  if (!projectExists) {
    response.status(200).json({
      status: 'success',
      data: Object.assign({}, { name }, newProject),
      message: 'Added new project!'
    });
  } else {
    response.status(400).json({
      error: 'Project with that name already exists!'
    });
  }
};

function addColor(request, response) {
  var color_hex = request.body.color;
  var colorExists = colors.find(color => color.hex == color_hex);
  var newColor = { color_id: colors.length + 1 };
  if (!colorExists) {
    response.status(200).json({
      status: 'success',
      data: Object.assign({}, { hex: color_hex }, newColor),
      message: 'Added new color!'
    });
  } else {
    response.status(400).json({
      error: 'Color already exists!'
    });
  }
};

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
  }
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
    }
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
