document.addEventListener("DOMContentLoaded", function () {
  loadApplications();
  setupFilters();
});

var allApplications = [];

function loadApplications() {
  fetch("/application", { method: "GET" })
    .then(function (response) {
      if (!response.ok) throw new Error("Error loading applications");
      return response.json();
    })
    .then(function (data) {
      allApplications = data;
      filterAndDisplayApplications();
    })
    .catch(function (error) {
      console.error("Error", error);
    });
}

// sets up the status filter dropdown
function setupFilters() {
  var statusFilter = document.getElementById("statusFilter");
  if (statusFilter) {
    statusFilter.addEventListener("change", filterAndDisplayApplications);
  }
}

// filters applications based on selected status
function filterAndDisplayApplications() {
  var statusFilter = document.getElementById("statusFilter").value;
  var filtered = [];

  for (var i = 0; i < allApplications.length; i++) {
    var app = allApplications[i];

    if (statusFilter === "all" || app.status === statusFilter) {
      filtered.push(app);
    }
  }

  displayApplications(filtered);
}

// displays all applications as cards
function displayApplications(applications) {
  var grid = document.getElementById("applicationsGrid");
  if (!grid) return;

  if (applications.length === 0) {
    grid.innerHTML = 
      "<div class='empty-state'>" +
        "<h2>No Applications Found</h2>" +
        "<p>There are no applications matching your filter.</p>" +
      "</div>";
    return;
  }

  var html = "";

  for (var i = 0; i < applications.length; i++) {
    var app = applications[i];
    var date = new Date(app.created_at);
    var formattedDate = date.toLocaleDateString() + " at " + date.toLocaleTimeString();

    // determines if we should show action buttons (only show approve/reject for pending applications)
    var isPending = app.status === "pending";
    var actionButtons = "";

    if (isPending) {
      actionButtons =
        "<div class='app-actions'>" +
          "<button class='btn-app-action btn-approve' onclick=\"approveApplication(" + app.application_id + ", " + app.animal_id + ")\">Approve</button>" +
          "<button class='btn-app-action btn-reject' onclick=\"rejectApplication(" + app.application_id + ")\">Reject</button>" +
          "<button class='btn-app-action btn-reserve' onclick=\"reserveApplication(" + app.application_id + ", " + app.animal_id + ")\">Reserve</button>" +
          "<button class='btn-app-action btn-app-delete' onclick=\"deleteApplication(" + app.application_id + ")\">Delete</button>" +
        "</div>";
    } else {
      actionButtons =
        "<div class='app-actions'>" +
        "<button class='btn-app-action btn-revert' onclick=\"revertApplication(" + app.application_id + ", " + app.animal_id + ", '" + app.status + "')\">Revert to Pending</button>" +
        "<button class='btn-app-action btn-app-delete' onclick=\"deleteApplication(" + app.application_id + ")\">Delete</button>" +
        "</div>";
    }

    html +=
      "<article class='app-card'>" +
        "<div class='app-header'>" +
          "<div class='app-animal-info'>" +
            "<h3>" + app.animal_name + "</h3>" +
            "<div class='species-text'>" + app.species_name + "</div>" +
          "</div>" +
          "<span class='app-status-badge " + app.status + "'>" + app.status + "</span>" +
        "</div>" +

        "<div class='app-body'>" +
          "<div class='app-section'>" +
            "<h4>Applicant Details</h4>" +
            "<div class='app-detail-row'>" +
              "<span class='app-detail-label'>Name:</span>" +
              "<span class='app-detail-value'>" + app.applicant_name + "</span>" +
            "</div>" +
            "<div class='app-detail-row'>" +
              "<span class='app-detail-label'>Email:</span>" +
              "<span class='app-detail-value'>" + app.email + "</span>" +
            "</div>" +
            "<div class='app-detail-row'>" +
              "<span class='app-detail-label'>Phone:</span>" +
              "<span class='app-detail-value'>" + app.phone + "</span>" +
            "</div>" +
          "</div>" +

          "<div class='app-section'>" +
            "<h4>Application Info</h4>" +
            "<div class='app-detail-row'>" +
              "<span class='app-detail-label'>Date:</span>" +
              "<span class='app-detail-value'>" + formattedDate + "</span>" +
            "</div>" +
            "<div class='app-detail-row'>" +
              "<span class='app-detail-label'>ID:</span>" +
              "<span class='app-detail-value'>#" + app.application_id + "</span>" +
            "</div>" +
          "</div>" +

          "<div class='app-section app-statement'>" +
            "<h4>Statement</h4>" +
            "<div class='app-statement-text'>" + app.application_statement + "</div>" +
          "</div>" +
        "</div>" +

        actionButtons +
      "</article>";
  }

  grid.innerHTML = html;
}

