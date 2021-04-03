$(document).ready(function () {;//TONE CONTEXT
let firstContext = true;

//IMPORT DATA & SETTINGS
let href = location.href.split("/");
href = href[href.length - 1].split(".")[0];

let data = $("[data-data-song]");
if (data.length == 0) {
	console.log("test");
	data =
		'{"t1":{"n1":{"seq":[],"id":{}, "midi": "C2" },"n2":{"seq":[],"id":{}, "midi": "D2"},"n3":{"seq":[],"id":{}, "midi": "Gb2"},"n4":{"seq":[],"id":{}, "midi": "Bb2"},"n5":{"seq":[],"id":{}, "midi": "F2"},"n6":{"seq":[],"id":{}, "midi": "A2"},"n7":{"seq":[],"id":{}, "midi": "C3"},"n8":{"seq":[],"id":{}, "midi": "Eb2"}},"t2":{"n1":{"seq":[],"id":{}},"n2":{"seq":[],"id":{}},"n3":{"seq":[],"id":{}},"n4":{"seq":[],"id":{}},"n5":{"seq":[],"id":{}},"n6":{"seq":[],"id":{}},"n7":{"seq":[],"id":{}},"n8":{"seq":[],"id":{}}},"t3":{"n1":{"seq":[],"id":{}},"n2":{"seq":[],"id":{}},"n3":{"seq":[],"id":{}},"n4":{"seq":[],"id":{}},"n5":{"seq":[],"id":{}},"n6":{"seq":[],"id":{}},"n7":{"seq":[],"id":{}},"n8":{"seq":[],"id":{}}},"t4":{"n1":{"seq":[],"id":{}},"n2":{"seq":[],"id":{}},"n3":{"seq":[],"id":{}},"n4":{"seq":[],"id":{}},"n5":{"seq":[],"id":{}},"n6":{"seq":[],"id":{}},"n7":{"seq":[],"id":{}},"n8":{"seq":[],"id":{}}}}';
	data = JSON.parse(data);
} else {
	data = JSON.parse($(data).attr("data-data-song"));
}

let settings = $("[data-settings]");
if (settings.length == 0) {
	settings = '{"bpm" : "120","timeSignature" : "4","swing" : "0"}';
	settings = JSON.parse(settings);
} else {
	settings = JSON.parse($(settings).attr("data-settings"));
}

//START AUDIO
$(document).on("click", async () => {
	if (typeof context === "undefined") {
		await Tone.start();
		createToneContext();
	}
});

//SEQUENCER

setSettings(settings);
function setSettings(settings) {
	Tone.Transport.bpm.value = settings.bpm;
	Tone.Transport.timeSignature = settings.timeSignature;
	Tone.Transport.swing = settings.swing;
	return;
}
let gPlayState = true;
function sequencer() {
	if (Tone.Transport.state == "stopped") {
		Tone.Transport.start();
		drumPart.start();
		synth1Part.start();
		synth2Part.start();
		synth3Part.start();
	} else if (Tone.Transport.state == "paused") {
		Tone.Transport.start();
	} else {
		Tone.Transport.pause();
	}

	Tone.Transport.scheduleRepeat(animPlay, "8n");
}

//CREATE TRACK
let master = new Tone.Channel().toDestination();

let bus1 = new Tone.Channel().connect(master);
let bus2 = new Tone.Channel().connect(master);
let bus3 = new Tone.Channel().connect(master);
let bus4 = new Tone.Channel().connect(master);

let channels = {
	master: master,
	tracks: {
		t1: { bus: bus1 },
		t2: { bus: bus2 },
		t3: { bus: bus3 },
		t4: { bus: bus4 },
	},
};
//FUNCTION

function createToneContext() {
	if (firstContext) {
		firstContext = false;
		const context = new Tone.Context({ latencyHint: "interactive" });
		Tone.setContext(context);
		Tone.context.lookAhead = 0.02;
		Tone.Destination.mute = false;
	}
}
function gMute() {
	if (Tone.Destination.mute) {
		Tone.Destination.mute = false;
		$("#mute").addClass("hidden");
		$("#noMute").removeClass("hidden");
	} else {
		Tone.Destination.mute = true;
		$("#noMute").addClass("hidden");
		$("#mute").removeClass("hidden");
	}
}

function animPlay() {
	if (gPlayState) {
		gPlayState = false;
		$(".gPlay").css({
			fill: "purple",
			transition: "0.05s",
		});
	} else {
		gPlayState = true;
		$(".gPlay").css({
			fill: "white",
			transition: "0.05s",
		});
	}
}
;const rev2 = new Tone.Reverb({
	decay: 2,
	wet: 0.5,
}).connect(bus2);

const rev3 = new Tone.Reverb({
	decay: 2,
	wet: 0.5,
}).connect(bus3);

const rev4 = new Tone.Reverb({
	decay: 2,
	wet: 0.5,
}).connect(bus4);
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
}).connect(bus1);

