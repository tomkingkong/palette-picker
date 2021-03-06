const dropDown = document.querySelector('.selected__dropdown--drop_btn');
const dropContent = document.querySelector('.selected__dropdown--content');
const paletteGenerator = document.querySelector('.jewel-generator');
const randomPalette = document.querySelector('.game__board--palette');
const colors = document.querySelectorAll('.gem-color');
const currentPalettes = document.querySelector('.selected__palettes');
const savePaletteBtn = document.querySelector('.save-palette__textbox');
const paletteInput = document.querySelector('.save-palette__input');
const savedProjects = document.querySelector('.projects__container');
const saveProjectForm = document.querySelector('.projects__form');
const projectInput = document.querySelector('.projects__form--input');
const gemsPalettes = document.querySelector('.selected__palettes');

window.addEventListener('load', function() {
  generateNewPalette();
  populateProjects();
});
window.addEventListener('click', handleDropDown);
dropDown.addEventListener('click', toggleDrop);
dropContent.addEventListener('click', selectProject);
savedProjects.addEventListener('click', selectProject);
saveProjectForm.addEventListener('submit', saveProject);
randomPalette.addEventListener('click', lockColor);
paletteGenerator.addEventListener('click', generateNewPalette);
savePaletteBtn.addEventListener('click', saveGemPalette);
gemsPalettes.addEventListener('click', displaySelectedPalette);

async function populateProjects() {
  const projects = await getAllProjects();
  const { data, status } = projects;
  if (status === 'success') {
    savedProjects.innerHTML = '';
    dropContent.innerHTML = '';
    data.forEach(proj => {
      appendProjectLink(proj);
      spawnProject(proj);
    });
  }
}

function appendProjectLink(project) {
  const { name, id } = project;
  let link = `<a id="${id}">${name}</a>`;
  dropContent.innerHTML += link;
}

async function saveProject(e) {
  e.preventDefault();
  let name = projectInput.value.toLowerCase();

  if (name !== '') {
    let proj = await addProject(name);
    if (proj.error) return projNameError();
    await spawnProject({id: proj.id, name, new:true});
  }
  projectInput.value = '';
}

function projNameError() {
  projectInput.value = 'NAME TAKEN!';
  setTimeout(() => {
    projectInput.value = '';
  }, 2000);
}

function saveGemPalette() {
  const proj_id = parseInt(dropDown.id);
  const projName = dropDown.innerText.toLowerCase();
  const name = paletteInput.value.toLowerCase();
  const palette = { name };
  let gems = [];

  async function retreiveGem(color, i) {
    const { className, id } = color.childNodes[0];
    const shape = className;
    const hex = id;

    gems.push({shape, hex});
    let gem = await addGem(shape, hex);
    palette[`color${i+1}`] = gem.id;
  }

  async function appendPalette() {
    const pal = await addPalette(proj_id, palette);
    const proj = document.getElementById(`${projName}${proj_id}`);
    proj.innerHTML += createPalette(name, gems, pal.id);
    currentPalettes.innerHTML += createPalette(name, gems, pal.id);
    paletteInput.value = '';
  }

  if (!name || !projName === 'SELECT PROJECT') {
    paletteInput.value = 'INVALID! Try Again',
    setTimeout(() => {
      paletteInput.value = '';
      return;
    }, 2000);
    return;
  };

  colors.forEach((color, i) => retreiveGem(color, i));
  setTimeout(() => appendPalette(), 100);
}

async function spawnProject(project) {
  let palettes = [];
  if (!project.new) {
    palettes = await spawnPalettes(project.id);
  }
  savedProjects.innerHTML += 
    createProject(project, palettes);
}

function createProject(project, palettes) {
  const { name, id } = project;
  return (
    `<article class="project__saved">
      <h5 class="project__saved--title" id="${id}">
        ${name}
      </h5>
      <div id="${name+id}" class="project__saved--palettes">
        ${palettes.join('')}
      </div>
    </article>`);
}

async function spawnPalettes(id) {
  const projPalettes = await getProjectPalettes(id);
  const palettes = projPalettes.data.map(async palette => {
    const gems = [];
    for (let i=1; i<6; i++) {
      const gem = await getGem(palette[`color`+i]);
      gems.push(gem.data[0]);
    }
     return createPalette(palette.name, gems, palette.id)
  });
  return await Promise.all(palettes);
}

function createPalette(name, gems, id) {
  return (
    `<article id="${id}" data-name="${name}" class="palette ${name}${id}">
      <h5 class="palette--name">${name}</h5>
      <section class="palette--gems">
        <div class="palette--saved ${gems[0].shape}" style="background-color:${gems[0].hex}"></div>
        <div class="palette--saved ${gems[1].shape}" style="background-color:${gems[1].hex}"></div>
        <div class="palette--saved ${gems[2].shape}" style="background-color:${gems[2].hex}"></div>
        <div class="palette--saved ${gems[3].shape}" style="background-color:${gems[3].hex}"></div>
        <div class="palette--saved ${gems[4].shape}" style="background-color:${gems[4].hex}"></div>
        <div class="palette--trash" onclick="deleteProjectPalette(event)">🗑</div>
      </section>
    </article>
    `)
}

async function selectProject(e) {
  const { innerText, id } = e.target;
  if (!innerText || !id) return;

  dropDown.innerText = innerText;
  dropDown.id = id;
  const palettes = await spawnPalettes(id);
  currentPalettes.innerHTML = palettes.join('');
}

function deleteProjectPalette(event) {
  const palNode = event.target.parentNode.parentNode;
  deletePalette(palNode.id);
  removeFromPage(palNode.dataset.name, palNode.id);
}

function removeFromPage(name, id) {
  const elemToDelete = document.querySelectorAll(`.${name}${id}`);
  elemToDelete.forEach(node => node.parentNode.removeChild(node));
}

function generateNewPalette() {
  colors.forEach(color => {
    if (!color.classList.contains('locked')) {
      const gem = new Gem();

      color.innerHTML = 
        `<div 
          id="${gem.color}" 
          class="${gem.shape}" 
          style="background-color:${gem.color}" />`;
    }
  });
}

function displaySelectedPalette(e) {
  const palette = e.target.querySelectorAll('div');
  const gems = [];

  palette.forEach(gem => {
    if (gem.classList[0] !== 'palette--trash') {
      let shape = gem.classList[1];
      let hex = gem.style.backgroundColor;
      gems.push({shape, hex});
    }
  })

  gems.forEach((gem, i) => {
    if (!colors[i].classList.contains('locked')) {
      colors[i].innerHTML = 
        `<div 
          id="${gem.hex}" 
          class="${gem.shape}" 
          style="background-color:${gem.hex}" />`
    }
  })
}

function lockColor(e) {
  const { classList, parentNode } = e.target;
  if(classList.contains('gem-color')) {
   classList.toggle('locked');
  } else if(parentNode.classList.contains('gem-color')) {
    parentNode.classList.toggle('locked');
  }
}

function toggleDrop() {
  document.getElementById('project-dropdown').classList.toggle('show');
}

function handleDropDown(event) {
  if (!event.target.matches('.selected__dropdown--drop_btn')) {
    const dropdowns = document.getElementsByClassName('selected__dropdown--content');
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}