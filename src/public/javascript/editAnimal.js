document.addEventListener("DOMContentLoaded", function () {
  setupEditAnimalPage();
});

// FOR EDIT ANIMAL PAGE
var existingImageIds = []; // track which images are from DB

function setupEditAnimalPage() {
  var animalId = new URLSearchParams(window.location.search).get("animal_id");

  if (!animalId) {
    alert("No animal selected");
    window.location.href = "admin.html";
    return;
  }

  var btnAddMore = document.getElementById("btnAddMoreImage");
  var form = document.getElementById("editAnimalForm");
  var defaultImgInput = document.getElementById("defaultImageUrl");

  if (btnAddMore) btnAddMore.addEventListener("click", addNewImageFieldEdit);
  if (form) form.addEventListener("submit", updateAnimalData);

  // show preview when default image url changes
  if (defaultImgInput) {
    defaultImgInput.addEventListener("input", function() {
      showImagePreview(this.value, "defaultImagePreview");
    });
  }

  // Load species options
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

      // Now load animal data after species are loaded
      loadAnimalForEdit(animalId);
    })
    .catch(function (error) {
      console.error("Error", error);
    });

  // Load existing images
  loadExistingImagesEdit(animalId);
}

function loadAnimalForEdit(animalId) {
  fetch("/animal/" + animalId, { method: "GET" })
    .then(function (response) {
      if (!response.ok) throw new Error("Error loading animal");
      return response.json();
    })
    .then(function (data) {
      if (!data || data.length === 0) {
        alert("Animal not found");
        window.location.href = "admin.html";
        return;
      }

      var animal = data[0];

      // Fill form fields
      document.getElementById("name").value = animal.name || "";
      document.getElementById("age_year").value = animal.age_year || 0;
      document.getElementById("age_month").value = animal.age_month || 0;
      document.getElementById("species_id").value = animal.species_id || "";
      document.getElementById("breed").value = animal.breed || "";
      document.getElementById("gender").value = animal.gender || "";
      document.getElementById("temperament").value = animal.temperament || "";
      document.getElementById("adoption_status").value = animal.adoption_status || "";
      document.getElementById("defaultImageUrl").value = animal.image_url || "";

      // Show preview of default image
      if (animal.image_url) {
        showImagePreview(animal.image_url, "defaultImagePreview");
      }
    })
    .catch(function (error) {
      console.error("Error", error);
      alert("Failed to load animal data");
    });
}

function loadExistingImagesEdit(animalId) {
  fetch("/animal/" + animalId + "/images", { method: "GET" })
    .then(function (response) {
      if (!response.ok) throw new Error("Error loading images");
      return response.json();
    })
    .then(function (data) {
      var extraImagesBox = document.getElementById("extraImagesBox");
      if (!extraImagesBox) return;

      if (!data || data.length === 0) return;

      // Add existing images (skip default image)
      for (var i = 0; i < data.length; i++) {
        var img = data[i];
        if (img.is_default === 1) continue; // skip default

        extraImageCounter++;
        var rowId = "extraRow_" + extraImageCounter;

        // adds rowid(id of the rows in html so can delte the html later),imageida(so we can delete the image from database later) to the array  like [ {rowId:"existingRow_1" , ImageId:4)}
        //                                                                                                                                              {rowId: "existingRow_2", ImageId:2}]
        existingImageIds.push({
          rowId: rowId,
          imageId: img.image_id
        });

        var newRow = document.createElement("div");
        newRow.className = "extra-row";
        newRow.id = rowId;

        newRow.dataset.imageId = img.image_id; // prevents the images from duplicating  as it knows which images were there beforehand and which are the new images added

        newRow.innerHTML =
          "<div class='extra-input-wrapper'>" +
            "<input type='url' class='extraImageUrl' value='" + img.image_url + "' placeholder='https://example.com/image.jpg'>" +
            "<div class='image-preview-box'><div class='image-preview-card'><img src='" + img.image_url + "' alt='Preview'></div></div>" +
          "</div>" +
          "<button type='button' class='btn-remove' onclick=\"removeExistingImageEdit('" + rowId + "', " + img.image_id + ")\">×</button>";

        extraImagesBox.appendChild(newRow);

        // Add event listener for live preview update( allows for live image previews (so cool))
        var input = newRow.querySelector(".extraImageUrl");
        input.addEventListener("input", function() {
          var box = this.parentElement.querySelector(".image-preview-box");
          if (this.value) {
            box.innerHTML = "<div class='image-preview-card'><img src='" + this.value + "' alt='Preview'></div>";
          } else {
            box.innerHTML = "";
          }
        });
      }
    })
    .catch(function (error) {
      console.error("Error", error);
    });
}

