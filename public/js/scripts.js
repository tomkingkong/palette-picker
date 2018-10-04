const dropDown = document.querySelector('.drop_btn');
const dropContent = document.querySelector('.dropdown-content');
const paletteGenerator = document.querySelector('.GENERATOR');
const randomPalette = document.querySelector('.RANDOM__PALETTE');
const colors = document.querySelectorAll('.COLOR');
const savePaletteBtn = document.querySelector('.SAVE__PALETTE');
const saveProjectForm = document.querySelector('.PROJECTS__FORM');
const projectInput = document.querySelector('.PROJ__INPUT');

window.addEventListener('load', generatePalette);
dropDown.addEventListener('click', toggleDrop);
dropContent.addEventListener('click', selectProject);
randomPalette.addEventListener('click', lockColor);
savePaletteBtn.addEventListener('click', saveColorPalette);
function spawnProject(project) {
  const savedProject = (
    `<article id="${project.id}" class="PROJECT__SAVED">
      <h5>${project.name}</h5>
      <div class="PROJECT__PALETTES">
        <section class="PALETTE">
          <div class="CUT_DIAMOND saved"></div>
          <div class="HEXAGON saved"></div>
          <div class="DIAMOND saved"></div>
          <div class="OCTAGON saved"></div>
          <div class="TRIANGLE saved"></div>
        </section>
        <div class="trash">🗑</div>
      </div>
    </article>`
  )
  savedProjects.innerHTML += savedProject;
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
      generateGemClasses(`${gem.shape}`,`${gem.shape+i}`, gem.color);
      color.innerHTML = `<div id="${gem.color}" class="${gem.shape+i} ${gem.shape}" />`;
    }
  });
}

async function saveColorPalette() {
  const proj_id = parseInt(dropDown.id);
  const palette = {
    name: 'test'
  };
  
  colors.forEach( async (color, i) => {
    const { className, id } = color.childNodes[0];
    const shape = className.split(' ')[1];
    const hex = id;
    let c = await addColor(shape, hex);
    palette[`color${i+1}`] = await c.id;
  });
  setTimeout(() => { addPalette(proj_id, palette) }, 1000) 
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