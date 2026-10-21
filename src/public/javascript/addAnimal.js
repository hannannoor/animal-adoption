document.addEventListener("DOMContentLoaded", function () {
  setupAddAnimalPage();
});

// FOR ADD ANIMAL PAGE 
function setupAddAnimalPage() {
  // wires up the 2 buttons (add image row btn and submit btn) such that on click runs certain functions
  var btnAddMore= document.getElementById("btnAddMoreImage")
  var form = document.getElementById("addAnimalForm");

  
  // adjust header if user comes from admin page since we have different header for admin
  var header= document.getElementsByClassName("header")
  var backtohome=document.getElementsByClassName ("back-link") // also change the back to home to navigate to admin dashboard instead of homepage

  // checks if url contains  "isadmin=True"
  var params = new URLSearchParams(window.location.search)
  if (params.get("isadmin")==="true") {
    header[0].innerHTML =
      "<div class='header-inner'>" +
      "<div class='site'>" +
        "<div class='icon'>❤</div>" +
        "<div>" +
          "<div class='site-title'>" +
             "Animal Adoption " +
            "<span class='admin-pill'>ADMIN</span>" +
          "</div>" +
          "<div class='site-subtitle'>Admin Dashboard</div>" +
        "</div>" +
      "</div>" +

        "<nav class='header-actions'>" +

      "<a class='btn btn-public' href='animal.html'>" +
        "<i class='fa-solid fa-globe'></i> Public Website" +
      "</a>" +

      "<a class='btn btn-manage-apps' href='manageApplications.html'>" +
        "<i class='fa-regular fa-clipboard'></i> Manage Applications " +
        "<span id='pendingCount' class='pending-badge'></span>" +
      "</a>" +

      "<a class='btn btn-post' href='addAnimal.html?isadmin=true'>" +
        "<i class='fa fa-plus-circle' aria-hidden='true'></i> Post an Animal" +
      "</a>" +
    "</nav>" +
    "</div>";

    backtohome[0].innerHTML= "← Back to Admin Dashboard"
    backtohome[0].href= "admin.html"
  }



  if (btnAddMore) btnAddMore.addEventListener("click", addNewImageField);

  // if user presses submit 
  if (form) form.addEventListener("submit", addAnimalData);

  fetch("/species", { method: "GET" })
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var speciesSelect = document.getElementById("species_id");
    if (!speciesSelect) return;

    for (var i = 0; i < data.length; i++) {
      var opt = document.createElement("option");
      opt.value = data[i].species_id;
      opt.textContent = data[i].species_name;
      speciesSelect.appendChild(opt);
    }
  })
  .catch(function (error) {
    console.error("Error", error);
  });
}

  // the function which allows user to add more image url rows so that they can add as many animal images as they want
function addNewImageField() {

  var extraImagesBox = document.getElementById("extraImagesBox");
  if (!extraImagesBox) return; // this line is so that the rest of the function only runs when  on the add animal page if not might get errors if this function runs on other pages

  extraImageCounter++;

  var rowId = "extraRow_" + extraImageCounter;

  var newRow = document.createElement("div");
  newRow.className = "extra-row";
  newRow.id = rowId;

  newRow.innerHTML =
      "<input type='url' class='extraImageUrl' placeholder='https://example.com/image.jpg'>" +
      "<button type='button' class='btn-remove' onclick=\"removeImageField('" + rowId + "')\">×</button>";

  extraImagesBox.appendChild(newRow);
}

function addAnimalData(event) {
  event.preventDefault(); // prevents page reload

  var formElement = document.getElementById("addAnimalForm");
  var formData = new FormData(formElement);
  var animalData = Object.fromEntries(formData.entries());

  // first add animal 
  fetch("/animal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(animalData)
  })
  .then(function (response) {
    if (!response.ok) throw new Error("Error: response not ok");
    return response.json();
  })
  .then(function (data) {
    var newAnimalId = data.insertId;

    // add default image
    fetch("/animal_image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        animal_id: newAnimalId,
        image_url: animalData.image_url,
        is_default: 1
      })
    });

    // add additional images
    var extraInputs = document.getElementsByClassName("extraImageUrl");

    for (var i = 0; i < extraInputs.length; i++) {
      if (extraInputs[i].value === "") continue;

      fetch("/animal_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animal_id: newAnimalId,
          image_url: extraInputs[i].value,
          is_default: 0
        })
      });
    }

    location.href = "animal.html";
  })
  .catch(function (error) {
    console.error("Error:", error);
  });
}

