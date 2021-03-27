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

//SEQUENCER

let step;

function sequencer() {
	let index = 0;
	let stepNumber = 16;
	let stepNote = stepNumber.toString() + "n";
	Tone.Transport.scheduleRepeat(repeat, stepNote);

	function repeat(time) {
		step = index % stepNumber;
		console.log(step);
		index++;
	}
	Tone.Transport.start();
}

//SAVE DATA
let data = {
	track_1: {
		n1: {},
		n2: {},
		n3: {},
		n4: {},
		n5: {},
		n6: {},
		n7: {},
		n8: {},
	},
};

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
