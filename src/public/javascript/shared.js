
// This js file is for functions that are used for multiple pages


// Global variable for extra image counter (used in editanimal and addanimal)
var extraImageCounter = 0;

function removeImageField(rowId) { // needed to remove the rows added
  var row = document.getElementById(rowId);
  if (row) {
    row.remove();
  }
}

function showImagePreview(url, containerId) {
  var container = document.getElementById(containerId);
  //  if url or container is not there then exist the function to prevent errors (error handling)
  if (!container || !url) {
    if (container) container.innerHTML = "";
    return;
  }

  container.innerHTML =
    "<div class='image-preview-card'>" +
      "<img src='" + url + "' alt='Preview'>" +
    "</div>";
}






