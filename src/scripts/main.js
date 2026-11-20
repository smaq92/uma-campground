// Javascript for general functionality of the website

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


// this is for the modal
const openModalButton = document.getElementById("open-policy-modal");
const closeModalButton = document.getElementById("agree-policy");
const confirmBookingButton = document.getElementById("confirm-booking");

function openModal() {
  const modal = document.getElementById("policy-modal");
  modal.style.display = "block";
}
function closeModal() {
  const modal = document.getElementById("policy-modal");
  modal.style.display = "none";
  confirmBookingButton.disabled = false;
}

openModalButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
