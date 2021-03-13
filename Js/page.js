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

	//MAKE ALL ANCHOR WORK WITH AJAX
	$("body").on("click", "a", function (e) {
		if (!$(this).hasClass("nr")) {
			let href = $(this).attr("href").split(".");
			href.pop();
			href = href.toString();
			page(href);
		}
		e.preventDefault();
	});

	//CHANGE LANGUAGE WITH AJAX
	$("#lang").on("change", function () {
		let lang = $("#lang option:selected").attr("id");
		if (lang != "no_language") {
			$("#lang-form").submit();
		}
	});

	//CHECK COOKIE
	$.ajax({
		async: true,
		url: "php/function/checkCookie.php",
		type: "POST",
		data: { type: "request" }, //REQUEST IF COOKIE WAS CHECKED
		success: function (data) {
			if (data == "false") {
				$.ajax({
					async: true,
					url: "php/function/checkCookie.php",
					type: "POST",
					data: { type: "generate" },
					success: function (data) {
						//GENERATE POPUP

						$("body").append('<section class="popup"></section>');
						$(".popup").replaceWith(data);
						$(".popup").fadeIn(300);
						let response;
						$(".popup p").on("click", function () {
							if ($(this).attr("data-mode") == "true") {
								response = "true";
							} else if ($(this).attr("data-mode") == "false") {
								response = "false";
								document.cookie =
									"lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
								document.cookie =
									"cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
							}
							$(".popup").fadeOut(200);
							$.ajax({
								//SEND THE ANSWER TO
								async: true,
								url: "php/function/checkCookie.php",
								type: "POST",
								data: {
									type: "validation",
									response: response,
								},

								success: function (data) {},
							});
						});
						$(".popup svg").on("click", function () {
							response = "false";
							document.cookie =
								"lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
							document.cookie =
								"cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

							$(".popup").fadeOut(200);
							$.ajax({
								//SEND THE ANSWER TO
								async: true,
								url: "php/function/checkCookie.php",
								type: "POST",
								data: {
									type: "validation",
									response: response,
								},

								success: function (data) {},
							});
						});
					},
					dataType: "html",
				});
			}
		},
	});
});

//LOAD MAIN DATA AND CHANGE WITH AJAX
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

//GENERATE AND OPEN POP-UP

function popUp(popName) {
	return;
}
