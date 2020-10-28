
const var IRREPercent1 = Content.getComponent("IRREPercent1");
const var IRREEQPercent = Content.getComponent("IRREEQPercent");
const var IRREPitchPercent = Content.getComponent("IRREPitchPercent");

const var IRREEQMASTER = Synth.getEffect("IRREEQMASTER");
const var IRREPitch1 = Synth.getModulator("IRREPitch1");
const var IRREPitch2 = Synth.getModulator("IRREPitch2");
const var IRREPitch3 = Synth.getModulator("IRREPitch3");
const var IRREPitch4 = Synth.getModulator("IRREPitch4");
const var IRREPitch5 = Synth.getModulator("IRREPitch5");
const var IRREPitch6 = Synth.getModulator("IRREPitch6");
const var IRREPitch7 = Synth.getModulator("IRREPitch7");
const var IRREPitch8 = Synth.getModulator("IRREPitch8");
const var IRREPitch10 = Synth.getModulator("IRREPitch9");
const var IRREPitch9 = Synth.getModulator("IRREPitch10");function onNoteOn()
{
	local eqdx = 0 * IRREEQMASTER.BandOffset + IRREEQMASTER.Gain;
	local rnd = ((Math.random()* 16) - 8) * IRREEQPercent.getValue();
	IRREEQMASTER.setAttribute(eqdx, rnd);
	
	local frqx = 0 * IRREEQMASTER.BandOffset + IRREEQMASTER.Freq; 
	local frqrnd = 100 + ((Math.random()* 4000)) * IRREEQPercent.getValue();
	IRREEQMASTER.setAttribute(frqx, frqrnd);
	
	rnd = ((Math.random()* 2) - 1) * IRREPitchPercent.getValue();
	IRREPitch1.setIntensity(rnd);
	IRREPitch2.setIntensity(rnd);
	IRREPitch3.setIntensity(rnd);
	IRREPitch4.setIntensity(rnd);
	IRREPitch5.setIntensity(rnd);
	IRREPitch6.setIntensity(rnd);
	IRREPitch7.setIntensity(rnd);
	IRREPitch8.setIntensity(rnd);
	IRREPitch9.setIntensity(rnd);
	IRREPitch10.setIntensity(rnd);
}
 function onNoteOff()
{
	
}
 function onController()
{
	
}
 function onTimer()
{
	
}
 function onControl(number, value)
{
	
}
 