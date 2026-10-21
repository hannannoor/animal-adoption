document.addEventListener("DOMContentLoaded", function () {
  loadAdminAnimals();
});

// FOR ADMIN PAGE
function loadAdminAnimals() {
  loadPendingCount(); // loads count of pending applications 

  fetch("/animal", { method: "GET" })
    .then(function (response) {
      if (!response.ok) throw new Error("Error: response not ok");
      return response.json();
    })
    .then(function (data) {
      insertAdminAnimals(data);
      setupAdminFilters(data);
    })
    .catch(function (error) {
      console.error("Error", error);
    });
}

function insertAdminAnimals(arrayOfAnimals) {
  var grid = document.getElementById("adminAnimalsGrid");
  if (!grid) return;

  var newContent = "";

  for (var i = 0; i < arrayOfAnimals.length; i++) {
    var a = arrayOfAnimals[i];
    var status = (a.adoption_status || "").toLowerCase();

    newContent +=
      "<article class='admin-card'>" +

        "<div class='admin-img-wrap'>" +
          "<img src='" + a.image_url + "' alt='" + a.name + "'>" +
          "<div class='admin-status'>" +
            "<span class='badge " + status + "'>" + a.adoption_status + "</span>" +
          "</div>" +
        "</div>" +

        "<div class='admin-body'>" +

          "<div class='admin-top'>" +
            "<h3 class='admin-name'>" + a.name + "</h3>" +
            "<span class='species-pill " + a.species_name + "'>" + a.species_name + "</span>" +
          "</div>" +

          "<div class='admin-details'>" +
            "<div class='admin-row'><span class='label'>Breed:</span><span class='value'>" + a.breed + "</span></div>" +
            "<div class='admin-row'><span class='label'>Age:</span><span class='value'>" + a.age_year + " years " + a.age_month + " months</span></div>" +
            "<div class='admin-row'><span class='label'>Gender:</span><span class='value'>" + a.gender + "</span></div>" +
            "<div class='admin-row'><span class='label'>Temperament:</span><span class='value'>" + a.temperament + "</span></div>" +
          "</div>" +

          "<div class='admin-actions'>" +
            "<button class='btn-admin btn-edit' onclick='goEditAnimal(" + a.animal_id + ")'><i class='fa-solid fa-pen-to-square'></i>Edit</button>" +
            "<button class='btn-admin btn-delete' onclick='deleteAnimal(" + a.animal_id + ")'><i class='fa-solid fa-trash'></i>Delete</button>" +
          "</div>" +

        "</div>" +
      "</article>";
  }

  grid.innerHTML = newContent;
}

function goEditAnimal(animalId) {
  window.location.href = "editAnimal.html?animal_id=" + animalId;
}

function deleteAnimal(animalId) {
  var ok = confirm("Are you sure you want to delete this animal?");
  if (!ok) return;

  fetch("/animal/" + animalId, { method: "DELETE" })
    .then(function (response) {
      if (!response.ok) throw new Error("Error deleting animal");
      return response.json();
    })
    .then(function () {
      loadAdminAnimals(); // refresh grid
    })
    .catch(function (error) {
      console.error("Error", error);
      alert("Delete failed. Check console.");
    });
}

// used for the header to see how many pending applications there are
function loadPendingCount() {
  fetch("/application", { method: "GET" })
    .then(function (response) {
      if (!response.ok) throw new Error("Error loading applications");
      return response.json();
    })
    .then(function (data) {
      var pending = 0;
      for (var i = 0; i < data.length; i++) {
        if (data[i].status === 'pending') {
          pending++;
        }
      }
      
      var badge = document.getElementById("pendingCount");
      if (badge && pending > 0) {
        badge.textContent = pending;
        badge.style.display = 'inline-block';
      }
    })
    .catch(function (error) {
      console.error("Error", error);
    });
}

// FILTER FUNCTIONALITY 
function setupAdminFilters(allAnimals) {
  // Check if filters already exist
  if (document.getElementById("adminFilterSection")) return;

  var titleBlock = document.querySelector(".admin-title-block");
  if (!titleBlock) return;

  // Get unique species
  var speciesSet = {};
  for (var i = 0; i < allAnimals.length; i++) {
    var speciesName = allAnimals[i].species_name;
    if (speciesName) {
      speciesSet[speciesName] = true;
    }
  }

  var filterHTML =
    "<div id='adminFilterSection' class='filter-section'>" +
      "<div class='filter-group'>" +
        "<label>Species:</label>" +
        "<select id='adminSpeciesFilter' class='filter-select'>" +
          "<option value='all'>All Species</option>";

  for (var species in speciesSet) {
    filterHTML += "<option value='" + species + "'>" + species + "</option>";
  }

  filterHTML +=
        "</select>" +
      "</div>" +
      "<div class='filter-group'>" +
        "<label>Status:</label>" +
        "<select id='adminStatusFilter' class='filter-select'>" +
          "<option value='all'>All Status</option>" +
          "<option value='available'>Available</option>" +
          "<option value='reserved'>Reserved</option>" +
          "<option value='adopted'>Adopted</option>" +
        "</select>" +
      "</div>" +
    "</div>";

  titleBlock.insertAdjacentHTML("afterend", filterHTML);

  // Add event listeners to see when the user changes the filter
  document.getElementById("adminSpeciesFilter").addEventListener("change", function() {
    filterAdminAnimals(allAnimals);
  });

  document.getElementById("adminStatusFilter").addEventListener("change", function() {
    filterAdminAnimals(allAnimals);
  });
}

function filterAdminAnimals(allAnimals) {
  var speciesFilter = document.getElementById("adminSpeciesFilter").value;
  var statusFilter = document.getElementById("adminStatusFilter").value;

  var filtered = [];

  for (var i = 0; i < allAnimals.length; i++) {
    var animal = allAnimals[i];
    // this lines of code basically means if either the filter option is all or, the animal is the same as the filter option then = True 
    var speciesMatch = (speciesFilter === "all" || animal.species_name === speciesFilter);
    var statusMatch = (statusFilter === "all" || animal.adoption_status.toLowerCase() === statusFilter);

    // then only if both statements are true then show the card
    if (speciesMatch && statusMatch) {
      filtered.push(animal);
    }
  }
  insertAdminAnimals(filtered);
}
