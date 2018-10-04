const fetchCurry = (...paths) => (options, method, body) => {
  const url = 'http://localhost:3000' + paths.join('');
  const load = options || {
    method,
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }
  return fetch(url, load)
  .then(response => response.json())
  .then(data => {
    console.log(data)
    return data
  })
  .catch(error => console.log(error));
}

const getAllProjects = () => fetchCurry('/api/v1/projects')({});
// const getAllColors = () => fetchCurry('/api/v1/colors')({});
const getProjectPalettes = (projectId) => fetchCurry(`/api/v1/${projectId}/palettes`)({});

const addColor = (shape, hex) => fetchCurry(`/api/v1/colors`)(false, 'POST', {shape, hex});
const addProject = (name) => fetchCurry(`/api/v1/projects`)(false, 'POST', {name});
const addPalette = (projectId, palette) => fetchCurry(`/api/v1/${projectId}/palettes`)(false, 'POST', {...palette});

const deletePalette = (projectId, paletteId) => fetchCurry(`/api/v1/${projectId}/palettes/${paletteId}`)(false, 'DELETE');
const deleteProject = (projectId) => fetchCurry(`/api/v1/${projectId}`)(false, 'DELETE');