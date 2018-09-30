$(document).ready(function() {

let lastClickedButton;

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
    var thisId = $(this).attr("id");
    lastClickedButton = thisId;
    
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      });
    $("#results-modal").modal("toggle");
  });

  $(".submit").on("click", function() {
    var thisId = lastClickedButton;
    let newNote = { body: $("#message-text").val().trim() };

        $.ajax({
          method: "POST",
          url: "/notes/" + thisId,
          data: newNote
          
        //   success: function(data,status,xhr) {
        //     console.log(data);
        
        // // // Display best matchs name and photo 
        // // $("#match-name").text(data.name);
        // // $("#match-img").attr("src", data.photo);

        // // //Shows best match
        // // $("#results-modal").modal("toggle");  
        //   }
        });
          
        // .then(function(result) {
        //     console.log("===",result);
        //     console.log("++++",newNote);
        //     //db.Article.findOneAndUpdate
  });
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
// });