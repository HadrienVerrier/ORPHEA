$(document).ready(function () {
	//GENERAL INIT
	var main = $("body main#compose");
	var header = main.find("header");
	var transportControls = main.find("#transport_controls");
	var transport = main.find("#transportMark");
	var tracks = main.find("#tracks");

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
				$("#l_name").val(data);
				$("#l_name").attr("data-name", data);
			},
		});
	});
});
