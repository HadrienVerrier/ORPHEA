$(document).ready(function () {
	//GENERAL INIT
	var main = $("body main#compose");
	var header = main.find("header");
	var transportControls = main.find("#transport_controls");
	var transport = main.find("#transportMark");
	var tracks = main.find("#tracks");

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
			success: function (data) {
				console.log(data);
			},
		});
	});

	//CHANGE BPM
	header.find("#l_bpm").on("change", function () {
		saveSettings();
	});

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
			success: function (data) {
				console.log(data);
			},
		});
	}
});
