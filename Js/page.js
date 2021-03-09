$(document).ready(function () {
	console.log("tes");
	$(window).bind("popstate", function () {
		let href = location.href.split("/");
		href = href[href.length - 1];
		href = href.split(".");
		href = href[0];
		page(href);

		// window.history.back();
	});
	$("header nav ul p").on("click", function () {
		page($(this).attr("data-href"));
	});
});

function page(pageName) {
	// if (typeof async == undefined) async = true;
	$.ajax({
		async: true,
		url: "php/function/pageAjax.php",
		type: "POST",
		data: { page: pageName },

		success: function (data) {
			console.log(data);
			$("main").html(data);

			history.pushState(pageName, pageName, pageName);
			document.title = pageName;
		},
		dataType: "html",
	});
}
