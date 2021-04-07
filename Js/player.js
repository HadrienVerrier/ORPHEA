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
