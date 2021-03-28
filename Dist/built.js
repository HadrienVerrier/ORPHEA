$(document).ready(function () {;//TONE CONTEXT
let seqRun = false;
let firstContext = true;

$(".gVol").on("click", function () {
	Tone.start();
	if (firstContext) {
		firstContext = false;
		console.log("Audio Context Start");
		const context = new Tone.Context({ latencyHint: "interactive" });
		Tone.setContext(context);
		Tone.context.lookAhead = 0;
		Tone.Destination.mute = true;
	}
	gMute();
});

/////////////
//SAVE DATA//
/////////////

//INIT
let data = {
	t1: {
		n1: { seq: [], id: {}, midi: "C2" },
		n2: { seq: [], id: {}, midi: "D2" },
		n3: { seq: [], id: {}, midi: "Gb2" },
		n4: { seq: [], id: {}, midi: "Bb2" },
		n5: { seq: [], id: {}, midi: "F2" },
		n6: { seq: [], id: {}, midi: "A2" },
		n7: { seq: [], id: {}, midi: "C3" },
		n8: { seq: [], id: {}, midi: "Eb2" },
	},
};

//SEQUENCER

Tone.Transport.bpm.value = 120;
Tone.Transport.timeSignature = 4;
Tone.Transport.swing = 0;
function sequencer() {
	Tone.Transport.start();
	drumPart.start();
}

//FUNCTION
function gMute() {
	if (Tone.Destination.mute) {
		Tone.Destination.mute = false;
		$("#transport_controls").find("svg:nth-of-type(4)").addClass("hidden");
		$("#transport_controls").find("svg:nth-of-type(3)").removeClass("hidden");
	} else {
		Tone.Destination.mute = true;
		$("#transport_controls").find("svg:nth-of-type(3)").addClass("hidden");
		$("#transport_controls").find("svg:nth-of-type(4)").removeClass("hidden");
	}
}
;const drumKit = new Tone.Sampler({
	urls: {
		C2: "./ressources/samples/drums/kick/909.wav",
		D2: "./ressources/samples/drums/snare/909.wav",
		Eb2: "./ressources/samples/drums/claps/909.wav",
		F2: "./ressources/samples/drums/tomL/909.wav",
		Gb2: "./ressources/samples/drums/HHC/909.wav",
		A2: "./ressources/samples/drums/tomM/909.wav",
		Bb2: "./ressources/samples/drums/HHO/909.wav",
		C3: "./ressources/samples/drums/tomH/909.wav",
	},
}).toDestination();

const drumPart = new Tone.Part((time, value) => {
	drumKit.triggerAttackRelease(value.note, "16n", time, value.velocity);
});

drumPart.loop = true;
drumPart.swing = 0;
drumPart.loopEnd = "1:0:0";
;//UNSET ALL SESSION POP UP
$.ajax({
	async: true,
	url: "php/function/forgotPassword.php",
	type: "POST",
	data: { resetPopup: "true" },
});
$.ajax({
	async: true,
	url: "php/function/updateAccount.php",
	type: "POST",
	data: { type: "pop" },
});
hidePausePlayer();
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
	if (!$(this).hasClass("nr") && !$(this).hasClass("oa")) {
		e.preventDefault();
		let href = $(this).attr("href").split(".");
		href.pop();
		href = href.toString();
		page(href);
	} else if (!$(this).hasClass("oa")) {
		e.preventDefault();
	}
});

//CLOSE POP UP KEYBOARD

$(document).on("keyup", "body", function (e) {
	if (e.key == "Escape") {
		$(".popup").fadeOut(200);
		$(".popup").remove();
		$.ajax({
			async: true,
			url: "php/function/forgotPassword.php",
			type: "POST",
			data: { resetPopup: "true" },
		});
		$.ajax({
			async: true,
			url: "php/function/updateAccount.php",
			type: "POST",
			data: { type: "pop" },
		});
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

					popUp(data);
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

			popUp(data);
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
					} else {
						popUp(data);
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

			popUp(data);
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
					popUp(data);
					$(".popup svg").on("click", function () {
						$(".popup").fadeOut(200);
					});
				},
			});
			$("#loader").fadeIn(200);
		}
	}
);

///////////////////
//FORGOT PASSWORD//
///////////////////

