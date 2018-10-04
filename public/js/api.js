const fetchCurry = (...paths) => (options, method, body) => {
  const url = 'https://localhost:3000' + paths.join('');
  const load = options || {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }
  return fetch(url, load)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));
}

const getAllProjects = () => fetchCurry('/api/v1/projects')({});
const getProjectPalettes = (projectId) => fetchCurry(`/api/v1/${projectId}/palettes`)({});

const addColor = (shape, hex) => fetchCurry(`/api/v1/colors`)(false, 'POST', {shape, hex});
const addProject = (name) => fetchCurry(`/api/v1/projects`)(false, 'POST', {name});
const addPalette = (projectId, palette) => fetchCurry(`/api/v1/${projectId}/palettes`)(false, 'POST', {...palette});

const deletePalette = (paletteId) => fetchCurry(`/api/v1/palettes/${paletteId}`)(false, 'DELETE');
const deleteProject = (projectId) => fetchCurry(`/api/v1/projects/${projectId}`)(false, 'DELETE');