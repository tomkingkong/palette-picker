const dropDown = document.querySelector('.drop_btn');
const dropContent = document.querySelector('.dropdown-content');
const GENERATOR = document.querySelector('.GENERATOR');
const randomPalette = document.querySelector('.RANDOM__PALETTE');
const colors = document.querySelectorAll('.COLOR');

GENERATOR.addEventListener('click', function() {
  generatePalette();
});
dropDown.addEventListener('click', toggleDrop);
dropContent.addEventListener('click', selectProject);
randomPalette.addEventListener('click', lockColor);

function generatePalette() {
  colors.forEach((color, i) => {
    if (color.className.includes('locked')) {
      return 
    } else {
      const gem = new Gem();
      generateGemClasses(`${gem.shape}`,`${gem.shape+i}`, gem.color);
      color.innerHTML = `<div class="${gem.shape+i} ${gem.shape}" />`;
    }
  })
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

function selectProject(e) {
  const selectedProject = e.target.innerText;
  dropDown.innerText = selectedProject;
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