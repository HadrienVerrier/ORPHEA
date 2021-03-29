//TONE CONTEXT
let firstContext = true;

//IMPORT DATA & SETTINGS
let data = $("[data-data-song]");
data = JSON.parse($(data).attr("data-data-song"));
let settings = $("[data-settings]");
settings = JSON.parse($(settings).attr("data-settings"));

//START AUDIO
$(document).on("click", async () => {
	if (typeof context === "undefined") {
		await Tone.start();
		createToneContext();
	}
});

//SEQUENCER

Tone.Transport.bpm.value = settings.bpm;
Tone.Transport.timeSignature = settings.timeSignature;
Tone.Transport.swing = settings.swing;
let gPlayState = true;
function sequencer() {
	if (Tone.Transport.state == "stopped") {
		Tone.Transport.start();
		drumPart.start();
		console.log(Tone.Transport.state);
	} else if (Tone.Transport.state == "paused") {
		Tone.Transport.start();
		console.log(Tone.Transport.state);
	} else {
		Tone.Transport.pause();
		console.log(Tone.Transport.state);
	}

	Tone.Transport.scheduleRepeat(animPlay, "8n");
}

//FUNCTION

function createToneContext() {
	if (firstContext) {
		firstContext = false;
		console.log("Audio Context Start");
		const context = new Tone.Context({ latencyHint: "interactive" });
		Tone.setContext(context);
		Tone.context.lookAhead = 0;
		Tone.Destination.mute = true;
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
