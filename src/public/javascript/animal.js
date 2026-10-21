document.addEventListener("DOMContentLoaded", function () {
  loadAnimalData();
});

// FOR MAIN ANIMAL DISPLAY PAGE
function loadAnimalData() {
  var animalArray = [];

  fetch("/animal", { method: "GET" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error: response not ok");
      }
      return response.json();
    })
    .then(function (data) {
      animalArray = data;
      insertDynamicAnimal(animalArray);
      setupFilters(animalArray);
    })
    .catch(function (error) {
      console.error("Error", error);
    });
}


function insertDynamicAnimal(arrayOfAnimals) {
  var dynamicAnimalsDataList = document.getElementById("dynamicAnimalsDataList");
  if (!dynamicAnimalsDataList) return;

  var newContent = "";

  for (var i = 0; i < arrayOfAnimals.length; i++) {
    var status = (arrayOfAnimals[i].adoption_status || "").toLowerCase();
    newContent +=
      "<article class='card'>" +
        "<div class='card-img'>" +
        "<img src='" + arrayOfAnimals[i].image_url + "' alt='" + arrayOfAnimals[i].name + "'>" +
        "</div>" +

        "<div class='card-body'>" +
          "<div class='card-top'>" +
          "<h3 class='card-name'>" + arrayOfAnimals[i].name + "</h3>" +
          "<span class='badge " + status + "'>" + arrayOfAnimals[i].adoption_status + "</span>" +
          "</div>" +

          "<div class='info'>" +
          "<div><b>Age:</b> " + arrayOfAnimals[i].age_year + " years " + arrayOfAnimals[i].age_month + " months</div>" +
          "<div><b>Species:</b> " + arrayOfAnimals[i].species_name + "</div>" +
          "<div><b>Breed:</b> " + arrayOfAnimals[i].breed + "</div>" +
          "</div>" +

          "<div class='card-actions'>" +
          "<a class='btn btn-view' href='animalDetail.html?animal_id=" + arrayOfAnimals[i].animal_id + "'>VIEW ANIMAL</a>" +
          (status === 'available' ? "<a class='btn btn-adopt' href='adoptionForm.html?animal_id=" + arrayOfAnimals[i].animal_id + "'>ADOPT ME</a>" : "") + // only shows adopt button if animal is available
          "</div>" +

        "</div>" +
      "</article>";
  }

  dynamicAnimalsDataList.innerHTML = newContent;
}

// FILTER FUNCTIONALITY 
function setupFilters(allAnimals) {

  // Check if filters already exist (prevents havin 2 duplicated filters)
  if (document.getElementById("filterSection")) return;

  var titleBlock = document.querySelector(".title-block");


  // Gets unique species(hamster rabbit amd ferret)
  var speciesSet = {};
  for (var i = 0; i < allAnimals.length; i++) {
    var speciesName = allAnimals[i].species_name;
    if (speciesName) {
      speciesSet[speciesName] = true;
    }
  }

  var filterHTML =
    "<div id='filterSection' class='filter-section'>" +
      "<div class='filter-group'>" +
      "<label>Species:</label>" +
       "<select id='speciesFilter' class='filter-select'>" +
        "<option value='all'>All Species</option>";

  for (var species in speciesSet) {
    filterHTML += "<option value='" + species + "'>" + species + "</option>";
  }

  filterHTML +=
      "</select>" +
      "</div>" +
      "<div class='filter-group'>" +
        "<label>Status:</label>" +
        "<select id='statusFilter' class='filter-select'>" +
          "<option value='all'>All Status</option>" +
          "<option value='available'>Available</option>" +
          "<option value='reserved'>Reserved</option>" +
          "<option value='adopted'>Adopted</option>" +
        "</select>" +
      "</div>" +
    "</div>";

  titleBlock.insertAdjacentHTML("afterend", filterHTML);

  // Add event listeners (checks when user changes filte then applies the filter by running the function filterAnimals)
  document.getElementById("speciesFilter").addEventListener("change", function() {
    filterAnimals(allAnimals);
  });

  document.getElementById("statusFilter").addEventListener("change", function() {
    filterAnimals(allAnimals);
  });
}

function filterAnimals(allAnimals) {
  var speciesFilter = document.getElementById("speciesFilter").value;
  var statusFilter = document.getElementById("statusFilter").value;

  var filtered = [];

  for (var i = 0; i < allAnimals.length; i++) {
    var animal = allAnimals[i];
    var speciesMatch = (speciesFilter === "all" || animal.species_name === speciesFilter);
    var statusMatch = (statusFilter === "all" || animal.adoption_status.toLowerCase() === statusFilter);

    if (speciesMatch && statusMatch) {
      filtered.push(animal);
    }
  }

  insertDynamicAnimal(filtered);
}
