const dropDown = document.querySelector('.drop_btn');
const dropContent = document.querySelector('.dropdown-content');
const GENERATOR = document.querySelector('.GENERATOR');
const randomPalette = document.querySelector('.RANDOM__PALETTE');
const colors = document.querySelectorAll('.COLOR');
dropDown.addEventListener('click', toggleDrop);
}

function toggleDrop() {
  document.getElementById('project-dropdown').classList.toggle('show');
}
window.onclick = function(event) {
  if (!event.target.matches('.drop_btn')) {

    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}