$("body").on("click", "main#login #pass_forgot", function () {
	$("#loader").fadeIn(200);
	$.ajax({
		async: true,
		url: "php/function/forgotPassword.php",
		type: "POST",
		success: function (data) {
			popUp(data);
			$(".popup svg").on("click", function () {
				$(".popup").fadeOut(200);
				$.ajax({
					async: true,
					url: "php/function/forgotPassword.php",
					type: "POST",
					data: { resetPopup: "true" },
				});
			});
			$(".popup input[type='submit']+label").on("click", function (e) {
				e.preventDefault();
				$(".popup").fadeOut(200);
				$("#loader").fadeIn(200);
				$.ajax({
					async: true,
					url: "php/function/forgotPassword.php",
					type: "POST",
					data: { user_info: $(".popup input#user_info").val() },
					success: function (data) {
						popUp(data);
						$(".popup svg").on("click", function () {
							$(".popup").fadeOut(200);
						});
					},
				});
			});
		},
	});
});

$("body").on("click", 'main#forgot input[type="submit"] + label', function (e) {
	e.preventDefault();
	$("#loader").fadeIn(200);
	$.ajax({
		async: true,
		url: "php/function/forgotPassword.php",
		type: "POST",
		data: {
			f_password: $("input#f_password").val(),
			f_c_password: $("input#f_c_password").val(),
			f_email: $("input#f_email").val(),
		},
		success: function (data) {
			if (data == "success") {
				window.location = "login.php";
			} else {
				popUp(data);
				$(".popup svg").on("click", function () {
					$(".popup").fadeOut(200);
				});
			}
		},
	});
});
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
			popUp(data);
			$(".popup svg").on("click", function () {
				$(".popup").fadeOut(200);
				$.ajax({
					async: true,
					url: "php/function/updateAccount.php",
					type: "POST",
					data: { type: "pop" },
				});
			});
			$("body").on("click", ".popup input[type='submit'] + label", function () {
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
						popUp(data);
						page("dashboard");
						$(".popup svg").on("click", function () {
							$(".popup").fadeOut(200);
						});
					},
				});
			});
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
			popUp(data);
			$(".popup svg").on("click", function () {
				$(".popup").fadeOut(200);
				$.ajax({
					async: true,
					url: "php/function/updateAccount.php",
					type: "POST",
					data: { type: "pop" },
				});
			});
			$("body").on("click", ".popup input[type='submit'] + label", function () {
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
						popUp(data);
						page("dashboard");
						$(".popup svg").on("click", function () {
							$(".popup").fadeOut(200);
						});
					},
				});
			});
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
			popUp(data);
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

$("body").on("click", "main#contact input[type='submit']+label", function (e) {
	let form = "main#contact form";
	if (
		$(form + " input#identity").val().length !== 0 &&
		$(form + " input#object").val().length !== 0 &&
		$(form + " textarea#message").val().length !== 0
	) {
		e.preventDefault();
		$("#loader").fadeIn(200);

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
				$(form + " input#identity").val("");
				$(form + " input#object").val("");
				$(form + " textarea#message").val("");
				popUp(data);
				$(".popup svg").on("click", function () {
					$(".popup").fadeOut(200);
				});
			},
		});
	}
});

/////////////
////ADMIN////
/////////////
var admin = false;
$.ajax({
	async: true,
	url: "admin.php",
	type: "POST",
	data: { request: true },
	success: function (data) {
		if (data == "true") {
			admin = true;
		} else {
			admin = false;
		}
	},
});

//TRANSLATION SEQUENCE
$("body").on("mousedown", "*[data-translate]", function (e) {
	if (admin) {
		$(document.body).bind("contextmenu", function (e) {
			return false;
		});
		if (e.which == 3) {
			e.preventDefault();
			$("#loader").fadeIn(200);

			$.ajax({
				async: true,
				url: "php/function/getTranslation.php",
				type: "POST",
				data: { request: $(this).attr("data-translate"), type: "request" },
				success: function (data) {
					popUp(data);
					$(".popup svg").on("click", function () {
						$(".popup").fadeOut(200);
					});
					$("body").on("click", '.popup label[for="submit"]', function (e) {
						e.preventDefault();
						$("#loader").fadeIn(200);
						$(".popup").fadeOut(100);
						var changes = {};
						$(".popup textarea").each(function () {
							changes[$(this).attr("name")] = {
								variable_name: $(this).attr("data-trans"),
								value: $(this).val(),
								lang: $(this).attr("name"),
							};
						});
						$.ajax({
							async: true,
							url: "php/function/getTranslation.php",
							type: "POST",
							data: {
								type: "change",
								changes: JSON.stringify(changes),
							},
							success: function (data) {
								document.location.reload();
							},
						});
					});
				},
			});
		}
	}
});

///////////////////////
////DASHBOARD COMPO////
///////////////////////

