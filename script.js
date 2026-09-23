// jQuery Content Carousel Enhancement
$(document).ready(function() {
  let slides = $(".carousel-slide");
  let currentIndex = 0;

  setInterval(function() {
    $(slides[currentIndex]).removeClass("active-slide");
    currentIndex = (currentIndex + 1) % slides.length;
    $(slides[currentIndex]).addClass("active-slide");
  }, 3000);
});

// AJAX Error Control & Status Handling
function sendAjaxRequest(targetUrl, isTimeoutTest = false) {
  const statusBox = $("#status-box");
  statusBox.removeClass().hide().text("Processing request...").addClass("status-200").fadeIn();

  $.ajax({
    url: targetUrl,
    method: "GET",
    timeout: isTimeoutTest ? 2000 : 5000, // 2-second timeout for testing
    success: function(data, textStatus, xhr) {
      handleResponse(xhr.status, "Ticket booked successfully! Status: 200 OK");
    },
    error: function(xhr, textStatus, errorThrown) {
      if (textStatus === "timeout") {
        handleResponse(408, "Network Failure: Request Timed Out. Please check your connection.");
      } else if (xhr.status === 0) {
        handleResponse(0, "Network Failure: Unable to reach server (Offline or CORS block).");
      } else {
        switch (xhr.status) {
          case 400:
            handleResponse(400, "Error 400 (Bad Request): Invalid booking parameters provided.");
            break;
          case 401:
          case 403:
            handleResponse(401, "Error 401/403 (Unauthorized): Please log in to book tickets.");
            break;
          case 404:
            handleResponse(404, "Error 404 (Not Found): Requested event module or endpoint missing.");
            break;
          case 500:
            handleResponse(500, "Error 500 (Internal Server Error): Server crashed while processing payment.");
            break;
          default:
            handleResponse(xhr.status, "Unexpected Error Code: " + xhr.status);
        }
      }
    }
  });
}

function handleResponse(statusCode, message) {
  const statusBox = $("#status-box");
  let cssClass = "status-500";

  if (statusCode === 200) cssClass = "status-200";
  else if (statusCode === 400) cssClass = "status-400";
  else if (statusCode === 401 || statusCode === 403) cssClass = "status-401";
  else if (statusCode === 404) cssClass = "status-404";

  statusBox.removeClass().addClass(cssClass).text(message).hide().fadeIn();
}