// approves an application and updates animal status to adopted
function approveApplication(applicationId, animalId) {
  var confirmed = confirm("Approve this application? This will mark the animal as adopted.");
  if (!confirmed) return;

  fetch("/application/" + applicationId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "approved", animal_id: animalId })
  })
    .then(function (res) {
      if (!res.ok) throw new Error("Error approved application");
      return res.json();
    })
    .then(function () {
      // update animal adoption status AFTER application update succeeds (incase the have error in changing the application status)
      return fetch("/animalstatus/" + animalId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adoption_status: "adopted" })
      });

    })
    .then(function (res) {
      if (!res.ok) throw new Error("Error updating animal status");
      return res.json();
    })
    .then(function () {
      loadApplications();
    })
    .catch(function (error) {
      console.error(error);
      alert(error.message || "Failed to approve application");
    });
  }

// rejects an application
function rejectApplication(applicationId) {
  var confirmed = confirm("Reject this application?");
  if (!confirmed) return;

  fetch("/application/" + applicationId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status: "rejected"
    })
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Error rejecting application");
      return response.json();
    })
    .then(function () {
      loadApplications(); // reloads to show updated status
    })
    .catch(function (error) {
      console.error("Error", error);
      alert("Failed to reject application");
    });
}

function reserveApplication(applicationId, animalId) {
  var confirmed = confirm("Reserve this application? This will mark the animal as reserved.");
  if (!confirmed) return;


  fetch("/application/" + applicationId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "reserved", animal_id: animalId })
  })
    .then(function (res) {
      if (!res.ok) throw new Error("Error reserving application");
      return res.json();
    })
    .then(function () {
      // update animal adoption status AFTER application update succeeds (incase the have error in changing the application status)
      return fetch("/animalstatus/" + animalId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adoption_status: "reserved" })
      });

    })
    .then(function (res) {
      if (!res.ok) throw new Error("Error updating animal status");
      return res.json();
    })
    .then(function () {
      loadApplications();
    })
    .catch(function (error) {
      console.error(error);
      alert(error.message || "Failed to reserve application");
    });
}

// a previously approved,rejected, or reserved application will be reverted back to pending and if approved or reserved changes the adoption_status of the animal from reserved or adopted back to available
function revertApplication(applicationId,animalId,currentStatus) {
    var confirmed = confirm("Revert this application to pending? This will also set the animal back to available if it was approved or reserved.");
    if (!confirmed) return;

    if (currentStatus === "approved" || currentStatus ==="reserved") {

      fetch("/animalstatus/" + animalId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adoption_status: "available", animal_id: animalId })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Error updating adoption status application");
          return res.json();
    })
        // only if changing status goes through and works then change the application status
        .then(function(){
            return fetch("/application/" + applicationId, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "pending", animal_id: animalId })
            })
        })

        .then(function (res) {
          if (!res.ok) throw new Error("Error updating application status application");
          return res.json();
        })
        .then(function () {
          loadApplications(); // reloads to show updated status
        })
        .catch(function (error) {
          console.error("Error", error);
          alert("Failed to revert application");
        });

      }
      else {
        // if it was not approved/reserved, only revert application
        fetch("/application/" + applicationId, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "pending", animal_id: animalId })
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Error updating application status");
            return res.json();
          })
          .then(function () {
            loadApplications();
          })
          .catch(function (error) {
            console.error("Error", error);
            alert("Failed to revert application");
          });
      }
    }


// deletes an application permanently
function deleteApplication(applicationId) {
  var confirmed = confirm("Are you sure you want to delete this application?");
  if (!confirmed) return;

  fetch("/application/" + applicationId, {
    method: "DELETE"
  })
    .then(function (response) {
      if (!response.ok) throw new Error("Error deleting application");
      return response.json();
    })
    .then(function () {
      loadApplications(); // reloads to refresh the list
    })
    .catch(function (error) {
      console.error("Error", error);
      alert("Failed to delete application");
    });
}