//CLICK ON COMPOSE
$("body").on(
	"click",
	"main#dashboard header>ul>li:first-of-type",
	function (e) {
		$("#loader").fadeIn(200);
		$.ajax({
			async: true,
			type: "POST",
			url: "php/function/compose.php",
			data: { type: "click" },
			success: function (data) {
				popUp(data);
				$(".popup > svg").on("click", function () {
					$(".popup").fadeOut(200).remove();
				});
				$("body").on("click", ".popup p", function (e) {
					$(".popup").fadeOut(100).remove();
					$("#loader").fadeIn(200);
					$.ajax({
						async: true,
						type: "POST",
						url: "php/function/compose.php",
						data: { type: "return", mode: $(this).attr("data-mode") },
						success: function (data) {
							popUp(data);
							toogleSearchLoop();
							$(".popup > svg").on("click", function () {
								$(".popup").fadeOut(200).remove();
							});

							$("body").on(
								"click",
								'.popup label[for="new_loop"]',
								function () {
									$(".popup").fadeOut(100).remove();
									$("#loader").fadeIn(200);

									$.ajax({
										async: true,
										type: "POST",
										url: "php/function/compose.php",
										data: { type: "new", mode: "loop" },
										success: function (data) {
											switch (data.mode) {
												case "loop":
													window.location.assign(
														"compose.php?l=" + encodeURI(data.name)
													);
													break;
											}
										},
										dataType: "json",
									});
								}
							);
						},
					});
				});
			},
		});
	}
);

//TOGGLE SUBMENU
$("body").on("click", ".popup article .loop-menu", function () {
	if ($(this).parent().find(".menu").hasClass("hidden")) {
		$(this).parent().find(".menu").removeClass("hidden");
	} else {
		$(this).parent().find(".menu").addClass("hidden");
	}
});

////////////
////LOOP////
////////////

//RENAME LOOP
$("body").on("click", ".popup .menu li:first-of-type", function () {
	$(this).parent().addClass("hidden");
	let article = $(this).parent().parent();
	let sub = $(article).find("div.sub");
	var current_name = $(article).find("h6 span").html();
	$(sub)
		.find("input[name='loop_rename_in']")
		.removeClass("hidden")
		.val(current_name);
	$(sub).find("label[for='loop_rename_in']").removeClass("hidden");
	$(sub).find("label[for='submit']").removeClass("hidden");

	$(sub).removeClass("hidden");

	$("body").on("click", '.popup .sub label[for="submit"]', function () {
		var new_name = $(this).parent().find('input[type="text"]').val();
		article = $(this).parent().parent();
		$(sub).addClass("hidden");
		$(sub).find("input[name='loop_rename_in']").addClass("hidden");
		$(sub).find("label[for='loop_rename_in']").addClass("hidden");
		$(sub).find("label[for='submit']").addClass("hidden");
		$.ajax({
			async: true,
			type: "POST",
			url: "php/function/loop.php",
			data: {
				type: "rename",
				new_name: new_name,
				current_name: current_name,
			},

			success: function (data) {
				$(article).find("h6 span").text(data);
			},
		});
	});
});

//DELETE LOOP
$("body").on("click", ".popup .menu li:nth-of-type(2)", function () {
	$(this).parent().addClass("hidden");
	let article = $(this).parent().parent();
	let sub = $(article).find("div.sub");
	$(sub).find("div.l-delete").removeClass("hidden");
	$(sub).find("input[name='loop_rename_in']").hide();
	$(sub).find("label[for='loop_rename_in']").hide();
	$(sub).find("label[for='submit']").hide();

	$(sub).removeClass("hidden");

	$(document).on("click", ".sub .l-delete", function () {
		if ($(this).attr("data-select") == "true") {
			$.ajax({
				async: true,
				url: "php/function/loop.php",
				type: "POST",
				data: {
					type: "delete",
					name: article.find("h6 span").html(),
				},
				success: function (data) {
					if (data == "success") {
						$(article).remove();
						toogleSearchLoop();
					}
				},
			});
		}
		$(sub).addClass("hidden");
		$(sub).find("div.l-delete").addClass("hidden");
	});
});

//DUPLICATE LOOP
$("body").on("click", ".popup .menu li:last-of-type", function () {
	$(this).parent().addClass("hidden");
	let article = $(this).parent().parent();

	$.ajax({
		async: true,
		url: "php/function/loop.php",
		type: "POST",
		data: {
			type: "duplicate",
			name: article.find("h6 span").html(),
		},
		success: function (data) {
			console.log(data);
			$(".popup").replaceWith(data);
		},
	});
});

