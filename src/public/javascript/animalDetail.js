document.addEventListener("DOMContentLoaded", function () {
  loadAnimalDetail();
});

// FOR ANIMAL DETAIL PAGE
function loadAnimalDetail() {
  var animalId = new URLSearchParams(window.location.search).get("animal_id");

  if (!animalId) {
    alert("No animal selected");
    window.location.href = "animal.html";
    return;
  }

  // Load animal info
  fetch("/animal/" + animalId, { method: "GET" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error: response not ok");
      }
      return response.json();
    })
    .then(function (data) {
      insertDynamicAnimalDetail(data);
    })
    .catch(function (error) {
      console.error("Error", error);
    });

  //  Load all images for the animal
  fetch("/animal/" + animalId + "/images", { method: "GET" })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Error: response not ok");
      }
      return response.json();
    })
    .then(function (data) {
      insertAllAnimalImages(data);
    })
    .catch(function (error) {
      console.error("Error", error);
    });
}

function insertDynamicAnimalDetail(animalArray) {
  var detailsBox = document.getElementById("dynamicAnimalDetail");
  if (!detailsBox) return;

  if (!animalArray || animalArray.length === 0) {
    detailsBox.innerHTML = "<p>Animal not found.</p>";
    return;
  }

  var animal = animalArray[0];
  var status = (animal.adoption_status || "").toLowerCase();

  var newContent = "";

  newContent +=
    "<div class='details-top'>" +
      "<h2 class='details-name'>" + animal.name + "</h2>" +
      "<span class='badge " + status + "'>" + animal.adoption_status + "</span>" +
    "</div>" + "<hr>"+

    "<div class='details-meta'>" +
      "<div class='detail-row'><span class='detail-label'>Age:</span><span class='detail-value'>" + animal.age_year + " years " + animal.age_month + " months</span></div>" + 
      "<div class='detail-row'><span class='detail-label'>Species:</span><span class='detail-value'>" + animal.species_name + "</span></div>" +
      "<div class='detail-row'><span class='detail-label'>Breed:</span><span class='detail-value'>" + animal.breed + "</span></div>" +
      "<div class='detail-row'><span class='detail-label'>Gender:</span><span class='detail-value'>" + animal.gender + "</span></div>" +
      "<div class='detail-row'><span class='detail-label'>Temperament:</span><span class='detail-value'>" + animal.temperament + "</span></div>" +
    "</div>";

  detailsBox.innerHTML = newContent;
  
  // adds adopt button if animal is available
  var adoptContainer = document.getElementById("adoptButtonContainer");
    if (adoptContainer && status === "available") {
      adoptContainer.innerHTML =
        "<a class='btn btn-adopt-detail' href='adoptionForm.html?animal_id=" + 
        animal.animal_id + "'>Adopt " + animal.name + "</a>";
    } else if (adoptContainer) {
      adoptContainer.innerHTML = "";
    }

  // Set main image from default image_url returned by /animal/:id 
  var mainBox = document.getElementById("mainImageBox");
  if (mainBox && animal.image_url) {
    mainBox.innerHTML =
      "<img id='mainImage' src='" + animal.image_url + "' alt='" + animal.name + "'>";
  }
}