const drumPart = new Tone.Part((time, value) => {
	drumKit.triggerAttackRelease(value.note, "16n", time, value.velocity);
});

drumPart.loop = true;
drumPart.swing = 0;
drumPart.loopEnd = "1:0:0";

channels.tracks.t1.synth = drumKit;
channels.tracks.t1.part = drumPart;
;const synth1 = new Tone.PolySynth(Tone.MonoSynth, {
	oscillator: {
		type: "triangle",
	},
	envelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	filter: {
		frequency: "6000",
		gain: 0,
		type: "lowpass",
	},
	filterEnvelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	portamento: 0,
}).connect(rev2);

synth1.volume.value = -6;
const synth1Part = new Tone.Part((time, value) => {
	synth1.triggerAttackRelease(value.note, value.duration, time, value.velocity);
});

synth1Part.loop = true;
synth1Part.swing = 0;
synth1Part.loopEnd = "1:0:0";

channels.tracks.t2.synth = synth1;
channels.tracks.t2.part = synth1Part;

//SYNTH 2
const synth2 = new Tone.PolySynth(Tone.MonoSynth, {
	oscillator: {
		type: "sine",
	},
	envelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	filter: {
		frequency: "2000",
		gain: 0,
		type: "lowpass",
	},
	filterEnvelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	portamento: 0,
}).connect(rev3);

synth2.volume.value = -6;
const synth2Part = new Tone.Part((time, value) => {
	synth2.triggerAttackRelease(value.note, value.duration, time, value.velocity);
});

synth2Part.loop = true;
synth2Part.swing = 0;
synth2Part.loopEnd = "1:0:0";

channels.tracks.t3.synth = synth2;
channels.tracks.t3.part = synth2Part;

//SYNTH 3
const synth3 = new Tone.PolySynth(Tone.MonoSynth, {
	oscillator: {
		type: "square",
	},
	envelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	filter: {
		frequency: "10000",
		gain: 0,
		type: "lowpass",
	},
	filterEnvelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	portamento: 0,
}).connect(rev4);

synth3.volume.value = -6;
const synth3Part = new Tone.Part((time, value) => {
	synth3.triggerAttackRelease(value.note, value.duration, time, value.velocity);
});

synth3Part.loop = true;
synth3Part.swing = 0;
synth3Part.loopEnd = "1:0:0";

channels.tracks.t4.synth = synth3;
channels.tracks.t4.part = synth3Part;
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
href = location.href.split("/");
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
$("footer section:nth-of-type(1) li:nth-of-type(2) a.nr").on(
	"click",
	function () {
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
	}
);

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

//PREVIEW LOOP IN PLAYER

$("body").on("click", ".popup #loop_results article .loop-play", function () {
	// console.log($(this).parent().attr("id").split("-")[1]);
	getLoop($(this).parent().attr("id").split("-")[1]);
});
///////////////
////FUNCTION///
///////////////

