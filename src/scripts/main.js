const hamburgerButton = document.querySelector(".hamburger-btn");
const navigationMenu = document.querySelector(".menu_links");
const dropdownLinks = document.querySelectorAll(".has-dropdown > a");
const submenuLinkClicked = false;

hamburgerButton.addEventListener("click", () => {
  const isOpen = navigationMenu.classList.toggle("open");
  hamburgerButton.setAttribute("aria-expanded", isOpen);
});

dropdownLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const li = link.parentElement;
    const hasSubmenu = li.querySelector(".sub-menu");

    if (hasSubmenu && window.innerWidth < 768) {
      e.preventDefault();

      const isOpen = li.classList.toggle("open");
      link.setAttribute("aria-expanded", isOpen);
      hamburgerButton.setAttribute("aria-expanded", isOpen);

    }

     hamburgerButton.setAttribute("aria-expanded", String(!submenuLinkClicked));
  });


});




