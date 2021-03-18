$(document).ready(function () {
	//HAVE CURRENT PAGE
	let href = location.href.split("/");
	href = href[href.length - 1].split(".")[0];
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

	//CLOSE POP UP KEYBOARD

	$(document).on("keyup", "body", function (e) {
		if (e.key == "Escape") {
			$(".popup").fadeOut(200);
		}
	});

	//USE HTML NATIVE VALIDATION
	$(document).on("submit", "main#login form, main#contact form", function (e) {
		e.preventDefault();
	});

	//CHANGE LANGUAGE WITH AJAX
	$("#lang").on("change", function () {
		let lang = $("#lang option:selected").attr("id");
		if (lang != "no_language") {
			$("#lang-form").submit();
		}
	});

	//////////////
	////COOKIE////
	//////////////

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
							});
						});
					},
					dataType: "html",
				});
			}
		},
	});

	//COOKIE SETTINGS
	$("footer section:nth-of-type(1) a.nr").on("click", function () {
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
	});

	///////////////////////
	//LOGIN LOGOUT SIGNUP//
	///////////////////////

	//LOGIN SEQUENCE
	$("body").on(
		"click",
		"main#login form#login_form label[for='l_submit']",
		function () {
			let form = "main#login form#login_form";
			if (
				$(form + " input#l_username").val().length !== 0 &&
				$(form + " input#l_password").val().length !== 0
			) {
				$.ajax({
					async: true,
					url: "php/function/checkLoggin.php",
					type: "POST",
					data: {
						nickname: $(form + " input#l_username").val(),
						password: $(form + " input#l_password").val(),
					},
					success: function (data) {
						if (data === "success") {
							page("dashboard");
							console.log();
						} else {
							$("body").append('<section class="popup"></section>');
							$(".popup").replaceWith(data);
							$(".popup").fadeIn(300);
							$(".popup svg").on("click", function () {
								$(".popup").fadeOut(100);
							});
						}
					},
				});
			}
		}
	);

	//LOGOUT SEQUENCE
	$("body").on("click", "header nav a.nr", function () {
		$.ajax({
			async: true,
			url: "php/function/logout.php",
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
					}
					$(".popup").fadeOut(200);
					$.ajax({
						//SEND THE ANSWER TO
						async: true,
						url: "php/function/logout.php",
						type: "POST",
						data: {
							type: "validation",
							response: response,
						},

						success: function (data) {
							if (data == "true") {
								page("index");
							}
						},
					});
				});
				$(".popup svg").on("click", function () {
					response = "false";

					$(".popup").fadeOut(200);
				});
			},
			dataType: "html",
		});
	});

	//SIGNUP SEQUENCE
	$("body").on(
		"click",
		'main#login form#signup_form label[for="s_submit"]',
		function () {
			let form = "main#login form#signup_form";
			if (
				$(form + " input#s_username").val().length !== 0 &&
				$(form + " input#s_email").val().length !== 0 &&
				$(form + " input#s_password").val().length !== 0 &&
				$(form + " input#s_c_password").val().length !== 0
			) {
				$.ajax({
					async: true,
					url: "php/function/signup.php",
					type: "POST",
					data: {
						username: $(form + " input#s_username").val(),
						email: $(form + " input#s_email").val(),
						password: $(form + " input#s_password").val(),
						password_check: $(form + " input#s_c_password").val(),
					},
					success: function (data) {
						$("#loader").fadeOut(100);
						$(".popup").remove();
						$("body").append('<section class="popup"></section>');
						$(".popup").replaceWith(data);
						$(".popup").fadeIn(300);
						$(".popup svg").on("click", function () {
							$(".popup").fadeOut(200);
						});
					},
				});
				$("#loader").fadeIn(200);
			}
		}
	);

	///////////////
	//UPDATE DATA//
	///////////////

	//USERNAME

	$("body").on("click", "main#dashboard li#change-username", function (e) {
		$("#loader").fadeIn(200);
		$.ajax({
			async: true,
			url: "php/function/updateAccount.php",
			type: "POST",
			data: { type: "username" },
			success: function (data) {
				$("#loader").fadeOut(100);
				$(".popup").remove();
				$("body").append('<section class="popup"></section>');
				$(".popup").replaceWith(data);
				$(".popup").fadeIn(300);
				$(".popup svg").on("click", function () {
					$(".popup").fadeOut(200);
					$.ajax({
						async: true,
						url: "php/function/updateAccount.php",
						type: "POST",
						data: { type: "pop" },
					});
				});
				$("body").on(
					"click",
					".popup input[type='submit'] + label",
					function () {
						$(".popup").fadeOut(200);
						$("#loader").fadeIn(200);
						$.ajax({
							async: true,
							url: "php/function/updateAccount.php",
							type: "POST",
							data: {
								type: "username",
								current_username: $(".popup input#current_username").val(),
								new_username: $(".popup input#new_username").val(),
								password: $(".popup input#password").val(),
							},
							success: function (data) {
								$("#loader").fadeOut(100);
								$(".popup").remove();
								$("body").append('<section class="popup"></section>');
								$(".popup").replaceWith(data);
								$(".popup").fadeIn(300);
								page("dashboard");
								$(".popup svg").on("click", function () {
									$(".popup").fadeOut(200);
								});
							},
						});
					}
				);
			},
		});
	});

	//PASSWORD
	$("body").on("click", "main#dashboard li#change-password", function (e) {
		$("#loader").fadeIn(200);
		$.ajax({
			async: true,
			url: "php/function/updateAccount.php",
			type: "POST",
			data: { type: "password" },
			success: function (data) {
				$("#loader").fadeOut(100);
				$(".popup").remove();
				$("body").append('<section class="popup"></section>');
				$(".popup").replaceWith(data);
				$(".popup").fadeIn(300);
				$(".popup svg").on("click", function () {
					$(".popup").fadeOut(200);
					$.ajax({
						async: true,
						url: "php/function/updateAccount.php",
						type: "POST",
						data: { type: "pop" },
					});
				});
				$("body").on(
					"click",
					".popup input[type='submit'] + label",
					function () {
						$(".popup").fadeOut(200);
						$("#loader").fadeIn(200);
						$.ajax({
							async: true,
							url: "php/function/updateAccount.php",
							type: "POST",
							data: {
								type: "password",
								username: $(".popup input#username").val(),
								old_password: $(".popup input#old_password").val(),
								new_password: $(".popup input#new_password").val(),
								new_password_c: $(".popup input#new_password_c").val(),
							},
							success: function (data) {
								$("#loader").fadeOut(100);
								$(".popup").remove();
								$("body").append('<section class="popup"></section>');
								$(".popup").replaceWith(data);
								$(".popup").fadeIn(300);
								page("dashboard");
								$(".popup svg").on("click", function () {
									$(".popup").fadeOut(200);
								});
							},
						});
					}
				);
			},
		});
	});

	//DELETE ACCOUNT
	$("body").on("click", "main#dashboard li#delete-account", function (e) {
		$("#loader").fadeIn(200);
		$.ajax({
			async: true,
			url: "php/function/updateAccount.php",
			type: "POST",
			data: { type: "delete" },
			success: function (data) {
				$("#loader").fadeOut(100);
				$(".popup").remove();
				$("body").append('<section class="popup"></section>');
				$(".popup").replaceWith(data);
				$(".popup").fadeIn(300);
				$(".popup svg").on("click", function () {
					$(".popup").fadeOut(200);
					$.ajax({
						async: true,
						url: "php/function/updateAccount.php",
						type: "POST",
						data: { type: "pop" },
					});
				});
				$("body").on("click", ".popup p[data-mode='true']", function () {
					$(".popup").fadeOut(200);
					$("#loader").fadeIn(200);
					$.ajax({
						async: true,
						url: "php/function/updateAccount.php",
						type: "POST",
						data: {
							type: "delete",
						},
						success: function (data) {
							window.location.assign("index.php");
						},
					});
				});
				$("body").on("click", ".popup p[data-mode='false']", function () {
					$(".popup").fadeOut(200);
					$.ajax({
						async: true,
						url: "php/function/updateAccount.php",
						type: "POST",
						data: {
							type: "pop",
						},
					});
				});
			},
		});
	});

	////////////////
	//CONTACT FORM//
	////////////////

	$("body").on(
		"click",
		"main#contact input[type='submit']+label",
		function (e) {
			let form = "main#contact form";
			if (
				$(form + " input#identity").val().length !== 0 &&
				$(form + " input#object").val().length !== 0 &&
				$(form + " textarea#message").val().length !== 0
			) {
				e.preventDefault();
				$("#loader").fadeIn(200);
				$(form + " input#identity").val("");
				$(form + " input#object").val("");
				$(form + " textarea#message").val("");
				$.ajax({
					async: true,
					url: "php/function/message.php",
					type: "POST",
					data: {
						sender: $(form + " input#identity").val(),
						object: $(form + " input#object").val(),
						content: $(form + " textarea#message").val(),
					},

					success: function (data) {
						$("#loader").fadeOut(100);
						$(".popup").remove();
						$("body").append('<section class="popup"></section>');
						$(".popup").replaceWith(data);
						$(".popup").fadeIn(300);
						$(".popup svg").on("click", function () {
							$(".popup").fadeOut(200);
						});
					},
				});
			}
		}
	);
});

//LOAD MAIN DATA AND CHANGE WITH AJAX
function page(pageName) {
	$.ajax({
		async: true,
		url: "php/function/pageAjax.php",
		type: "POST",
		data: { page: pageName },

		success: function (data) {
			if (data == "failure") {
				window.location = "index.php";
			} else {
				$("main").replaceWith(data);
				window.scrollTo(0, 0);
				history.pushState(null, null, pageName + ".php");
				changeNav(pageName + ".php");

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
			}
		},
		dataType: "html",
	});
}

//CHANGE HEADER
function changeNav(pageName) {
	//CHANGE HEADER :
	$.ajax({
		async: true,
		url: "php/function/changeNav.php",
		type: "POST",
		data: { pageName: pageName },
		success: function (data) {
			$("body > header > nav").replaceWith(data);
		},
	});
}
