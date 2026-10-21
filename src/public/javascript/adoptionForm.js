  document.addEventListener("DOMContentLoaded", function () {
    setupAdoptionForm();
  });

  // FOR ADOPTION FORM PAGE
  function setupAdoptionForm() {
    // gets the animal id from the url so we know which animal the user wants to adopt
    var animalId = new URLSearchParams(window.location.search).get("animal_id");

    if (!animalId) {
      alert("No animal selected");
      window.location.href = "animal.html";
      return;
    }

    // stores animal ID in hidden input field so it can be submitted with the form
    document.getElementById("animal_id").value = animalId;

    // loads animal name to display in subtitle
    fetch("/animal/" + animalId, { method: "GET" })
      .then(function (response) {
        if (!response.ok) throw new Error("Error loading animal");
        return response.json();
      })
      .then(function (data) {
        if (data && data.length > 0) {
          var animal = data[0];
          var subtitle = document.getElementById("animalNameSubtitle");
          if (subtitle) {
            subtitle.textContent = "Apply to adopt " + animal.name + " (" + animal.species_name + ")";
          }
        }
      })
      .catch(function (error) {
        console.error("Error", error);
      });

    // wires up the form submit button
    var form = document.getElementById("adoptionForm");
    if (form) {
      form.addEventListener("submit", submitApplication);
    }
  }

  function submitApplication(event) {
    event.preventDefault() // prevents the page from reloading before completing the function

    var formElement = document.getElementById('adoptionForm');
    var formData = new FormData(formElement);
    var applicationData = Object.fromEntries(formData.entries());
    var jsonString = JSON.stringify(applicationData);

    // submits application with status automatically set to pending
    fetch('/application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonString,
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Error submitting application');
        }
        return response.json();
      })
      .then(function (data) {
        window.location.href = "animal.html";
        alert("Application submitted successfully! We'll review it soon.");
      })
      .catch(function (error) {
        console.error('Error:', error);
        alert("Failed to submit application. Please try again.");
      });
  }
