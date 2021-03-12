$(document).ready(function () {
	//HAVE CURRENT PAGE
	let href = location.href.split("/");
	href = href[href.length - 1];
	href = href.split(".");
	href = href[0];
	if (href == "") href = "index";
	//MAKE HISTORY WORK WITH AJAX
	$(window).bind("popstate", function () {
		page(href);
	});

	//MAKE HEADER MENU WORK WITH AJAX
	$("body").on("click", "a", function (e) {
		let href = $(this).attr("href").split(".");
		href.pop();
		href = href.toString();
		page(href);
		e.preventDefault();
	});

	//CHANGE LANGUAGE WITH AJAX
	$("#lang").on("change", function () {
		let lang = $("#lang option:selected").attr("id");
		if (lang != "no_language") {
			$("#lang-form").submit();
		}
	});
});

//FUNCTION TO LOAD MAIN DATA AND CHANGE WITH AJAX
function page(pageName) {
	$.ajax({
		async: true,
		url: "php/function/pageAjax.php",
		type: "POST",
		data: { page: pageName },

		success: function (data) {
			$("main").replaceWith(data);

			history.pushState(null, null, pageName + ".php");

			//GET DOCUMENT NAME
			$.ajax({
				async: true,
				url: "php/function/getPageName.php",
				type: "POST",
				data: { page: pageName },

				success: function (data) {
					document.title = data + " - ORPHÉA";
				},
				dataType: "text",
			});
		},
		dataType: "html",
	});
}
