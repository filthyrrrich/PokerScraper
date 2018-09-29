$(document).ready(function() {
   $(".toggleSave").on("click", function() {
    // Empty the notes from the note section
    // $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("id");
    // console.log(thisId);
    

    // Now make an ajax call for the Article
    $.ajax({
      method: "PUT",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        //  data.isSaved = !data.isSaved; 
         console.log(data);
         
         // if statement
         window.location.reload();
      });
  });

  // Whenever someone clicks save art button

  $(".addNote").on("click", function() {
    $("#results-modal").modal("toggle");
  });


// //submit
// var thisId = $(this).attr("id");

//     $.ajax({
//       method: "POST",
//       url: "/notes/" + thisId
//     })
      
//     .then(function(result) {
//         console.log(result);
//         //db.Article.findOneAndUpdate
        
//         // $("#results-modal").modal("toggle");

        
//       });
             `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                `});