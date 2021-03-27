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

//SEQUENCER

let step;

function sequencer() {
	seqRun = true;
	let index = 0;
	let stepNumber = 16;
	let stepNote = stepNumber.toString() + "n";

	Tone.Transport.scheduleRepeat(repeat, stepNote);

	function repeat(time) {
		step = index % stepNumber;
		index++;
		//DRUMS

		$.each(data.t1, function (i, n) {
			$.each(n, function (key, value) {
				if (key == step + 1 && value) {
					switch (i) {
						case "n1":
							kick.start(time);
							break;
						case "n2":
							snare.start(time);
							break;
						case "n3":
							HHC.start(time);
							break;
						case "n4":
							HHO.start(time);
							break;
						case "n5":
							tomL.start(time);
							break;
						case "n6":
							tomM.start(time);
							break;
						case "n7":
							tomH.start(time);
							break;
						case "n8":
							claps.start(time);
							break;
					}
				}
			});
		});
	}
	Tone.Transport.start();
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
