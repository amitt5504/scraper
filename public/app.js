// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br /><br />" + data[i].summary + "</p>" + "<hr>");
  }
});

//when scraping for new articles, reload the articles section
$(document).on("click", "#scrape", function () {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then(function() {
    $("#articles").empty();
    $.getJSON("/articles", function (data) {
      // For each one
      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br /><br />" + data[i].summary + "</p>" + "<hr>");
      }
    });
  })
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h5>" + data.title + "</h5>");
      
      //if notes exist, display the note
      if (data.notes) {
        $("#notes").append("<p>" + data.notes.title + " - " + data.notes.body + "</p>");
         $("#notes").append("<button class='btn btn-outline-secondary' data-id='" + data.notes._id + "' id='deletenote'>Delete Note</button>");
        
       
      }
      //display the text field to display the note
      else
      {
      $("#notes").append("<input id='titleinput' name='title' >" + "<br />");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>" + "<br />");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data + "me");
      // Empty the notes section
      $("#notes").empty();
      console.log("test");
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#deletenote", function () {
  var thisId = $(this).attr("data-id");
  $("#notes").empty(); 
  $.ajax({
      method: "DELETE",
      url: "/notes/delete/" + thisId
    })
    // With that done
    .then(function() {
      // Log the response
      location.reload();
      
    });

});