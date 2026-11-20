
//Javascrift file that handles the booking process (i.e. selecting a site from database via human input) 

import { supabase } from "/src/db/supabase";

// get selected site from local storage
function getSelectedSite(){
  const storedSite = localStorage.getItem("selectedSite");
  return storedSite ? JSON.parse(storedSite) : null;
}

// get site details from supabase
async function getCampsiteDetail(id) {
  const {data: selectedSite, error: selectedSiteError} = await supabase 
.from("campsites")
.select(`
  name,
  id,
    camp_types(
      price_per_night
    )
  `
)
.eq("id", id )
.single()

if(selectedSiteError) {
  console.error("Supabase error", selectedSiteError);
  return null;
}

return selectedSite;
}

// get number of nights 
function getNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const diff = end - start;

  // conver the milliseconds to days
  const numberOfNights = diff / (1000 * 60 * 60 * 24);
  
  return numberOfNights;
}


// render details to site
async function renderBooking(site, dbSite){
  console.log("site");
  console.log(".dbSite")

  const campDetails = document.querySelector(".camp-details");

  console.log(typeof site.checkInDate);
  const nights = getNights(site.checkInDate, site.checkOutDate);

    const {data: bookingFee, error: bookingFeeError} = await supabase
  .from("pricing_rules")
  .select("value")
  .eq("key", "booking_fee")
  .single();

  if(bookingFeeError) {
    console.error("Supabase Error", bookingFeeError);
    return null;
  }

  
 return campDetails.innerHTML = `
  <div>
 <h2>${dbSite.name}</h2>
  <ul>
    <li>Check-in: ${site.checkInDate}</li>
    <li>Check-out: ${site.checkOutDate}</li>
    <li>Campers: ${site.camperSize}</li>
  </ul> 
  <div>
    <p>${nights} nights</p>
  </div>
  <div>

  <table>
<thead>
    <tr>
      <th>Rate</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$${dbSite.camp_types.price_per_night}/night</td>
      <td>${dbSite.camp_types.price_per_night * nights}</td>
    </tr>
    <tr>
      <td>Booking Fee</td>
      <td>$${bookingFee.value}</td>
    </tr>
  </table>
  `
}

async function initBooking(){
  const site = getSelectedSite();

  if(!site){
    console.error("No site selected");
    return;
  }

  const dbSite = await getCampsiteDetail(site.id);

  if(!dbSite){ return };

  await renderBooking(site, dbSite);
}

initBooking();



