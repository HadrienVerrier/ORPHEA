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
