Content.setWidth(730);
Content.setHeight(100);

const var P_NUM_VOICES = 10;
const var bypass = Content.addButton("Bypass", 10, 10);

const var time = Content.addKnob("Time", 160, 0);
time.setRange(0, 300, 0.01);
const var amtUP = Content.addKnob("U Amt", 290, 0);
amtUP.setRange(0.2, 12, 0.1);
const var amtDOWN= Content.addKnob("D Amt",420, 0);
amtDOWN.setRange(0.2, 12, 0.1);
const var portaAttack = Content.addKnob("P Atk",160, 45);
portaAttack.setRange(0, 600, 1);
const var PortaSplit = Content.getComponent("PortaSplit");

const var AllKeys = Content.getComponent("AllKeys");

var PEnvs = [];
reg NoteIDs = [];
reg LastNote = -1;

for (pi = 0; pi < P_NUM_VOICES;pi++)
{
    PEnvs[pi] = Synth.getModulator("PortaEnvelope" + (pi + 1));
}

//const var PortaEnv2 = Synth.getModulator("PortaEnvelope2");
function onNoteOn()
{
    if(bypass.getValue() == 0)
    {
        if (Message.getNoteNumber() >= PortaSplit.getValue())
        {
            //Console.print("NOTE ON LEGATO:" + Synth.isLegatoInterval());
            if (Synth.isLegatoInterval())
            {
                local dif = LastNote - Message.getNoteNumber();
                if (AllKeys.getValue() == 1 && Synth.isLegatoInterval() == false)
                {
                    dif = 2;
                }
                if (dif > 0 && dif > amtUP.getValue())
                {
                    dif = amtUP.getValue();
                }
        
                if (dif < 0 && dif < (amtDOWN.getValue() * -1))
                {
                    dif = amtDOWN.getValue() * -1;
                }
                //Message.setTransposeAmount(12);
                //Message.setStartOffset(28000);
                NoteIDs[Message.getNoteNumber()] = Message.makeArtificial();
                dif = dif * -1;
                Synth.addPitchFade(NoteIDs[Message.getNoteNumber()], 0, dif * -1,0);
            
                //Console.print("Playing ID:" + NoteIDs[Message.getNoteNumber()]);
                //Console.print("playing:"+ NoteIDs[Message.getNoteNumber()] + " DIF:" + dif);
                Synth.addPitchFade(NoteIDs[Message.getNoteNumber()], time.getValue(),0,0);
                for(pi = 0; pi < P_NUM_VOICES; pi++)
                {
                    PEnvs[pi].setAttribute(PEnvs[pi].Attack, portaAttack.getValue());
                }
                // PortaEnv1.setAttribute(PortaEnv1.Attack, portaAttack.getValue());
                //PortaEnv2.setAttribute(PortaEnv2.Attack, portaAttack.getValue());
            }else{
                for(pi = 0; pi < P_NUM_VOICES; pi++)
                {
                    PEnvs[pi].setAttribute(PEnvs[pi].Attack, 0);
                }
            }
            LastNote = Message.getNoteNumber();
        }else{
            for(pi = 0; pi < P_NUM_VOICES; pi++)
            {
                PEnvs[pi].setAttribute(PEnvs[pi].Attack, 0);
            }

        }
    }
}
 function onNoteOff()
{
    if(bypass.getValue() == 0)
    {
    if (Message.getNoteNumber() >= PortaSplit.getValue())
    {
        local noteCount = 0;
        //Console.print("NOTE OFFFFFFF LEGATO:" + Synth.isLegatoInterval());
        if (typeof(NoteIDs[Message.getNoteNumber()]) != "undefined")
        {
            if (NoteIDs[Message.getNoteNumber()] != -1)
            {
                Synth.noteOffByEventId(NoteIDs[Message.getNoteNumber()]);
                NoteIDs[Message.getNoteNumber()] = -1;
            }
        
        }
        //Console.print("ending:"+ NoteIDs[Message.getNoteNumber()]);
        for (i = 0; i <128; i++)
        {
            noteCount = noteCount + Synth.isKeyDown(i);
        }
        if (noteCount == 0)
            LastNote = -1;
        
    }
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
 