const synth1 = new Tone.PolySynth(Tone.MonoSynth, {
	oscillator: {
		type: "triangle",
	},
	envelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	filter: {
		frequency: "6000",
		gain: 0,
		type: "lowpass",
	},
	filterEnvelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	portamento: 0,
}).connect(bus2);

synth1.volume.value = -6;
const synth1Part = new Tone.Part((time, value) => {
	synth1.triggerAttackRelease(value.note, value.duration, time, value.velocity);
});

synth1Part.loop = true;
synth1Part.swing = 0;
synth1Part.loopEnd = "1:0:0";

channels.tracks.t2.synth = synth1;
channels.tracks.t2.part = synth1Part;

//SYNTH 2
const synth2 = new Tone.PolySynth(Tone.MonoSynth, {
	oscillator: {
		type: "sine",
	},
	envelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	filter: {
		frequency: "2000",
		gain: 0,
		type: "lowpass",
	},
	filterEnvelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	portamento: 0,
}).connect(bus3);

synth2.volume.value = -6;
const synth2Part = new Tone.Part((time, value) => {
	synth2.triggerAttackRelease(value.note, value.duration, time, value.velocity);
});

synth2Part.loop = true;
synth2Part.swing = 0;
synth2Part.loopEnd = "1:0:0";

channels.tracks.t3.synth = synth2;
channels.tracks.t3.part = synth2Part;

//SYNTH 3
const synth3 = new Tone.PolySynth(Tone.MonoSynth, {
	oscillator: {
		type: "square",
	},
	envelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	filter: {
		frequency: "10000",
		gain: 0,
		type: "lowpass",
	},
	filterEnvelope: {
		attack: 0,
		decay: 0,
		sustain: 1,
		release: 0.2,
	},
	portamento: 0,
}).connect(bus4);

synth3.volume.value = -6;
const synth3Part = new Tone.Part((time, value) => {
	synth3.triggerAttackRelease(value.note, value.duration, time, value.velocity);
});

synth3Part.loop = true;
synth3Part.swing = 0;
synth3Part.loopEnd = "1:0:0";

channels.tracks.t4.synth = synth3;
channels.tracks.t4.part = synth3Part;
