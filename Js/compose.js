$(document).ready(function () {
	//GENERAL INIT
	var main = $("body main#compose");
	var header = main.find("header");
	var transportControls = main.find("#transport_controls");
	var transport = main.find("#transportMark");
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
					tags = jQuery.grep(tags, function (value) {
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

		// let mySelect = document.querySelector("#miniMoon select");
		// let options = document.querySelector("#miniMoon select").options;
		// for (let i = options.length - 1; i > 0; i--) {
		// 	options[i] = null;
		// }
		// WebMidi.inputs.forEach((input) => {
		// 	let option = document.createElement("option");
		// 	option.text = input.name;
		// 	option.id = input.id;
		// 	mySelect.options.add(option, 1);
		// });
	}
});