function addNewImageFieldEdit() {
  var extraImagesBox = document.getElementById("extraImagesBox");
  if (!extraImagesBox) return;

  extraImageCounter++;
  var rowId = "extraRow_" + extraImageCounter;

  var newRow = document.createElement("div");
  newRow.className = "extra-row";
  newRow.id = rowId;

  newRow.innerHTML =
    "<div class='extra-input-wrapper'>" +
      "<input type='url' class='extraImageUrl' placeholder='https://example.com/image.jpg'>" +
      "<div class='image-preview-box'></div>" +
    "</div>" +
    "<button type='button' class='btn-remove' onclick=\"removeImageField('" + rowId + "')\">×</button>";

  extraImagesBox.appendChild(newRow);

  // Add event listener for live preview
  var input = newRow.querySelector(".extraImageUrl");
  input.addEventListener("input", function() {
    var previewBox = this.parentElement.querySelector(".image-preview-box");
    if (this.value) {
      previewBox.innerHTML = "<div class='image-preview-card'><img src='" + this.value + "' alt='Preview'></div>";
    } else {
      previewBox.innerHTML = "";
    }
  });
}

function removeExistingImageEdit(rowId, imageId) {
  var ok = confirm("Delete this image?");
  if (!ok) return;

  // Deletes the image from DATABASE
  fetch("/animal_image/" + imageId, { method: "DELETE" })
    .then(function (response) {
      if (!response.ok) throw new Error("Error deleting image");
      return response.json();
    })
    .then(function () {
      // removes the image from the PAGE (the HTML is deleted)
      var row = document.getElementById(rowId);
      if (row) row.remove();
      
      // Removes the row we just removed from the existingImageId array.
        var updatedList = [];

        for (var i = 0; i < existingImageIds.length; i++) {
          if (existingImageIds[i].rowId !== rowId) {
            updatedList.push(existingImageIds[i]);
          }
        }

        existingImageIds = updatedList;
      
    })
    .catch(function (error) {
      console.error("Error", error);
      alert("Failed to delete image");
    });
}

function updateAnimalData(event) {
  if (event) event.preventDefault(); //prevents page from reloading before function finishes

  var animalId = new URLSearchParams(window.location.search).get("animal_id");

  var form = document.getElementById("editAnimalForm");
  var data = Object.fromEntries(new FormData(form).entries());

  // first updates main animal  information
  fetch("/animal/" + animalId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(function () {

    // 2nd updates default image 
      var imageData = {
        image_url: data.image_url
      };

      fetch("/animal_image/default/" + animalId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageData)
      });
    

    // 3rd adds additonal images
    var rows = document.querySelectorAll("#extraImagesBox .extra-row");

    for (var i = 0; i < rows.length; i++) {
      var input = rows[i].querySelector(".extraImageUrl");
      
      // Skip if input doesn't exist or is empty
      if (!input || input.value.trim() === "") continue;

      var imageId = rows[i].dataset.imageId;
      var payload = JSON.stringify({
        animal_id: animalId,
        image_url: input.value.trim()
      });

      if (imageId) {
        // if its a existing image then udate
        fetch("/animal_image/" + imageId, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: payload
        });
      } else {
        // If its a new image then post
        fetch("/animal_image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload
        });
      }
    }

    // Go back to home after everything finishes
    window.location.href = "admin.html";
  });
}