//SEARCH IN LOOP
$("body").on("input", "#loop_search", function () {
	console.log($(this).val());
});

//EDIT LOOP
$("body").on("click", ".popup .loop-edit", function () {
	let name = $(this).parent().find("h6 span").html();
	window.location.assign("compose.php?l=" + encodeURI(name));
});

///////////////
////FUNCTION///
///////////////

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
				$("footer form").attr("action", pageName + ".php");
				hidePausePlayer();
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

function popUp(data) {
	$("#loader").fadeOut(100);
	$(".popup").remove();
	$("body").append('<section class="popup"></section>');
	$(".popup").replaceWith(data);
	$(".popup").fadeIn(300);
}

//HIDE LOOP SEARCH AND LOOP RESULT IF EMPTY
function toogleSearchLoop() {
	if ($("#loop_results").children().length == 0) {
		$("#loop_results").hide();
		$("#pu_loop #loop_search").hide();
		$('#pu_loop label[for="loop_search"]').hide();
	} else {
		$("#loop_results").show();
		$("#pu_loop #loop_search").show();
		$('#pu_loop label[for="loop_search"]').show();
	}
}
;//OPEN PLAYER
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

//OPEN PLAYER AND CLOSE
function togglePlayer() {
	if ($("#player-container").hasClass("close")) {
		$("#player-container").removeClass("close").addClass("open");
	} else {
		$("#player-container").removeClass("open").addClass("close");
	}
}

//HIDE PLAYER ON COMPOSE PAGE

function hidePausePlayer() {
	let href = location.href.split("/");
	href = href[href.length - 1].split(".")[0];
	if (href == "") href = "index";

	if (href == "compose") {
		$("aside").hide();
	} else {
		$("aside").show();
	}
}
;//GENERAL INIT
var main = $("body main#compose");
var header = main.find("header");
var transportControls = main.find("#transport_controls");
var transport = main.find("#transport_mark");
var tracks = main.find("#tracks");

//////////////
////GENERAL///
//////////////

//SAVE BUTTON
header.find("#export-container svg").on("click", function () {
	saveSettings();
});

//CHANGE LOOP NAME
header.find("#l_name").on("change", function () {
	$.ajax({
		async: true,
		type: "POST",
		url: "php/function/loop.php",
		data: {
			type: "rename",
			new_name: $("#l_name").val(),
			current_name: $("#l_name").attr("data-name"),
		},

		success: function (data) {
			history.pushState(null, null, "compose.php?l=" + encodeURI(data));
			$("#l_name").val(data);
			$("#l_name").attr("data-name", data);
		},
	});
});

//CHANGE LICENCE
header.find("#licence").on("change", function () {
	$.ajax({
		async: true,
		url: "php/function/loop.php",
		type: "POST",
		data: {
			type: "licence",
			licence: $(this).val(),
			name: header.find("#l_name").val(),
		},
		success: function (data) {},
	});
});

//CHANGE BPM
header.find("#l_bpm").on("change", function () {
	saveSettings();
});

let tags = [];
let arrVoid = true;

//GET CURRENT TAGS
let actual = JSON.parse(header.find("#tags-sub").attr("data-actual"));
if (actual.length !== 0) {
	tags = tags.concat(actual);
	arrVoid = false;

	tags.forEach((elm) => {
		header.find("#" + elm + " svg.subbed").addClass("hidden");
		header.find("#" + elm + " svg.added").removeClass("hidden");
	});
}

//ADD AND REMOVE TAGS
header.find("#tags_s").on("click", function (e) {
	e.stopPropagation();
	$(this).parent().find("div.hidden").removeClass("hidden");

	//CLICK ON TAG

	$(this)
		.parent()
		.find("#tags-sub div")
		.on("click", function () {
			let elm = $(this);
			let tag = elm.attr("id");
			if (elm.find("svg.added").hasClass("hidden")) {
				//ADD TAG
				elm.find("svg.added").removeClass("hidden");
				elm.find("svg.subbed").addClass("hidden");
				tags.push(tag);
			} else {
				//REMOVE TAG
				elm.find("svg.subbed").removeClass("hidden");
				elm.find("svg.added").addClass("hidden");
				tags = $.grep(tags, function (value) {
					return value != tag;
				});
			}
			if (tags.length == 0) {
				arrVoid = true;
			} else {
				arrVoid = false;
			}
			$.ajax({
				async: true,
				url: "php/function/loop.php",
				type: "POST",
				data: {
					type: "tags",
					tags: tags,
					name: header.find("#l_name").val(),
					arrVoid: arrVoid,
				},
				success: function (data) {},
			});
		});
});

