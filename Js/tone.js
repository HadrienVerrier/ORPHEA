//TONE CONTEXT
let seqRun = false;
let firstContext = true;

$(".gVol").on("click", function () {
	Tone.start();
	if (firstContext) {
		firstContext = false;
		console.log("Audio Context Start");
		const context = new Tone.Context({ latencyHint: "interactive" });
		Tone.setContext(context);
		Tone.context.lookAhead = 0;
		Tone.Destination.mute = true;
	}
	gMute();
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

function sequencer() {
	Tone.Transport.start();
	drumPart.start();

	// Tone.Transport.scheduleRepeat((time) => {
	// 	console.log(drumPart._events);
	// }, "8n");
}

//FUNCTION
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
