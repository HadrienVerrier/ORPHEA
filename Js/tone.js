//TONE CONTEXT
let firstContext = true;

//IMPORT DATA & SETTINGS
let href = location.href.split("/");
href = href[href.length - 1].split(".")[0];

let data = $("[data-data-song]");
if (data.length == 0) {
	console.log("test");
	data =
		'{"t1":{"n1":{"seq":[],"id":{}, "midi": "C2" },"n2":{"seq":[],"id":{}, "midi": "D2"},"n3":{"seq":[],"id":{}, "midi": "Gb2"},"n4":{"seq":[],"id":{}, "midi": "Bb2"},"n5":{"seq":[],"id":{}, "midi": "F2"},"n6":{"seq":[],"id":{}, "midi": "A2"},"n7":{"seq":[],"id":{}, "midi": "C3"},"n8":{"seq":[],"id":{}, "midi": "Eb2"}},"t2":{"n1":{"seq":[],"id":{}},"n2":{"seq":[],"id":{}},"n3":{"seq":[],"id":{}},"n4":{"seq":[],"id":{}},"n5":{"seq":[],"id":{}},"n6":{"seq":[],"id":{}},"n7":{"seq":[],"id":{}},"n8":{"seq":[],"id":{}}},"t3":{"n1":{"seq":[],"id":{}},"n2":{"seq":[],"id":{}},"n3":{"seq":[],"id":{}},"n4":{"seq":[],"id":{}},"n5":{"seq":[],"id":{}},"n6":{"seq":[],"id":{}},"n7":{"seq":[],"id":{}},"n8":{"seq":[],"id":{}}},"t4":{"n1":{"seq":[],"id":{}},"n2":{"seq":[],"id":{}},"n3":{"seq":[],"id":{}},"n4":{"seq":[],"id":{}},"n5":{"seq":[],"id":{}},"n6":{"seq":[],"id":{}},"n7":{"seq":[],"id":{}},"n8":{"seq":[],"id":{}}}}';
	data = JSON.parse(data);
} else {
	data = JSON.parse($(data).attr("data-data-song"));
}

let settings = $("[data-settings]");
if (settings.length == 0) {
	settings = '{"bpm" : "120","timeSignature" : "4","swing" : "0"}';
	settings = JSON.parse(settings);
} else {
	settings = JSON.parse($(settings).attr("data-settings"));
}

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
	} else if (Tone.Transport.state == "paused") {
		Tone.Transport.start();
	} else {
		Tone.Transport.pause();
	}

	Tone.Transport.scheduleRepeat(animPlay, "8n");
}

//CREATE TRACK

let master = new Tone.Channel().toDestination();

let bus1 = new Tone.Channel().connect(master);
let bus2 = new Tone.Channel().connect(master);
let bus3 = new Tone.Channel().connect(master);
let bus4 = new Tone.Channel().connect(master);

let channels = {
	master: master,
	tracks: { t1: bus1, t2: bus2, t3: bus3, t4: bus4 },
};
//FUNCTION

function createToneContext() {
	if (firstContext) {
		firstContext = false;
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
