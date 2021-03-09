$(document).ready(function () {
	//CSS

	//OPEN PLAYER AND CLOSE
	$("#player-open").on("click", function () {
		if ($("#player-container").hasClass("close")) {
			$("#player-container").removeClass("close").addClass("open");
		} else {
			$("#player-container").removeClass("open").addClass("close");
		}
	});

	//SEARCH BAR
	$("#searchbar").on("input", function () {
		if (!$(this).val()) {
			$("#results").addClass("empty");
		} else {
			$("#results").removeClass("empty");
		}
	});
});
