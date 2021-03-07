//CSS

$(document).ready(function () {
	$("#player-open").on("click", function () {
		if ($("#player-container").hasClass("close")) {
			$("#player-container").removeClass("close").addClass("open");
		} else {
			$("#player-container").removeClass("open").addClass("close");
		}
	});
});
