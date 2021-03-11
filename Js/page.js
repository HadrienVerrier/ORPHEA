$(document).ready(function () {
	//HAVE CURRENT PAGE
	let href = location.href.split("/");
	href = href[href.length - 1];
	href = href.split(".");
	href = href[0];

	//MAKE HISTORY WORK WITH AJAX
	$(window).bind("popstate", function () {
		page(href);
	});

	//MAKE HEADER MENU WORK WITH AJAX
	$("header nav ul p").on("click", function () {
		page($(this).attr("data-href"));
	});

	//CHANGE LANGUAGE WITH AJAX
	$("#language").on("change", function () {
		$.ajax({
			url: "php/function/changeLanguage.php",
			type: "POST",
			data: {
				page: href,
				lang: $("#language option:selected").attr("id"),
			},

			succes: function (data) {
				console.log(data);
			},
			dataType: "json",
		});
	});
});

//FUNCTION TO LOAD MAIN DATA AND CHANGE WITH AJAX
function page(pageName) {
	// if (typeof async == undefined) async = true;
	$.ajax({
		async: true,
		url: "php/function/pageAjax.php",
		type: "POST",
		data: { page: pageName },

		success: function (data) {
			$("main").html(data);

			history.pushState(pageName, pageName, pageName);
			document.title = pageName + " - ORPHÉA";
		},
		dataType: "html",
	});
}
