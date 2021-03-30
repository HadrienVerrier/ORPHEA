const synth1 = new Tone.PolySynth(Tone.MonoSynth, {
	oscillator: {
		type: "triangle",
	},
	enveloppe: {
		attack: 0,
		decay: 0,
		sustain: 0,
		release: 0,
	},
	filter: {
		frequency: "1000",
		gain: 0,
		type: "lowpass",
	},
	filterEnveloppe: {
		attack: 0,
		decay: 0,
		sustain: 0,
		release: 0,
	},
	portamento: 0,
}).connect(bus2);

const synth1Part = new Tone.Part((time, value) => {
	synth1.triggerAttackRelease(value.note, value.duration, time, value.velocity);
});

synth1Part.loop = true;
synth1Part.swing = 0;
synth1Part.loopEnd = "1:0:0";