//LOAD MAIN DATA AND CHANGE WITH AJAX
function page(pageName) {
	if (href == "compose") {
		window.location = pageName + ".php";
	} else {
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

//GET DATA FROM LOOP AND PLAY IT

function getLoop(id) {
	$.ajax({
		async: true,
		url: "php/function/loop.php",
		type: "POST",
		data: { type: "get", id: id },
		success: function (data) {
			clearData();
			setSettings(JSON.parse(data.settings));
			setData(JSON.parse(data.data));
			setInfos(data.name, data.nickname);
			sequencer();
			transportP();
		},
		dataType: "json",
	});
}

function setData(data) {
	$.each(data, function (it, t) {
		$.each(t, function (ni, n) {
			$.each(n.seq, function (i, s) {
				if (s) {
					channels.tracks[it].part.add(s);
				}
			});
		});
	});
	return;
}
function setInfos(loopName, nickname) {
	$("#player-container #song-info #current-song").html(loopName);
	$("#player-container #song-info #current-artist").html(nickname);
	return;
}

function clearData() {
	$.each(channels.tracks, function (i, t) {
		t.part.clear();
	});
}

let width = $("#timebar").width();
$(window).resize(function () {
	width = $("#timebar").width();
});
function transportP() {
	let bpmSpeed = (60 / (Tone.Transport.bpm.value / 4)) * 1000;
	//BAR
	$("#timebar div").animate(
		{
			width: "100%",
		},
		bpmSpeed,
		"linear"
	);
	Tone.Transport.scheduleRepeat(
		() => {
			bpmSpeed = (60 / (Tone.Transport.bpm.value / 4)) * 1000;
			$("#timebar div").stop();
			$("#timebar div").css({
				width: "0%",
			});
			$("#timebar div").animate(
				{
					width: "100%",
				},
				bpmSpeed,
				"linear"
			);
		},
		"1m",
		"1m"
	);
	//POINT
	$("#timebar span").animate(
		{
			left: "100%",
		},
		bpmSpeed,
		"linear"
	);
	Tone.Transport.scheduleRepeat(
		() => {
			bpmSpeed = (60 / (Tone.Transport.bpm.value / 4)) * 1000;
			$("#timebar span").stop();
			$("#timebar span").css({
				left: "0%",
			});
			$("#timebar span").animate(
				{
					left: "100%",
				},
				bpmSpeed,
				"linear"
			);
		},
		"1m",
		"1m"
	);
}
;if (href == "compose") {
	//GENERAL INIT
	var main = $("body main#compose");
	var header = main.find("header");
	var transportControls = main.find("#transport_controls");
	var transport = main.find("#transport_mark");
	var tracks = main.find("#tracks");

	//////////////
	////GENERAL///
	//////////////

	//SAVE BUTTON AND AUTO
	header.find("#export-container svg").on("click", function () {
		saveSettings();
	});

	setInterval(saveSettings, 5000);

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
		Tone.Transport.bpm.value = $(this).val();
		saveSettings();
	});

	//GET CURRENT TAGS
	let tags = [];
	let arrVoid = true;

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

	//CHANGE STEP NUMBER

	let step = settings.step;
	$('#l_step option[value="' + step + '"]').prop("selected", true);
	if (step == 16) {
		$(".next-page").addClass("hidden");
		$(".previous-page").addClass("hidden");
	}

	$("#l_step").on("change", function () {
		step = $(this).val();
		if (step == 16) {
			$(".next-page").addClass("hidden");
			$(".previous-page").addClass("hidden");
		} else {
			$(".next-page").removeClass("hidden");
			$(".previous-page").removeClass("hidden");
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

		//TRACK 1
		var t1Channel, t1Input;
		tracks.find("#midi_input_t1").on("input", function () {
			tracks
				.find("#midi_channel_t1 option:first-of-type")
				.prop("selected", true);
			if (t1Input !== undefined) {
				t1Input.removeListener("noteon", t1Channel);
				t1Input = undefined;
			}
			t1Input = WebMidi.inputs[$(this).val().split("-")[1]];
		});

		tracks.find("#midi_channel_t1").on("change", function () {
			if (t2Channel !== undefined) {
				t2Input.removeListener("noteon", t2Channel);
				t2Channel = undefined;
			}
			t1Channel = parseFloat($(this).val().split("_")[2]);
			t1Input.addListener("noteon", t1Channel, (e) => {
				note = e.note.name + e.note.octave;
				drumKit.triggerAttackRelease(note, "16n", "+0", e.velocity);
			});
		});

		var t2Channel, t2Input;
		tracks.find("#midi_input_t2").on("input", function () {
			tracks
				.find("#midi_channel_t2 option:first-of-type")
				.prop("selected", true);
			if (t2Input !== undefined) {
				t2Input.removeListener("noteon", t2Channel);
				t2Input.removeListener("noteoff", t2Channel);
				t2Input = undefined;
			}
			t2Input = WebMidi.inputs[$(this).val().split("-")[1]];
		});
		tracks.find("#midi_channel_t2").on("input", function () {
			if (t2Channel !== undefined) {
				t2Input.removeListener("noteon", t2Channel);
				t2Input.removeListener("noteoff", t2Channel);
				t2Channel = undefined;
			}
			t2Channel = parseFloat($(this).val().split("_")[2]);
			t2Input.addListener("noteon", t2Channel, (e) => {
				note = e.note.name + e.note.octave;
				synth1.triggerAttack(note, Tone.context.currentTime, e.velocity);
			});
			t2Input.addListener("noteoff", t2Channel, (e) => {
				note = e.note.name + e.note.octave;
				synth1.triggerRelease(note, Tone.context.currentTime);
			});
		});

		var t3Channel, t3Input;
		tracks.find("#midi_input_t3").on("input", function () {
			tracks
				.find("#midi_channel_t3 option:first-of-type")
				.prop("selected", true);
			if (t3Input !== undefined) {
				t3Input.removeListener("noteon", t3Channel);
				t3Input.removeListener("noteoff", t3Channel);
				t3Input = undefined;
			}
			t3Input = WebMidi.inputs[$(this).val().split("-")[1]];
		});
		tracks.find("#midi_channel_t3").on("input", function () {
			if (t3Channel !== undefined) {
				t3Input.removeListener("noteon", t3Channel);
				t3Input.removeListener("noteoff", t3Channel);
				t3Channel = undefined;
			}
			t3Channel = parseFloat($(this).val().split("_")[2]);
			t3Input.addListener("noteon", t3Channel, (e) => {
				note = e.note.name + e.note.octave;
				synth2.triggerAttack(note, Tone.context.currentTime, e.velocity);
			});
			t3Input.addListener("noteoff", t3Channel, (e) => {
				note = e.note.name + e.note.octave;
				synth2.triggerRelease(note, Tone.context.currentTime);
			});
		});

		var t4Channel, t4Input;
		tracks.find("#midi_input_t4").on("input", function () {
			tracks
				.find("#midi_channel_t4 option:first-of-type")
				.prop("selected", true);
			if (t4Input !== undefined) {
				t4Input.removeListener("noteon", t4Channel);
				t4Input.removeListener("noteoff", t4Channel);
				t4Input = undefined;
			}
			t4Input = WebMidi.inputs[$(this).val().split("-")[1]];
		});
		tracks.find("#midi_channel_t4").on("input", function () {
			if (t4Channel !== undefined) {
				t4Input.removeListener("noteon", t4Channel);
				t4Input.removeListener("noteoff", t4Channel);
				t4Channel = undefined;
			}
			t4Channel = parseFloat($(this).val().split("_")[2]);
			t4Input.addListener("noteon", t4Channel, (e) => {
				note = e.note.name + e.note.octave;
				synth3.triggerAttack(note, Tone.context.currentTime, e.velocity);
			});
			t4Input.addListener("noteoff", t4Channel, (e) => {
				note = e.note.name + e.note.octave;
				synth3.triggerRelease(note, Tone.context.currentTime);
			});
		});
	}, true);

	///////////////////
	/////SEQUENCER/////
	///////////////////

	//PLAY/PAUSE

	transportControls.find(".gPlay").on("click", async () => {
		if (typeof context === "undefined") {
			await Tone.start();
			createToneContext();
			sequencer();
			transport.removeClass("hidden");
			Tone.Transport.state !== "started"
				? transportA("run")
				: transportA("stop");
		} else {
			sequencer();
			transport.removeClass("hidden");
			Tone.Transport.state !== "started"
				? transportA("run")
				: transportA("stop");
		}

		$("#note-menu li").off();
		$("#octave-menu li").off();
		$("#mod-menu li").off();
	});

	//STOP
	transportControls.find("#stop").on("click", function () {
		Tone.Transport.stop();
		transport.stop();
		transport.css({
			left: "20rem",
		});
	});
	//MUTE

	$(".gVol").on("click", function () {
		gMute();
	});
	//TRACK MUTE

	$('label[for^="mute_t"]').on("click", function () {
		channels.tracks[$(this).attr("for").split("_")[1]].bus.mute = !$(
			"#" + $(this).attr("for")
		).prop("checked");
	});

	//SOLO TRACK

	//////////////
	////BEATS/////
	//////////////

	let t1 = tracks.find("#t1");

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
				if (
					Math.ceil(event.startOffset) == t &&
					event.value.note == sequ.note
				) {
					drumPart._events.delete(event);
					event.dispose();
				}
			});

			delete data[tn][nn].id[idn];

			delete data[tn][nn].seq[idn];
		}
	});

	//CHECK MARK DEPENDS DATA
	$.each(data, function (it, t) {
		$.each(t, function (ni, n) {
			$.each(n.seq, function (i, s) {
				if (s) {
					if (it !== "t1") {
						$("label[for='" + s.id + "']").attr("data-note-value", s.note);
					}

					channels.tracks[it].part.add(s);
				}
			});
			$.each(n.id, function (i, d) {
				if (d) {
					$("#" + d).prop("checked", true);
				}
			});
		});
	});

	//SET VISUAL VALUE
	$("#l_bpm").val(settings.bpm);

	//SYNTHS

	//OPEN MENU ADD NOTE
	var eX, eY, cNote, cOctave, cLabel;
	$('div[id^="seq_t"] label').on("click", function (e) {
		if ($(this).parent().parent().attr("id") !== "seq_t1") {
			cLabel = $(this);
			if (!$(this).prev().prop("checked")) {
				e.preventDefault();
				$("#note-menu").addClass("hidden");
				$("#octave-menu").addClass("hidden");
				$("#mod-menu").addClass("hidden");
				eX = e.pageX;
				eY = e.pageY;
				$(document).on("keyup", "body", function (e) {
					if (e.key == "Escape") {
						$("#note-menu").addClass("hidden");
					}
				});
				$("#note-menu").removeClass("hidden").css({
					position: "absolute",
					zIndex: 12,
					top: eY,
					left: eX,
				});
			} else {
				//SET DATA
				let id = $(cLabel).attr("for");
				let arr = id.split("_");
				let tn = arr[0];
				let nn = arr[1];
				let idn = arr[2];
				let midi = cNote;
				let duration = "16n";
				let q = (idn - 1) % 4;
				let b = Math.floor((idn - 1) / 4);
				let m = Math.floor((idn - 1) / 16);

				//CREATE SEQUENCE PART

				let sequ = {
					time: m + ":" + b + ":" + q,
					note: midi,
					velocity: 1,
					duration: duration,
					id: id,
				};
				channels.tracks[tn].part._events.forEach((event) => {
					const t = Tone.Time(sequ.time).toTicks();
					if (Math.ceil(event.startOffset) == t && event.value.id == sequ.id) {
						channels.tracks[tn].part._events.delete(event);
						event.dispose();
					}
				});
				delete data[tn][nn].id[idn];

				delete data[tn][nn].seq[idn];

				channels.tracks[tn].part._events.forEach((event) => {
					console.log(event.value);
				});
			}
			if (Tone.Transport.state !== "started") {
				$("#note-menu")
					.find("li")
					.on("mouseenter", function () {
						channels.tracks[
							$(cLabel).attr("for").split("_")[0]
						].synth.triggerAttack($(this).html() + "4");
					});
				$("#note-menu")
					.find("li")
					.on("mouseleave", function () {
						channels.tracks[
							$(cLabel).attr("for").split("_")[0]
						].synth.releaseAll();
					});
			}
		}
	});

	//CHOOSE A NOTE
	$("body").on("click", "#note-menu li", function () {
		$(document).on("keyup", "body", function (e) {
			if (e.key == "Escape") {
				$("#octave-menu").addClass("hidden");
			}
		});
		cNote = $(this).html();
		$("#note-menu").addClass("hidden");
		$("#octave-menu").removeClass("hidden").css({
			position: "absolute",
			zIndex: 12,
			top: eY,
			left: eX,
		});
		if (Tone.Transport.state !== "started") {
			$("#octave-menu")
				.find("li")
				.on("mouseenter", function () {
					channels.tracks[
						$(cLabel).attr("for").split("_")[0]
					].synth.triggerAttack(cNote + $(this).html());
				});
			$("#octave-menu")
				.find("li")
				.on("mouseleave", function () {
					channels.tracks[
						$(cLabel).attr("for").split("_")[0]
					].synth.releaseAll();
				});
		}
	});

	//CHOSE OCTAVE
	$("body").on("click", "#octave-menu li", function () {
		cOctave = $(this).html();
		$("#octave-menu").addClass("hidden");
		$("#mod-menu").removeClass("hidden").css({
			position: "absolute",
			zIndex: 12,
			top: eY,
			left: eX,
		});
		$(document).on("keyup", "body", function (e) {
			if (e.key == "Escape") {
				$("#mod-menu").addClass("hidden");
			}
		});
		if (Tone.Transport.state !== "started") {
			$("#mod-menu")
				.find("li")
				.on("mouseenter", function () {
					if ($(this).html() == "♭") {
						channels.tracks[
							$(cLabel).attr("for").split("_")[0]
						].synth.triggerAttack(cNote + "b" + cOctave);
					} else if ($(this).html() == "⦻") {
						channels.tracks[
							$(cLabel).attr("for").split("_")[0]
						].synth.triggerAttack(cNote + cOctave);
					} else if ($(this).html() == "#") {
						channels.tracks[
							$(cLabel).attr("for").split("_")[0]
						].synth.triggerAttack(cNote + "#" + cOctave);
					}
				});
			$("#mod-menu")
				.find("li")
				.on("mouseleave", function () {
					channels.tracks[
						$(cLabel).attr("for").split("_")[0]
					].synth.releaseAll();
				});
		}
	});

	//CHOOSE MOD
	$("body").on("click", "#mod-menu li", function () {
		cMod = $(this).html();
		if (cMod == "♭") {
			cMod = "b";
		}

		$("#mod-menu").addClass("hidden");
		if (cMod == "⦻") {
			cNote = cNote + cOctave;
		} else {
			cNote = cNote + cMod + cOctave;
		}
		$(cLabel).attr("data-note-value", cNote).prev().prop("checked", true);

		//SET DATA
		let id = $(cLabel).attr("for");
		let arr = id.split("_");
		let tn = arr[0];
		let nn = arr[1];
		let idn = arr[2];
		let midi = cNote;
		let duration = "16n";
		let q = (idn - 1) % 4;
		let b = Math.floor((idn - 1) / 4);
		let m = Math.floor((idn - 1) / 16);

		//CREATE SEQUENCE PART

		let sequ = {
			time: m + ":" + b + ":" + q,
			note: midi,
			velocity: 1,
			duration: duration,
			id: id,
		};
		data[tn][nn].id[idn] = id;
		data[tn][nn].seq[idn] = sequ;
		channels.tracks[tn].part.add(sequ);
	});

	//HIDE MENU
	$("body").on("click", function (e) {
		if (
			!$('div[id^="seq_t"]').is(e.target) &&
			$('div[id^="seq_t"]').has(e.target).length === 0 &&
			!$(".compose-menu").is(e.target) &&
			$(".compose-menu").has(e.target).length === 0
		) {
			$("#note-menu").addClass("hidden");
			$("#octave-menu").addClass("hidden");
			synth1.releaseAll();
		}
	});

	//////////////
	///FUNCTION///
	//////////////

	function saveSettings() {
		let settings = {};

		//ADD DATA
		settings = {
			bpm: Tone.Transport.bpm.value,
			timeSignature: Tone.Transport.timeSignature,
			swing: Tone.Transport.swing,
			step: $("#l_step").val(),
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

		//SAVE DATA

		$.ajax({
			async: true,
			type: "POST",
			url: "php/function/loop.php",
			data: {
				name: header.find("#l_name").val(),
				type: "data",
				data: JSON.stringify(data),
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

	let width = $("#seq_t1").width();
	$(window).resize(function () {
		width = $("#seq_t1").width();
	});
	let bpmSpeed = (60 / (Tone.Transport.bpm.value / 4)) * 1000;
	function transportA(state) {
		if (state == "run") {
			transport.stop();
		} else {
			transport.animate(
				{
					left: "+=" + width,
				},
				bpmSpeed,
				"linear"
			);
			Tone.Transport.scheduleRepeat(
				() => {
					bpmSpeed = (60 / (Tone.Transport.bpm.value / 4)) * 1000;
					transport.stop();
					transport.css({
						left: "20rem",
					});
					transport.animate(
						{
							left: "+=" + width,
						},
						bpmSpeed,
						"linear"
					);
				},
				"1m",
				"1m"
			);
		}
	}
}
;console.clear();

});