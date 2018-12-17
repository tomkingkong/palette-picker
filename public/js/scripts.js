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
  generatePalette();
  populateProjects();
});
window.addEventListener('click', handleDropDown);
dropDown.addEventListener('click', toggleDrop);
dropContent.addEventListener('click', selectProject);
savedProjects.addEventListener('click', selectProject);
saveProjectForm.addEventListener('submit', saveProject);
randomPalette.addEventListener('click', lockColor);
paletteGenerator.addEventListener('click', generatePalette);
savePaletteBtn.addEventListener('click', saveColorPalette);
gemsPalettes.addEventListener('click', insertGemsToBoard);

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
  let name = projectInput.value;
  if (name !== '') {
    let projId = await addProject(name);
    if (projId.error) return projNameError();
    await spawnProject({id: projId, name, new:true});
  }
  projectInput.value = '';
}

function projNameError() {
  projectInput.value = 'NAME TAKEN!';
  setTimeout(() => {
    projectInput.value = '';
  }, 2000);
}

function saveColorPalette() {
  const proj_id = parseInt(dropDown.id);
  const projName = dropDown.innerText;
  const name = paletteInput.value;
  const palette = { name };
  let gems = [];
  
  async function retreiveGem(color, i) {
    const { className, id } = color.childNodes[0];
    const shape = className;
    const hex = id;
    gems.push({shape, hex});
    let c = await addColor(shape, hex);
    palette[`color${i+1}`] = c.id;
  }

  async function appendPalette() {
    let p = await addPalette(proj_id, palette);
    const proj = document.getElementById(projName+proj_id);
    proj.innerHTML += createPalette(name, gems, p.id);
    currentPalettes.innerHTML += createPalette(name, gems, p.id);
    paletteInput.value = '';
  }

  if (!name || !projName === 'Projects') {
    paletteInput.value = 'INVALID! Try Again',
    setTimeout(() => {
      paletteInput.value = ''
      return
    }, 2000);
    return
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
    `<article class="PROJECT__SAVED">
      <h5 class="title" id="${id}">
        ${name}
      </h5>
      <div id="${name+id}" class="PROJECT__PALETTES">
        ${palettes.join('')}
      </div>
    </article>`);
}

async function spawnPalettes(id) {
  const projPalettes = await getProjectPalettes(id);
  const palettes = projPalettes.data.map(async palette => {
    const gems = [];
    for (let i=1; i<6; i++) {
      const gem = await getColor(palette[`color`+i]);
      gems.push(gem.data[0]);
    }
     return createPalette(palette.name, gems, palette.id)
  });
  return await Promise.all(palettes);
}

function createPalette(name, gems, id) {
  return (
    `<article id="${id}" class="PALETTE">
      <h5 class="name">${name}</h5>
      <section class="gems">
        <div class="saved ${gems[0].shape}" style="background-color:${gems[0].hex}"></div>
        <div class="saved ${gems[1].shape}" style="background-color:${gems[1].hex}"></div>
        <div class="saved ${gems[2].shape}" style="background-color:${gems[2].hex}"></div>
        <div class="saved ${gems[3].shape}" style="background-color:${gems[3].hex}"></div>
        <div class="saved ${gems[4].shape}" style="background-color:${gems[4].hex}"></div>
        <div class="trash" onclick="deleteProjectPalette(event)">🗑</div>
      </section>
    </article>
    `)
}

async function selectProject(e) {
  const { innerText, id } = e.target;
  if (!innerText || !id) return
  dropDown.innerText = innerText;
  dropDown.id = id;
  const palettes = await spawnPalettes(id);
  currentPalettes.innerHTML = palettes.join('');
}

function deleteProjectPalette(event) {
  const { id } = event.target.parentNode.parentNode;
  deletePalette(id);
  const palette = document.getElementById(id)
  palette.parentNode.removeChild(palette);
}

function generatePalette() {
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

function insertGemsToBoard(e) {
  const palette = e.target.querySelectorAll('div');
  const gems = [];
  palette.forEach(gem => {
    if (gem.classList[0] !== 'trash') {
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
  if(classList.contains('COLOR')) {
   classList.toggle('locked');
  } else if(parentNode.classList.contains('COLOR')) {
    parentNode.classList.toggle('locked');
  }
}

function toggleDrop() {
  document.getElementById('project-dropdown').classList.toggle('show');
}

function handleDropDown(event) {
  if (!event.target.matches('.drop_btn')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}