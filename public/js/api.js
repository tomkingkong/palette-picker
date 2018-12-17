const fetchCall = ({ path, options }) => {
  const url = `/api/v1` + path;
  return fetch(url, options)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.log(error));
}

const options = ({ method, body }) => ({
  method,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json' }
});

const getGem = (id) => fetchCall({ path: `/colors/${id}` });
const getAllProjects = () => fetchCall({ path: '/projects' });
const getProjectPalettes = (id) => fetchCall({ path: `/${id}/palettes` });

const addProject = (name) => fetchCall({ 
  path: `/projects`,
  options: options({
    method: 'POST',
    body: { name }
  })
});

const addGem = (shape, hex) => fetchCall({ 
  path: `/colors`,
  options: options({
    method: 'POST',
    body: { shape, hex }
  })
});

const addPalette = (id, palette) => fetchCall({ 
  path: `/${id}/palettes`,
  options: options({
    method: 'POST',
    body: { ...palette }
  })
});

const deletePalette = (id) => fetchCall({ 
  path: `/palettes/${id}`,
  options: options({
    method: 'DELETE'
  })
});

const deleteProject = (id) => fetchCall({ 
  path: `/projects/${id}`,
  options: options({
    method: 'DELETE'
  })
});