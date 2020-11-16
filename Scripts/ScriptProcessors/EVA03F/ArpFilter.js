const var isArpOn = Content.getComponent("isArpOn");
const var isIgnoreOn = Content.getComponent("isIgnoreOn");


function onNoteOn()
{
    
    if (isArpOn.getValue())
    {
        
        if (isIgnoreOn.getValue())
        {
            //Console.print("arpfilter;" + isArpOn.getValue());
            if (Message.isArtificial() == 0)
            {
                Message.ignoreEvent(true);
            }
        }
    }

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
 