//SEARCH BAR TAG

var list = [];
if (header.find("#tags_s").val().length == 0) {
	$("#no-tag").hide();
}

$("#tags-sub div").each(function () {
	list[$(this).attr("id")] = $(this).find("span").html();
});
//CLASS TAG WHEN SEARCH
header.find("#tags_s").on("input", function () {
	if (header.find("#tags_s").val().length == 0) {
		$("#no-tag").hide();
	} else {
		$("#no-tag").show();
	}

	let val = $(this).val();
	let regex = new RegExp(val, "i");
	$(list).each(function (index) {
		if (index != 0) {
			if (regex.test(list[index])) {
				$("#" + index).show();
			} else {
				$("#" + index).hide();
			}
		}
	});
});
//CLOSE TAGS LIST
header.on("click", function (e) {
	let targ = $(e.target);
	if (!targ.closest("#tags-container").length) {
		header.find("#tags-container > div").addClass("hidden");
	}
});

//////////////
/////MIDI/////
//////////////

WebMidi.enable(function (err) {
	if (err) {
		console.log("WebMidi could not be enabled.", err);
	} else {
		console.log("WebMidi enabled!");
	}

	// REACT WHEN NEW DEVICE BECOME AVAILABLE
	WebMidi.addListener("connected", function (e) {
		if (e.port.type == "input") {
			findMidiDevice();
		}
	});

	// REACT WHEN NEW DEVICE BECOME UNAVAILABLE
	WebMidi.addListener("disconnected", function (e) {
		if (e.port.type == "input") {
			findMidiDevice();
		}
	});
}, true);

///////////////////
/////SEQUENCER/////
///////////////////

//PLAY/PAUSE

transportControls.find("#play").on("click", function () {
	sequencer();
	transport.removeClass("hidden");
	var width = $("#seq_t1").width();
	transportA(width);
});

//////////////
////BEATS/////
//////////////

let t1 = tracks.find("#t1");

$(".d_click").on("click", function () {
	playD($(this));
});

t1.find("#seq_t1 label").on("click", function () {
	//SET DATA
	let id = $(this).attr("for");
	let arr = id.split("_");
	let tn = arr[0];
	let nn = arr[1];
	let idn = arr[2];
	let midi = data[tn][nn].midi;
	let q = (idn - 1) % 4;
	let b = Math.floor((idn - 1) / 4);
	let m = Math.floor((idn - 1) / 16);

	//CREATE SEQUENCE PART

	let sequ = {
		time: m + ":" + b + ":" + q,
		note: midi,
		velocity: 1,
	};
	if ($(this).prev().prop("checked") ? false : true) {
		//UPDATE DATA
		data[tn][nn].id[idn] = id;

		data[tn][nn].seq[idn] = sequ;

		drumPart.add(sequ);
	} else {
		drumPart._events.forEach((event) => {
			const t = Tone.Time(sequ.time).toTicks();
			if (event.startOffset == t && event.value.note == sequ.note) {
				drumPart._events.delete(event);
				event.dispose();
			}
		});

		delete data[tn][nn].id[idn];
		data[tn][nn].seq[idn] = $.grep(data[tn][nn].seq[idn], function (value) {
			return value != sequ;
		});
	}
	console.log(drumPart._events);
});

//////////////
///FUNCTION///
//////////////

function saveSettings() {
	let settings = {};

	//GET BPM
	let bpm = header.find("#l_bpm").val();

	//ADD DATA
	settings = {
		bpm: bpm,
	};

	$.ajax({
		async: true,
		type: "POST",
		url: "php/function/loop.php",
		data: {
			name: header.find("#l_name").val(),
			type: "settings",
			settings: JSON.stringify(settings),
		},
		success: function (data) {},
	});
}

function findMidiDevice() {
	let selects = tracks.find(".controls select:first-of-type");
	let keep = selects.children().first();
	selects.empty();
	selects.append(keep);
	WebMidi.inputs.forEach((input) => {
		let o = new Option(input.name, input.id);
		$(o).html(input.name);
		selects.append(o);
	});
	return;
}

function playD(elm) {
	if (!firstContext) drums[elm.attr("data-sample")].start();
}

function transportA(width) {
	transport.animate(
		{
			left: "+=" + width,
		},
		5000,
		"linear",
		function () {
			transport.animate(
				{
					left: "-=" + width,
				},
				0,
				function () {
					transportA(width);
				}
			);
		}
	);
}
;console.clear();

});