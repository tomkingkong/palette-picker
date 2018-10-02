const toggleDrop = () => {
  document.getElementById("project-dropdown").classList.toggle("show");
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