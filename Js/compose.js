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

//////////////
/////MIDI/////
//////////////

WebMidi.enable(function (err) {
	if (err) {
		// console.log("WebMidi could not be enabled.", err);
	} else {
		// console.log("WebMidi enabled!");
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
	let t1Channel;
	tracks.find("#midi_input_t1").on("change", function () {
		let t1Input = WebMidi.inputs[$(this).val().split("-")[1]];
		tracks.find("#midi_channel_t1").on("change", function () {
			t1Input.removeListener("noteon");
			t1Channel = parseFloat($(this).val().split("_")[2]);

			t1Input.addListener("noteon", t1Channel, (e) => {
				note = e.note.name + e.note.octave;
				drumKit.triggerAttackRelease(note, "16n", "+0", e.velocity);
			});
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
		Tone.Transport.state !== "started" ? transportA("run") : transportA("stop");
	} else {
		sequencer();
		transport.removeClass("hidden");
		Tone.Transport.state !== "started" ? transportA("run") : transportA("stop");
	}
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
			if (event.startOffset == t && event.value.note == sequ.note) {
				drumPart._events.delete(event);
				event.dispose();
			}
		});

		delete data[tn][nn].id[idn];

		delete data[tn][nn].seq[idn];
	}
});

//CHECK MARK DEPENDS DATA
$.each(data.t1, function (ni, n) {
	$.each(n.seq, function (i, s) {
		if (s) drumPart.add(s);
	});
	$.each(n.id, function (i, d) {
		if (d) {
			$("#" + d).prop("checked", true);
		}
	});
});

//SET VISUAL VALUE
$("#l_bpm").val(settings.bpm);
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
				console.log(bpmSpeed);
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
