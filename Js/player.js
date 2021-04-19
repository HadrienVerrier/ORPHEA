let loopLoad = false;

//OPEN PLAYER
$("#player-open").on("click", togglePlayer);
$("body").on("click", 'a[data-translate="index_listen_button"]', function () {
	togglePlayer();
});
//SEARCH BAR
$("#searchbar").on("input", function () {
	if (!$(this).val()) {
		$("#results").addClass("empty");
		$.ajax({
			url: "php/function/player.php",
			data: { type: "galaxy", mode: "get" },
			type: "POST",
			success: function (data) {
				$("#galaxy").replaceWith(data);
			},
		});
	} else {
		getDataPlayer($(this).val());
		$("#results").removeClass("empty");
	}
});

function getDataPlayer(input) {
	$.ajax({
		async: true,
		url: "php/function/player.php",
		data: { type: "input", wich: "song", input: input },
		type: "POST",
		success: function (data) {
			if (data == "void") {
				$("#songs").hide();
			} else {
				$("#songs").show().replaceWith(data);
			}
		},
	});
	$.ajax({
		async: true,
		url: "php/function/player.php",
		data: { type: "input", wich: "author", input: input },
		type: "POST",
		success: function (data) {
			if (data == "void") {
				$("#author").hide();
			} else {
				$("#author").show().replaceWith(data);
			}
		},
	});
	$.ajax({
		async: true,
		url: "php/function/player.php",
		data: { type: "input", wich: "tag", input: input },
		type: "POST",
		success: function (data) {
			if (data == "void") {
				$("#tags").hide();
			} else {
				$("#tags").show().replaceWith(data);
			}
		},
	});
	$.ajax({
		async: true,
		url: "php/function/player.php",
		data: { type: "input", wich: "galaxy", input: input },
		type: "POST",
		success: function (data) {
			if (data == "void") {
				$("#galaxy").hide();
			} else {
				$("#galaxy").show().replaceWith(data);
			}
		},
	});
}
//OPEN PLAYER AND CLOSE
function togglePlayer() {
	if ($("#player-container").hasClass("close")) {
		$("#player-container").removeClass("close").addClass("open");
	} else {
		$("#player-container").removeClass("open").addClass("close");
	}
}

if (log()) {
	$("#galaxy").show();
} else {
	$("#galaxy").hide();
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
//
$(document).on("click", ".gPlay", function () {
	if (loopLoad) {
		sequencer();
		Tone.Transport.state !== "started" ? transportP("run") : transportP("stop");
	}
});
//GET DATA FROM LOOP AND PLAY IT
$(document).on("click", ".song-list-controls svg:first-of-type", function () {
	if (!loopLoad) loopLoad = true;
	getLoop($(this).parent().parent().attr("id").split("-")[1]);
});

if (href !== "compose") {
	getLoop(79);

	loopLoad = true;

	gMute();
}

$(document).on("click", ".gVol", gMute);

//ADD TO GALAXY

$(document).on(
	"click",
	"#songs .song-list-controls svg:last-of-type",
	function () {
		if (log()) {
			let elm = $(this);
			if ($(this).hasClass("toAdd")) {
				$(this).removeClass("toAdd").addClass("added");

				$.ajax({
					url: "php/function/player.php",
					data: {
						type: "galaxy",
						mode: "add",
						loopID: $(elm).parent().parent().attr("id").split("-")[1],
					},
					type: "POST",
					success: function (data) {
						let x =
							'<svg class="added" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Remove to my Galaxy</title><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/></svg>';
						$(elm).replaceWith(x);
						getDataPlayer($("#searchbar").val());
					},
				});
			} else if ($(this).hasClass("added")) {
				$(this).addClass("toAdd").removeClass("added");
				$.ajax({
					url: "php/function/player.php",
					data: {
						type: "galaxy",
						mode: "delete",
						loopID: $(elm).parent().parent().attr("id").split("-")[1],
					},
					type: "POST",
					success: function (data) {
						let x =
							'<svg class="toAdd" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Add to my Galaxy</title><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z" /></svg>';
						$(elm).replaceWith(x);
						getDataPlayer($("#searchbar").val());
					},
				});
			}
		}
	}
);
$(document).on(
	"click",
	"#galaxy .song-list-controls svg:last-of-type",
	function () {
		if (log()) {
			let elm = $(this);

			$(this).addClass("toAdd").removeClass("added");
			$.ajax({
				url: "php/function/player.php",
				data: {
					type: "galaxy",
					mode: "delete",
					loopID: $(elm).parent().parent().attr("id").split("-")[1],
				},
				type: "POST",
				success: function (data) {
					$(elm).parent().parent().parent().remove();
				},
			});
		}
	}
);
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

			Tone.Transport.state !== "started" ? transportP("run") : transportP("stop");
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
function transportP(state) {
	let bpmSpeed = (60 / (Tone.Transport.bpm.value / 4)) * 1000;
	if (state == "run") {
		$("#timebar span").stop();
		$("#timebar div").stop();
	} else {
		//BAR
		$("#timebar div").animate(
			{
				width: "100%",
			},
			bpmSpeed * mesure,
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
					bpmSpeed * mesure,
					"linear"
				);
			},
			mesure + "m",
			mesure + "m"
		);
		//POINT
		$("#timebar span").animate(
			{
				left: "100%",
			},
			bpmSpeed * mesure,
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
					bpmSpeed * mesure,
					"linear"
				);
			},
			mesure + "m",
			mesure + "m"
		);
	}
}
