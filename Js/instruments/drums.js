const kick = new Tone.Player("./ressources/samples/drums/kick/909.wav");
const snare = new Tone.Player("./ressources/samples/drums/snare/909.wav");
const HHC = new Tone.Player("./ressources/samples/drums/HHC/909.wav");
const HHO = new Tone.Player("./ressources/samples/drums/HHO/909.wav");
const claps = new Tone.Player("./ressources/samples/drums/claps/909.wav");
const tomH = new Tone.Player("./ressources/samples/drums/tomH/909.wav");
const tomM = new Tone.Player("./ressources/samples/drums/tomM/909.wav");
const tomL = new Tone.Player("./ressources/samples/drums/tomL/909.wav");

//CREATE VOL AND PAN

let kickPV = new Tone.PanVol(0, 0);
let snarePV = new Tone.PanVol(0, 0);
let HHCPV = new Tone.PanVol(0, 0);
let HHOPV = new Tone.PanVol(0, 0);
let clapsPV = new Tone.PanVol(0, 0);
let tomHPV = new Tone.PanVol(0, 0);
let tomMPV = new Tone.PanVol(0, 0);
let tomLPV = new Tone.PanVol(0, 0);

//CONNECT PLAYER TO PANVOL

kick.chain(kickPV, Tone.Destination);
snare.chain(snarePV, Tone.Destination);
HHC.chain(HHCPV, Tone.Destination);
HHO.chain(HHOPV, Tone.Destination);
claps.chain(clapsPV, Tone.Destination);
tomH.chain(tomHPV, Tone.Destination);
tomM.chain(tomMPV, Tone.Destination);
tomL.chain(tomLPV, Tone.Destination);
