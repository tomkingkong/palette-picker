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
