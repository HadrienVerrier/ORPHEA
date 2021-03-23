$(document).ready(function () {
	//OPEN PLAYER
	$("#player-open").on("click", togglePlayer);
	$("body").on("click", 'a[data-translate="index_listen_button"]', function () {
		togglePlayer();
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

//OPEN PLAYER AND CLOSE
function togglePlayer() {
	if ($("#player-container").hasClass("close")) {
		$("#player-container").removeClass("close").addClass("open");
	} else {
		$("#player-container").removeClass("open").addClass("close");
	}
}
