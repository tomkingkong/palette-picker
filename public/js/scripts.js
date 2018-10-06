const dropDown = document.querySelector('.drop_btn');
const dropContent = document.querySelector('.dropdown-content');
const paletteGenerator = document.querySelector('.GENERATOR');
const randomPalette = document.querySelector('.RANDOM__PALETTE');
const colors = document.querySelectorAll('.COLOR');
const savePaletteBtn = document.querySelector('.SAVE__PALETTE');
const saveProjectForm = document.querySelector('.PROJECTS__FORM');
const projectInput = document.querySelector('.PROJ__INPUT');
const paletteInput = document.querySelector('.PALETTE__INPUT');
const savedProjects = document.querySelector('.PROJECTS__CONTAINER');

window.addEventListener('load', function() {
  generatePalette();
  populateProjects();
});

dropDown.addEventListener('click', toggleDrop);
dropContent.addEventListener('click', selectProject);
savedProjects.addEventListener('click', selectProject);
saveProjectForm.addEventListener('submit', saveProject);
randomPalette.addEventListener('click', lockColor);
paletteGenerator.addEventListener('click', generatePalette);
savePaletteBtn.addEventListener('click', saveColorPalette);

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
      </div>
    </article>`
  )
  savedProjects.innerHTML += savedProject;
}

function spawnPalette(id) {

}

function selectProject(e) {
  const { innerText, id } = e.target;
  dropDown.innerText = innerText;
  dropDown.id = id;
  getProjectPalettes(id);
}

function saveProject() {
  let name = projectInput.value;
  if (name !== '') addProject(name);
  projectInput.value = '';
}

function generatePalette() {
  colors.forEach((color, i) => {
    if (color.className.includes('locked')) {
      return;
    } else {
      const gem = new Gem();
      color.innerHTML = `<div id="${gem.color}" class="${gem.shape}" style="background-color:${gem.color}" />`;
    }
  });
}

function saveColorPalette() {
  const proj_id = parseInt(dropDown.id);
  const projName = dropDown.innerText;
  const name = paletteInput.value;
  if (!name) return;
  const palette = { name };
  let gems = [];

  colors.forEach( async (color, i) => {
    const { className, id } = color.childNodes[0];
    const shape = className;
    const hex = id;
    gems.push({shape, hex});
    let c = await addColor(shape, hex);
    palette[`color${i+1}`] = c.id;
  });
  setTimeout( async () => { 
    let p = await addPalette(proj_id, palette);
    const proj = document.getElementById(projName+proj_id);
    proj.innerHTML += createPalette(name, gems, p.id);
  }, 500);
  paletteInput.value = '';
}
}

function lockColor(e) {
  const { className, classList, parentNode } = e.target;
  if(className.includes('COLOR')) {
   classList.toggle('locked');
  } else if(parentNode.className.includes('COLOR')) {
    parentNode.classList.toggle('locked');
  }
}

function toggleDrop() {
  document.getElementById('project-dropdown').classList.toggle('show');
}

window.onclick = function(event) {
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