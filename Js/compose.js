if (href == "compose") {
	//GENERAL INIT
	var main = $("body main#compose");
	var header = main.find("header");
	var transportControls = main.find("#transport_controls");
	var transport = main.find(".transport");
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
	var mesure = step / 16;
	var pageTrack = { t1: 1, t2: 1, t3: 1, t4: 1 };

	$('#l_step option[value="' + step + '"]').prop("selected", true);

	if (step == 16) {
		$(".next-page").addClass("hidden");
		$(".previous-page").addClass("hidden");
	} else {
		$(".next-page").removeClass("hidden");
		$(".previous-page").removeClass("hidden");
	}
	pageTrack = { t1: 1, t2: 1, t3: 1, t4: 1 };
	mesure = step / 16;
	$.each(channels.tracks, function (it, t) {
		t.part.loopEnd = mesure + ":0:0";
	});

	$("#l_step").on("change", function () {
		step = $(this).val();
		if (step == 16) {
			$(".next-page").addClass("hidden");
			$(".previous-page").addClass("hidden");
		} else {
			$(".next-page").removeClass("hidden");
			$(".previous-page").removeClass("hidden");
		}
		pageTrack = { t1: 1, t2: 1, t3: 1, t4: 1 };
		mesure = step / 16;
		$.each(channels.tracks, function (it, t) {
			t.part.loopEnd = mesure + ":0:0";
		});
	});

	$(".next-page").on("click", function () {
		let track = $(this).parent().attr("id");
		if (pageTrack[track] === mesure) {
			pageTrack[track] = 0;
		}

		pageTrack[track]++;

		$(this).parent().find('div[id^="seq_t"] input').prop("checked", false);
		$.each(data, function (ti, t) {
			$.each(t, function (ni, n) {
				$.each(n.seq, function (si, s) {
					if (s) {
						if (s.time.split(":")[0] == pageTrack[track] - 1) {
							let timeSplit = s.time.split(":");
							let p = parseInt(timeSplit[1]) * 4 + 1 + parseInt(timeSplit[2]);
							$("#t" + ti.split("")[1] + "_" + ni + "_" + p).prop(
								"checked",
								true
							);
						}
					}
				});
			});
		});
	});
	$(".previous-page").on("click", function () {
		let track = $(this).parent().attr("id");
		if (pageTrack[track] === 1) {
			pageTrack[track] = mesure + 1;
		}
		pageTrack[track]--;
		$(this).parent().find('div[id^="seq_t"] input').prop("checked", false);
		$.each(data, function (ti, t) {
			$.each(t, function (ni, n) {
				$.each(n.seq, function (si, s) {
					if (s) {
						if (s.time.split(":")[0] == pageTrack[track] - 1) {
							let timeSplit = s.time.split(":");
							let p = parseInt(timeSplit[1]) * 4 + 1 + parseInt(timeSplit[2]);
							$("#t" + ti.split("")[1] + "_" + ni + "_" + p).prop(
								"checked",
								true
							);
						}
					}
				});
			});
		});
	});

	//SET VISUAL VALUE
	$("#l_bpm").val(settings.bpm);

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
		if (Tone.Transport.state == "started") {
			$("#l_step").attr("disabled", true);
		} else {
			$("#l_step").attr("disabled", false);
		}
	});

	//STOP
	transportControls.find("#stop").on("click", function () {
		stopSequencer();
		transport.stop();
		state = "run";
		transport.css({
			left: "0",
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
	let t1 = tracks.find("#t1");
	//////////////
	////BEATS/////
	//////////////

	t1.find("#seq_t1 label").on("click", function () {
		//SET DATA
		let id = $(this).attr("for");

		let arr = id.split("_");
		let tn = arr[0];
		let nn = arr[1];
		let idn = arr[2];
		let Ridn = parseInt(arr[2]) + 16 * (pageTrack[tn] - 1);
		let rId = tn + "_" + nn + "_" + Ridn;
		let midi = data[tn][nn].midi;
		let q = (idn - 1) % 4;
		let b = Math.floor((idn - 1) / 4);
		let m = Math.floor((idn - 1) / 16) + pageTrack[tn] - 1;
		//CREATE SEQUENCE PART

		let sequ = {
			time: m + ":" + b + ":" + q,
			note: midi,
			velocity: 1,
		};

		if ($(this).prev().prop("checked") ? false : true) {
			//UPDATE DATA
			data[tn][nn].id[Ridn] = rId;

			data[tn][nn].seq[Ridn] = sequ;

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

			delete data[tn][nn].id[Ridn];

			delete data[tn][nn].seq[Ridn];
		}
		console.log(data);
	});

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
				let Ridn = parseInt(arr[2]) + 16 * (pageTrack[tn] - 1);
				let rId = tn + "_" + nn + "_" + Ridn;
				let midi = cNote;
				let duration = "16n";
				let q = (idn - 1) % 4;
				let b = Math.floor((idn - 1) / 4);
				let m = Math.floor((idn - 1) / 16) + pageTrack[tn] - 1;

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
				delete data[tn][nn].id[Ridn];

				delete data[tn][nn].seq[Ridn];

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
		let Ridn = parseInt(arr[2]) + 16 * (pageTrack[tn] - 1);
		let rId = tn + "_" + nn + "_" + Ridn;
		let idn = arr[2];
		let midi = cNote;
		let duration = "16n";
		let q = (idn - 1) % 4;
		let b = Math.floor((idn - 1) / 4);
		let m = Math.floor((idn - 1) / 16) + pageTrack[tn] - 1;

		//CREATE SEQUENCE PART

		let sequ = {
			time: m + ":" + b + ":" + q,
			note: midi,
			velocity: 1,
			duration: duration,
			id: id,
		};
		//UPDATE DATA
		data[tn][nn].id[Ridn] = rId;
		data[tn][nn].seq[Ridn] = sequ;
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
						left: "0",
					});
					transport.animate(
						{
							left: "+=" + width,
						},
						bpmSpeed,
						"linear"
					);
				},
				mesure + "m",
				mesure + "m"
			);
		}
	}
}
