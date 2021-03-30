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