function insertAllAnimalImages(imagesArray) {
  var mainBox = document.getElementById("mainImageBox");
  var thumbRow = document.getElementById("thumbnailRow");
  if (!mainBox || !thumbRow) return;

  var newThumbs = "";
  var defaultUrl = "";

  // if no image use this placeholder
  if (!imagesArray || imagesArray.length === 0) {
    mainBox.innerHTML =
      "<img id='mainImage' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAMFBMVEXx8/XCy9K/yND09vfw8vTP1tzp7O/i5ure4+fO1dvJ0dfT2d/EzNPt7/Lb4OXo6+4FeM7UAAAFL0lEQVR4nO2c24KrIAxFLdha7///t0dxOlWDSiAKztnrbR4G6SoJBKHZA6zJYncgQeCEAicUOKHACQVOKHBCgRMKnFDghAInFDihwAkFTihwQoETCpxQ4IQCJxQ4ocAJBU4ocEKBEwqcUOCEAicUOKHACQVOKHBCgRMKnFDghAInFDihwAkFTihwQoETCpxQ4IQCJxQ4ocAJBU4ot3Oi1KMq64FnWTVq+EueWzlRquqKVn/J+/ezEfdyHydKPYtc62yF1m1Xymq5ixPVdDnx8eslf1eCVu7hRFXFppAfLW39kNJyByeqOTJirGTvRsbKDZyozsHIpKUQsZK8E1Vu55GTrKTuRL0ZRoyVLviZaTtRVctUMuaVOnCoJO1E1WwjxsorbGZO2Qk7br5WuhApKTvpfZWMy5WAoZKuk6b1NhI4VJJ10uRBSsas0ng+OlUnVaARw9NvqCTqRERJpt9eUtJ0IqPEN36SdNIIKRnIPeafFJ0Ep9c5mr+qTdFJ2CRMpLAn5fScqJeokrFWZkoRdaImwtpw2T9iSnnxuiDoRFXda6hK28JzWTA14ryBxKFlTT9iTlT1W57o3Lta96yED8krRieknCw/DDuEP1TnKBlgzMlCTtZDXr+8pIjOwitK5x7JOKFD3mukiE85ix45S5FxYll46prdiv8ekpsU19wv4kS9LV1ouQPlrPzKliIzTuw9YDYiVfgFSxFx8rR+wcyMomSX9HYpTjlFwonqrB3gBc/JyYQjRcRJYe8Ay4l9rMlLcVi8iTjp7Y/nOBHcMjngWEoi4+TUlcmKw9rnxHzCWMqeU/ltkB9JEZl3SusnYmwQn1fm2GgPeiOzZrM9WZfu/3/BNDznYATLOLENffep+JppeMZBMSZUF9N6ljFM7KF3qpTduBZyQj4W53XTiRsEm1L2dr2k9k9W9Rtjq2BrJj9Zyk7pI7bP9lw8kfH+4KIFLGF77Sa3R90Un0POvHNCcYzsLVMk9+2buni1bd9xjMSJHMPmjCz7zov/fidW5GQ7OS/2e8BoRrLtrBfXScTIMVLsk09cJxEjZ8I6+cR1EmG1tsRaDsZ0EjlyDL0leuxOpulD4JTALtfXORRbnqVO1LDOePdtpoclWPsqulL+wt0P0SNnxFKrrp2opmuXl+5OuHA3PSmByDGQ9ezSydYdM+ELd4YUIsdANnoWTva2RSUv3JlnJRE5I2RbY+6kee1+dTrrhC7cPTZeMUdivZnydaIc3tdqqWuI6USOYZlSfp0oxzVlJxNByUSOYZlSPk6cDzqEXy17JDTn/LBMKRlTSRZ4X2giep2zZnEwZHLiGjifFt6BTtKKHMMspUxO2BkvDzoDm1jkGGa7bsaJx0t9XfgrOfuMlhezwsc48RrKufvhyiXXHatg8T2Zkm0eHzluxO8W4pXHKljkXycBt3h9blFdeqyCx2fPOguLbn6qTWsBu+Czxs/CopsdP4kmkx+mcZ8FRrfuWUqSTSYT005keDucW4iXnzRhMg17iYacC6A0VyZzzIQs0pBrUrn22JoXY4Us0pDjaZMzb+dIMX6/Qi0dHSU0XHySz48heqSaOs60vsvlq2mtpzj9OCh/Trgjew7afgLar63d6ec2SmTZm37+UyV7048K+Gmkm7O10A/8aaSbY7sEr8rYvYoNnX4Sr3EuYJVpVc35Ccu/innZbryMJ1n4v9f4N9FZ39XPZ931GYzMGH9VPHYfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADp8Q9+nG9anuOrfAAAAABJRU5ErkJggg==' alt='No image'>";
    thumbRow.innerHTML = "";
    return;
  }

  // Find default image first
  for (var i = 0; i < imagesArray.length; i++) {
    if (imagesArray[i].is_default === 1) {
      defaultUrl = imagesArray[i].image_url;
    }
  }

  // If no default, use first image
  if (!defaultUrl) {
    defaultUrl = imagesArray[0].image_url;
  }

  // Set main image
  mainBox.innerHTML =
    "<img id='mainImage' src='" + defaultUrl + "' alt='Main image'>";

  // Build thumbnails
  for (var j = 0; j < imagesArray.length; j++) {
    var thumbUrl = imagesArray[j].image_url;
    var activeClass = (thumbUrl === defaultUrl) ? " active" : "";

    newThumbs +=
      "<div class='thumb" + activeClass + "' onclick=\"setMainImage('" + thumbUrl + "')\">" +
        "<img src='" + thumbUrl + "' alt='Thumbnail'>" +
      "</div>";
  }

  thumbRow.innerHTML = newThumbs;
}

//changes the main image when user clicks on thumbnail
function setMainImage(url) {
  var mainImage = document.getElementById("mainImage");
  if (mainImage) {
    mainImage.src = url;
  }

  var thumbRow = document.getElementById("thumbnailRow");
  if (!thumbRow) return;

  var thumbs = thumbRow.getElementsByClassName("thumb");
  for (var i = 0; i < thumbs.length; i++) {
    var img = thumbs[i].getElementsByTagName("img")[0];

    if (img && img.src.indexOf(url) !== -1) {
      thumbs[i].classList.add("active");
    } else {
      thumbs[i].classList.remove("active");
    }
  }
}
