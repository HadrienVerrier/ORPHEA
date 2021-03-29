const drumKit = new Tone.Sampler({
	urls: {
		C2: "./ressources/samples/drums/kick/909.wav",
		D2: "./ressources/samples/drums/snare/909.wav",
		Eb2: "./ressources/samples/drums/claps/909.wav",
		F2: "./ressources/samples/drums/tomL/909.wav",
		Gb2: "./ressources/samples/drums/HHC/909.wav",
		A2: "./ressources/samples/drums/tomM/909.wav",
		Bb2: "./ressources/samples/drums/HHO/909.wav",
		C3: "./ressources/samples/drums/tomH/909.wav",
	},
}).toDestination();
// drumKit.sync();

const drumPart = new Tone.Part((time, value) => {
	drumKit.triggerAttackRelease(value.note, "16n", time, value.velocity);
});

drumPart.loop = true;
drumPart.swing = 0;
drumPart.loopEnd = "1:0:0";
