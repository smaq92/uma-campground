// Javascript for searching available campsites

import { supabase } from "/src/db/supabase";

const searchButton = document.querySelector(".search-available-sites");
const campsiteResultsContainer = document.getElementById("campsite-results");
const checkInInput = document.getElementById("check-in-date");
const checkOutInput = document.getElementById("check-out-date");
const camperSizeInput = document.getElementById("campers-size");
const campTypeSelect = document.getElementById("camp-type");

// This gets the search inputs from the form and returns them as an object. It also converts the camper size and camp type to numbers for easier processing later on.

function getSearchInputs() {
  return {
    checkInDate: checkInInput?.value,
    checkOutDate: checkOutInput?.value,
    camperSize: Number(camperSizeInput?.value),
    campType: Number(campTypeSelect?.value),
  };
}

// This function is called when the search button is clicked. It prevents the default form submission, retrieves the search inputs, and calls the Supabase RPC function to get available campsites based on the provided criteria. The results are then displayed in the campsite results container.
searchButton?.addEventListener("click", async (e) => {
  e.preventDefault();

  // Clear previous results and show a loading message
  if (campsiteResultsContainer) {
    campsiteResultsContainer.innerHTML = "<p>Searching available spots...</p>";
  }
  
  const { checkInDate, checkOutDate, camperSize, campType } = getSearchInputs();

  // Validate the search inputs before making the Supabase call. If any of the inputs are invalid, display an alert and return early.
  if (!checkInDate || !checkOutDate) {
    alert("Please select both a check-in and check-out date.");
    return;
  }else if(new Date(checkInDate) >= new Date(checkOutDate)) {
    alert("Check-out date must be after check-in date.");
    return;
  } 

  if(!camperSize || camperSize <= 0) {
    alert("Please select a valid number of campers.");
    return;
  }


  const { data: availableCampsites, error: bookingError } = await supabase.rpc(
    "get_available_campsites",
    {
      p_check_in: checkInDate,
      p_check_out: checkOutDate,
      p_campers: camperSize,
      p_camp_type: campType,
    },
  );

  if (bookingError) {
    console.error(bookingError);
    if (campsiteResultsContainer) {
      campsiteResultsContainer.innerHTML = "<p>There is an error.</p>";
    }
    return;
  }

  if (campsiteResultsContainer) {
    if (!availableCampsites || availableCampsites.length === 0) {
      campsiteResultsContainer.innerHTML =
        "<p>No campsites available matching your criteria.</p>";
      return;
    }

    console.log(availableCampsites);
    campsiteResultsContainer.innerHTML = availableCampsites
      .map(
        (site) => `
        <div class="site-card">
          <h3>${site.name}</h3>
          <img src="${site.image}" alt="${site.name} campsite image">
          <p>Type: ${site.type_name} | Max Guests: ${site.max_campers}</p>
          <p class="price">$ ${site.price} / night</p>
          <div class="site-card" data-id=${site.id}> 
            <button class="book-btn">Book Now</button>
          </div>
        </div>
      `,
      )
      .join("");
  }
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".book-btn");
  if (!btn) return;
  const card = btn.closest(".site-card");
 const { checkInDate, checkOutDate, camperSize} = getSearchInputs();

  const site = {
    id: Number(card.dataset.id),
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    camperSize: camperSize, 
  };

  localStorage.setItem("selectedSite", JSON.stringify(site));

  window.location.href = "/booking";
});