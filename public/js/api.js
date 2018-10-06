const fetchCurry = (...paths) => (options, method, body) => {
  const url = `/api/v1` + paths.join('');
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

const getColor = (id) => fetchCurry(`/colors/${id}`)({});
const getAllProjects = () => fetchCurry('/projects')({});
const getProjectPalettes = (projectId) => fetchCurry(`/${projectId}/palettes`)({});

const addColor = (shape, hex) => fetchCurry(`/colors`)(false, 'POST', {shape, hex});
const addProject = (name) => fetchCurry(`/projects`)(false, 'POST', {name});
const addPalette = (projectId, palette) => fetchCurry(`/${projectId}/palettes`)(false, 'POST', {...palette});

const deletePalette = (paletteId) => fetchCurry(`/palettes/${paletteId}`)(false, 'DELETE');
const deleteProject = (projectId) => fetchCurry(`/projects/${projectId}`)(false, 'DELETE');