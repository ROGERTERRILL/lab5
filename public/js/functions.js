$(document).ready(function() {
  $(".favoriteIcon").on("click", function() {
    let imageURL = $(this)
      .prev()
      .attr("src");

    if ($(this).attr("src") == "img/fav_off.png") {
      $(this).attr("src", "img/fav_on.png");
      updateFavorite("add", imageURL); //inserts a new record
    } else {
      $(this).attr("src", "img/fav_off.png");
      updateFavorite("delete", imageURL); //deletes record
    }
  });

  function updateFavorite(action, imageURL) {
    $.ajax({
      method: "GET",
      url: "/api/updateFavorites",
      data: { imageURL: imageURL, keyword: $("#keyword").val(), action: action }
    });
  }
});
