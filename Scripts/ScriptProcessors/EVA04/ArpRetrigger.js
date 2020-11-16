 const var Arpeggiator1 = Synth.getMidiProcessor("Arpeggiator1");
 
 reg lastNoteOff = 0;function onNoteOn()
{
	local thisTime = Engine.getUptime();
	
	if(lastNoteOff != 0 && thisTime - lastNoteOff > 0.1)
    {
        Arpeggiator1.setAttribute(Arpeggiator1.Hold, 0);
        
    }
}
 function onNoteOff()
{
	lastNoteOff = Engine.getUptime();
	Arpeggiator1.setAttribute(Arpeggiator1.Hold, 1);
	
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
 