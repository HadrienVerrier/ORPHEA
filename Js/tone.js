//TONE CONTEXT
Tone.Destination.mute = true;
let firstContext = true;
$(".gVol").on("click", function () {
	if (firstContext) {
		firstContext = false;
		console.log("Audio Context Start");
		const context = new Tone.Context({ latencyHint: "interactive" });
		Tone.setContext(context);
		Tone.context.lookAhead = 0;
	}
	gMute();
});

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
