//TONE CONTEXT
let firstContext = true;

//START AUDIO

$(document).on("click", async () => {
	if (typeof context === "undefined") {
		await Tone.start();
		createToneContext();
	}
});

/////////////
//SAVE DATA//
/////////////

//INIT
let data = {
	t1: {
		n1: { seq: [], id: {}, midi: "C2" },
		n2: { seq: [], id: {}, midi: "D2" },
		n3: { seq: [], id: {}, midi: "Gb2" },
		n4: { seq: [], id: {}, midi: "Bb2" },
		n5: { seq: [], id: {}, midi: "F2" },
		n6: { seq: [], id: {}, midi: "A2" },
		n7: { seq: [], id: {}, midi: "C3" },
		n8: { seq: [], id: {}, midi: "Eb2" },
	},
};

//SEQUENCER

Tone.Transport.bpm.value = 120;
Tone.Transport.timeSignature = 4;
Tone.Transport.swing = 0;
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
