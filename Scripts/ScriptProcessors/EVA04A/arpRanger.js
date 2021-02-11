const var arpRangeLow = Content.getComponent("arpRangeLow");
const var arpRangeHigh = Content.getComponent("arpRangeHigh");


function onNoteOn()
{
    local arpRnum = Message.getNoteNumber();
    if (arpRnum >= arpRangeLow.getValue() && arpRnum <= arpRangeHigh.getValue())
    {
	    Message.setChannel(1);
    }else{
        Message.setChannel(4);
    }
}
 function onNoteOff()
{
	local arpRnum = Message.getNoteNumber();
    if (arpRnum >= arpRangeLow.getValue() && arpRnum <= arpRangeHigh.getValue())
    {
	    Message.setChannel(1);
    }else{
        Message.setChannel(4);
    }
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
 