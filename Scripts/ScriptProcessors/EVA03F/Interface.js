Content.makeFrontInterface(750, 512);

Engine.loadFontAs("{PROJECT_FOLDER}Arial.ttf", "Arial");
Engine.setGlobalFont("Arial");


// -------------- Authorisation----------------------------

include("Authorisation.js");



function clearArpArray()
{
    /*for(n=0;n<arpInboundIDs.length;n++)
    {
        // clear each note ID
        Synth.noteOffByEventId(arpInboundIDs[n]);
        arpInboundIDs.remove(n);
    }
    */
}

function closeAllPanels()
{
    reg fdx;
    for (fdx = 0;fdx<NUM_VOICES;fdx++)
    {
        theFXPanels[fdx].showControl(false);
    };
    EnvelopePanel.showControl(false);
    FilterPanel.showControl(false);
    ShapePanel.showControl(false);
    ReverbPanel.showControl(false);
    
    MasterFXPanelCollection.showControl(false);
    
}

// THINGS THAT NEED TO CHANGE

const var NUM_VOICES = 10;
var VoiceNames = ["BRIGHT ACOUSTIC","60S ACOUSTIC","PALM MUTE ACOUSTIC","12 STRING","MANDOLIN","UKELELE HYBRID","70'S ELECTRIC (MIC)","HARMONICS","FINGERPICKED","PERCUSSIVE"];
// LOOK LATER FOR THE FIXED SAMPLER LOADING.. @ line 230


// array holders
var TheSamplers = [];
var TheEnvelopes = [];
var ThePortaEnvelopes = [];
var TheGainMods = [];
var ThePitchMods = [];
var TheVeloMods = [];


// arp array.
var arpHeldIDs = [];
var pressK = 0;
var firstID = 0;



// single instance UI
const var EffectsPanel = Content.getComponent("EffectsPanel");
const var ModsPanel = Content.getComponent("ModsPanel");
const var ArpPanel = Content.getComponent("ArpPanel");

const var VUPanel = Content.getComponent("VUPanel");
const var LeftMasterVU = Content.getComponent("LeftMasterVU");
const var RightMasterVU = Content.getComponent("RightMasterVU");
const var GainMaster = Synth.getEffect("GainMaster");

const var Attack = Content.getComponent("Attack");
const var EnvPanelAttack = Content.getComponent("EnvPanelAttack");
const var Release = Content.getComponent("Release");
const var EnvPanelRelease = Content.getComponent("EnvPanelRelease");

const var CutOff = Content.getComponent("CutOff");
const var PanelFilterCutoff = Content.getComponent("PanelFilterCutoff");
const var Drive = Content.getComponent("Drive");
const var ShapePanelDrive = Content.getComponent("ShapePanelDrive");
const var Reverb = Content.getComponent("Reverb");
const var ReverbPanelAmt = Content.getComponent("ReverbPanelAmt");





VUPanel.setTimerCallback(function()
{
    //Console.print(Engine.getDecibelsForGainFactor(GainMaster.getCurrentLevel(0)));
    LeftMasterVU.setValue(Engine.getDecibelsForGainFactor(GainMaster.getCurrentLevel(0)));
    RightMasterVU.setValue(Engine.getDecibelsForGainFactor(GainMaster.getCurrentLevel(1)));
}
);
VUPanel.startTimer(100);

var theVolumeVoices = [];
var theSimpleGains = [];
var theMasterPitches = [];
// back end mods and fx 
var theEQs = [];
var theComps = [];
var theMuters = [];
// controls for these fx
var theEQSelectors = []; 
var theCompSelectors = [];
var theVoxSelectors = [];

var theFXLaunchers = [];
var theFXDismisses = [];
var theNamedVoices = [];

var theFXPanels = [];
var theEQPanels = [];
var theCompPanels= [];
var theVoxPanels= [];

var theEQLoShelfFreqs = [];
var theEQLoShelfQs = [];
var theEQLoShelfGains = [];
var theEQLoMidFreqs = [];
var theEQLoMidQs = [];
var theEQLoMidGains = [];
var theEQHiMidFreqs = [];
var theEQHiMidQs = [];
var theEQHiMidGains = [];
var theEQHiMidFreqs = [];
var theEQHiShelfFreqs = [];
var theEQHiShelfQs = [];
var theEQHiShelfGains = [];

var theCompOnOffs  = [];
var theCompThresholds = [];
var theCompAttacks = [];
var theCompReleases = [];
var theCompRatios = [];
var theCompMakeups = [];

var theVoxPans = [];
var theVoxWidths = [];
var theVoxDelays = [];



// load these up...
for (idx=0;idx<NUM_VOICES;idx++)
{
    theEQs[idx] = Synth.getEffect("EQ" + (idx+1));
    theComps[idx] = Synth.getEffect("Dynamics" + (idx+1));
    theMuters[idx] = Synth.getMidiProcessor("MidiMuter" + (idx+1));
    
    theVolumeVoices[idx] = Content.getComponent("VolumeVoice" + idx);
    theVolumeVoices[idx].setControlCallback(onVolumeVoiceControl);
    theSimpleGains[idx] = Synth.getEffect("Simple Gain" + (idx +1));

    theMasterPitches[idx] = Synth.getModulator("MasterPitch" + (idx +1));
    
    theFXLaunchers[idx] = Content.getComponent("FXLaunchVoice" + idx);
    theFXLaunchers[idx].setControlCallback(onFXLaunchControl);
    theFXPanels[idx] = Content.getComponent("FXPanelVoice" + idx);
    theFXDismisses[idx ] = Content.getComponent("FXDismissVoice" + idx);
    theNamedVoices[idx] = Content.getComponent("NamedVoice" + idx);
    theFXDismisses[idx].setControlCallback(onFXDismissControl);
    theEQSelectors[idx] = Content.getComponent("EQSelectorVoice" + idx);
    theEQSelectors[idx].setControlCallback(onEQSelectorControl);
    theCompSelectors[idx] = Content.getComponent("CompSelectorVoice" + idx);
    theCompSelectors[idx].setControlCallback(onCompSelectorControl);
    
    theVoxSelectors[idx] = Content.getComponent("VoiceElementSelector" + idx);
    theVoxSelectors[idx].setControlCallback(onVoxSelectorControl);
    
    
    theEQPanels[idx] = Content.getComponent("EQPanel" + idx);
    theCompPanels[idx] = Content.getComponent("CompPanel" + idx);
    theVoxPanels[idx] = Content.getComponent("VoiceElementPanel" + idx);
    
    theEQLoShelfFreqs[idx] = Content.getComponent("LoShelfFreqVoice" + idx);
    theEQLoShelfFreqs[idx].setControlCallback(onEQLoShelfFreqControl);
    theEQLoShelfQs[idx] = Content.getComponent("LoShelfQVoice" + idx);
    theEQLoShelfQs[idx].setControlCallback(onEQLoShelfQControl);
    theEQLoShelfGains[idx] = Content.getComponent("LoShelfGainVoice" + idx);
    theEQLoShelfGains[idx].setControlCallback(onEQLoShelfGainControl);

    theEQLoMidFreqs[idx] = Content.getComponent("LoMidFreqVoice" + idx);
    theEQLoMidFreqs[idx].setControlCallback(onEQLoMidFreqControl);
    theEQLoMidQs[idx] = Content.getComponent("LoMidQVoice" + idx);
    theEQLoMidQs[idx].setControlCallback(onEQLoMidQControl);
    theEQLoMidGains[idx] = Content.getComponent("LoMidGainVoice" + idx);
    theEQLoMidGains[idx].setControlCallback(onEQLoMidGainControl);

    theEQHiMidFreqs[idx] = Content.getComponent("HiMidFreqVoice" + idx);
    theEQHiMidFreqs[idx].setControlCallback(onEQHiMidFreqControl);
    theEQHiMidQs[idx] = Content.getComponent("HiMidQVoice" + idx);
    theEQHiMidQs[idx].setControlCallback(onEQHiMidQControl);
    theEQHiMidGains[idx] = Content.getComponent("HiMidGainVoice" + idx);
    theEQHiMidGains[idx].setControlCallback(onEQHiMidGainControl);
    
    theEQHiShelfFreqs[idx] = Content.getComponent("HiShelfFreqVoice" + idx);
    theEQHiShelfFreqs[idx].setControlCallback(onEQHiShelfFreqControl);
    theEQHiShelfQs[idx] = Content.getComponent("HiShelfQVoice" + idx);
    theEQHiShelfQs[idx].setControlCallback(onEQHiShelfQControl);
    theEQHiShelfGains[idx] = Content.getComponent("HiShelfGainVoice" + idx);
    theEQHiShelfGains[idx].setControlCallback(onEQHiShelfGainControl);
    
    theCompOnOffs[idx] = Content.getComponent("CompPowerVoice" + idx);
    theCompOnOffs[idx].setControlCallback(onCompOnOffControl); 

    theCompThresholds[idx] = Content.getComponent("CompThresholdVoice" + idx);
    theCompThresholds[idx].setControlCallback(onCompThresholdControl);
    theCompAttacks[idx] = Content.getComponent("CompAttackVoice" + idx);
    theCompAttacks[idx].setControlCallback(onCompAttackControl);
    theCompReleases[idx] = Content.getComponent("CompReleaseVoice" + idx);
    theCompReleases[idx].setControlCallback(onCompReleaseControl);
    theCompRatios[idx] = Content.getComponent("CompRatioVoice" + idx);
    theCompRatios[idx].setControlCallback(onCompRatioControl);
    theCompMakeups[idx] = Content.getComponent("CompMakeUpGainVoice" + idx);
    theCompMakeups[idx].setControlCallback(onCompMakeupControl);

    theVoxPans[idx] = Content.getComponent("VoxElementPan" + idx);
    theVoxPans[idx].setControlCallback(onVoxPanControl);
    theVoxWidths[idx] = Content.getComponent("VoxElementWidth" + idx);
    theVoxWidths[idx].setControlCallback(onVoxWidthControl);
    theVoxDelays[idx] = Content.getComponent("VoxElementDelay" + idx);
    theVoxDelays[idx].setControlCallback(onVoxDelayControl);


}

// SCRipts
const var PortaScript1 = Synth.getMidiProcessor("PortaScript1");
const var Arpeggiator1 = Synth.getMidiProcessor("Arpeggiator1");
const var IRREScript1 = Synth.getMidiProcessor("IRREScript1");
//FX
const var Filter1 = Synth.getEffect("Filter1");
const var FreqModulator1 = Synth.getModulator("FreqModulator1");
//const var Saturator1 = Synth.getEffect("Saturator1");
const var PhaseFX1 = Synth.getEffect("Phase FX1");
const var PhaserModulator1 = Synth.getModulator("PhaserModulator1");
const var Chorus1 = Synth.getEffect("Chorus1");
const var SimpleReverb1 = Synth.getEffect("Simple Reverb1");
const var Delay1 = Synth.getEffect("Delay1");
const var ShapeFX1 = Synth.getEffect("Shape FX1");
const var Analyser1 = Synth.getEffect("Analyser1");


// GLOBAL Modulators
const var GlobalPitchLFO = Synth.getModulator("GlobalPitchLFO");
const var GlobalGainLFO = Synth.getModulator("GlobalGainLFO");
// voice modulators

// load the array holders
for (i=0;i<NUM_VOICES; i++)
{
    TheSamplers[i] = Synth.getChildSynth("Sampler" + (i+1));
    TheEnvelopes[i] = Synth.getModulator("AHDSR Envelope" + (i+1));
    TheGainMods[i] = Synth.getModulator("GainModVoice" + (i+1)); 
    ThePitchMods[i] = Synth.getModulator("PitchModVoice" + (i+1)); 
    TheVeloMods[i] = Synth.getModulator("Global Voice Start Modulator" + (i+1)); 
    ThePortaEnvelopes[i] =  Synth.getModulator("PortaEnvelope" + (i+1));

};



// load the samplers at the start:

TheSamplers[0].asSampler().loadSampleMap("BRIGHT ACU 1");
TheSamplers[1].asSampler().loadSampleMap("60S ACOUSTIC");
TheSamplers[2].asSampler().loadSampleMap("60S ACU PLAM MUTE");
TheSamplers[3].asSampler().loadSampleMap("12STRINGRR");
TheSamplers[4].asSampler().loadSampleMap("MANDO 1");
TheSamplers[5].asSampler().loadSampleMap("UKE 1");
TheSamplers[6].asSampler().loadSampleMap("70s GTR MIC");
TheSamplers[7].asSampler().loadSampleMap("HARMONICS 1");
TheSamplers[8].asSampler().loadSampleMap("ACU FNGRPK");
TheSamplers[9].asSampler().loadSampleMap("ACU PERC");

// the volume controls..
inline function onVolumeVoiceControl(component, value)
{
	//
	local pos = 0;
	pos = theVolumeVoices.indexOf(component);


	if (value == -100)
    {
	   theMuters[pos].setBypassed(false);
    }else{
	   theMuters[pos].setBypassed(true);
	   theSimpleGains[pos].setAttribute(theSimpleGains.Gain, value);
    };
}


// single instance UI call backs

//ENV. ATTACK
inline function onAttackControl(component, value)
{
	//
	for(i=0; i<NUM_VOICES;i++)
    {
        TheEnvelopes[i].setAttribute(TheEnvelopes[i].Attack, value);
    };
};

Content.getComponent("Attack").setControlCallback(onAttackControl);


// ENV. RELEASE
inline function onReleaseControl(component, value)
{
	//
	local val = value;
	if (val == 0)
	    val = 5;
	for(i=0; i<NUM_VOICES;i++)
    {
        TheEnvelopes[i].setAttribute(TheEnvelopes[i].Release, val);
    };
};

Content.getComponent("Release").setControlCallback(onReleaseControl);

// FILTER FREQ

inline function onCutOffControl(component, value)
{
	//
	Filter1.setAttribute(Filter1.Frequency, value);
	PanelFilterCutoff.setValue(value);
};

Content.getComponent("CutOff").setControlCallback(onCutOffControl);


// SHAPE DRIVE (DRIVE)
inline function onDriveControl(component, value)
{
	//

	if (value == 0)
    {
        ShapeFX1.setBypassed(true);
    }else{
        ShapeFX1.setBypassed(false);
    }
	ShapeFX1.setAttribute(ShapeFX1.Gain,value );
	ShapePanelDrive.setValue(value);
};

Content.getComponent("Drive").setControlCallback(onDriveControl);


// REVERB WET MIX

inline function onReverbControl(component, value)
{
	//
	SimpleReverb1.setAttribute(SimpleReverb1.WetLevel, value);
	ReverbPanelAmt.setValue(value);
};

Content.getComponent("Reverb").setControlCallback(onReverbControl);



// GAIN MASTER

inline function onMAsterVolumeControl(component, value)
{
	//
	if (MasterMute.getValue() == 0)
	    GainMaster.setAttribute(GainMaster.Gain, value);
};

Content.getComponent("MAsterVolume").setControlCallback(onMAsterVolumeControl);

// MAIN selector

inline function onMainControl(component, value)
{
	//
	if (value)
    {
	    EffectsPanel.showControl(false);
	    ModsPanel.showControl(false);
	    ArpPanel.showControl(false);
    }
};

Content.getComponent("Main").setControlCallback(onMainControl);

// FX selector

inline function onEffectsControl(component, value)
{
	//
	if (value)
    {
	    EffectsPanel.showControl(true);
	    ModsPanel.showControl(false);
	    ArpPanel.showControl(false);
    }
};

Content.getComponent("Effects").setControlCallback(onEffectsControl);


//mods selector
inline function onModsControl(component, value)
{
	//
	if (value)
    {
	    EffectsPanel.showControl(false);
	    ModsPanel.showControl(true);
	    ArpPanel.showControl(false);
    }
};

Content.getComponent("Mods").setControlCallback(onModsControl);

// arp selector
inline function onArpControl(component, value)
{
	//
	if (value)
    {
	    EffectsPanel.showControl(false);
	    ModsPanel.showControl(false);
	    ArpPanel.showControl(true);
    }
};

Content.getComponent("Arp").setControlCallback(onArpControl);


//phaser
inline function onPhsrOnOffControl(component, value)
{
	//
	PhaseFX1.setBypassed(1-value);
};

Content.getComponent("PhsrOnOff").setControlCallback(onPhsrOnOffControl);


inline function onPhaserFreq1Control(component, value)
{
	//
	PhaseFX1.setAttribute(PhaseFX1.Frequency1, value);
};

Content.getComponent("PhaserFreq1").setControlCallback(onPhaserFreq1Control);

inline function onPhaserFreq2Control(component, value)
{
	//
	PhaseFX1.setAttribute(PhaseFX1.Frequency2, value);
};

Content.getComponent("PhaserFreq2").setControlCallback(onPhaserFreq2Control);

inline function onPhaserFeedbackControl(component, value)
{
	//
	PhaseFX1.setAttribute(PhaseFX1.Feedback, value);
};

Content.getComponent("PhaserFeedback").setControlCallback(onPhaserFeedbackControl);

inline function onPhaserMixControl(component, value)
{
	//
	PhaseFX1.setAttribute(PhaseFX1.Mix, value);
};

Content.getComponent("PhaserMix").setControlCallback(onPhaserMixControl);


inline function onPhaserLFODepthControl(component, value)
{
	//
	PhaserModulator1.setIntensity(value);
};

Content.getComponent("PhaserLFODepth").setControlCallback(onPhaserLFODepthControl);


inline function onPhaserSpeedControl(component, value)
{
	//
	PhaserModulator1.setAttribute(PhaserModulator1.Frequency, value);
};

Content.getComponent("PhaserSpeed").setControlCallback(onPhaserSpeedControl);



// CHORUS


inline function onChsOnOffControl(component, value)
{
	//
	Chorus1.setBypassed(1 - value);
};

Content.getComponent("ChsOnOff").setControlCallback(onChsOnOffControl);


inline function onChsRateControl(component, value)
{
	//
	Chorus1.setAttribute(Chorus1.Rate, value);
};

Content.getComponent("ChsRate").setControlCallback(onChsRateControl);

inline function onChsWidthControl(component, value)
{
	//
	Chorus1.setAttribute(Chorus1.Width, value);
};

Content.getComponent("ChsWidth").setControlCallback(onChsWidthControl);

inline function onChsFeedbackControl(component, value)
{
	//
	Chorus1.setAttribute(Chorus1.Feedback, value);
};

Content.getComponent("ChsFeedback").setControlCallback(onChsFeedbackControl);


// DELAY


const var FILTERDELAYSCRIPT = Synth.getEffect("FILTERDELAYSCRIPT");
inline function onDelayOnOffControl(component, value)
{
	//
	FILTERDELAYSCRIPT.setBypassed(1 - value);
};

Content.getComponent("DelayOnOff").setControlCallback(onDelayOnOffControl);

/*
inline function onDelayRateControl(component, value)
{
	//
	Delay1.setAttribute(Delay1.DelayTimeLeft, value);
	Delay1.setAttribute(Delay1.DelayTimeRight, value);
};

Content.getComponent("DelayRate").setControlCallback(onDelayRateControl);


inline function onDelayFeedbackControl(component, value)
{
	//
	Delay1.setAttribute(Delay1.FeedbackLeft, value);
	Delay1.setAttribute(Delay1.FeedbackRight, value);
};

Content.getComponent("DelayFeedback").setControlCallback(onDelayFeedbackControl);


inline function onDelayMixControl(component, value)
{
	//
	Delay1.setAttribute(Delay1.Mix, value);
};

Content.getComponent("DelayMix").setControlCallback(onDelayMixControl);
*/

// GAIN LFO

inline function onGainLFOOnOffControl(component, value)
{
	//

    for (i = 0; i < NUM_VOICES; i++)
    {
	    TheGainMods[i].setBypassed(1-value);
    };
    
};

Content.getComponent("GainLFOOnOff").setControlCallback(onGainLFOOnOffControl);


inline function onGainLFODepthControl(component, value)
{
	//
	GlobalGainLFO.setIntensity(value);
};

Content.getComponent("GainLFODepth").setControlCallback(onGainLFODepthControl);


inline function onGainLFORateControl(component, value)
{
	//
	GlobalGainLFO.setAttribute(GlobalGainLFO.Frequency, value);
};

Content.getComponent("GainLFORate").setControlCallback(onGainLFORateControl);


//PITCH LFO

inline function onPitchLFOOnOffControl(component, value)
{
	//
	//GlobalPitchLFO.setBypassed(1 - value);
	for (i = 0; i < NUM_VOICES; i++)
    {
	    ThePitchMods[i].setBypassed(1-value);
    };
};

Content.getComponent("PitchLFOOnOff").setControlCallback(onPitchLFOOnOffControl);


inline function onPitchLFODepthControl(component, value)
{
	//
	for (i = 0; i < NUM_VOICES; i++)
	{
	    ThePitchMods[i].setIntensity(value);
    };
};

Content.getComponent("PitchLFODepth").setControlCallback(onPitchLFODepthControl);


inline function onPitchLFORateControl(component, value)
{
	//
	GlobalPitchLFO.setAttribute(GlobalPitchLFO.Frequency, value);
};

Content.getComponent("PitchLFORate").setControlCallback(onPitchLFORateControl);



//FILTER LFO

inline function onFreqLFOOnOffControl(component, value)
{
	//
	FreqModulator1.setBypassed(1 - value);
};

Content.getComponent("FreqLFOOnOff").setControlCallback(onFreqLFOOnOffControl);


inline function onFreqLFODepthControl(component, value)
{
	//
	FreqModulator1.setIntensity(value);
};

Content.getComponent("FreqLFODepth").setControlCallback(onFreqLFODepthControl);


inline function onFreqLFORateControl(component, value)
{
	//
	FreqModulator1.setAttribute(FreqModulator1.Frequency, value);
};

Content.getComponent("FreqLFORate").setControlCallback(onFreqLFORateControl);



// PORTAMENTO


inline function onGlideOnOffControl(component, value)
{
	//turn portmento on or off
	for (i = 0; i < NUM_VOICES; i++)
    {
	    ThePortaEnvelopes[i].setAttribute(ThePortaEnvelopes[i].Attack,0);
	}

    
	PortaScript1.setAttribute(0, 1 - value);
};

Content.getComponent("GlideOnOff").setControlCallback(onGlideOnOffControl);


inline function onGlideTimeControl(component, value)
{
	//
	PortaScript1.setAttribute(1, value);
};

Content.getComponent("GlideTime").setControlCallback(onGlideTimeControl);


inline function onGlideUPControl(component, value)
{
	//
	PortaScript1.setAttribute(2, value);
};

Content.getComponent("GlideUP").setControlCallback(onGlideUPControl);

inline function onGlideDownControl(component, value)
{
	//
	PortaScript1.setAttribute(3, value);
};

Content.getComponent("GlideDown").setControlCallback(onGlideDownControl);   
    
inline function onGlideSmoothingControl(component, value)
{
	//
	PortaScript1.setAttribute(4, value);
};

Content.getComponent("GlideSmoothing").setControlCallback(onGlideSmoothingControl);   
    
inline function onGlideSplitControl(component, value)
{
	//
	PortaScript1.setAttribute(5, value);
};

Content.getComponent("GlideSplit").setControlCallback(onGlideSplitControl);   
    
              
//ARP

inline function onArpBypassControl(component, value)
{
		//bypass the arp
	Arpeggiator1.setAttribute(Arpeggiator1.BypassButton, 1- value);
	Arpeggiator1.setAttribute(Arpeggiator1.ResetButton, 1);
	ArpFilter.setAttribute(0,value);
    if (!value)
    {
        // arp going off cancel any held notes...
        Engine.allNotesOff();
    }
};

Content.getComponent("ArpBypass").setControlCallback(onArpBypassControl);



inline function onArpStepsControl(component, value)
{
	//
    Arpeggiator1.setAttribute(Arpeggiator1.NumStepSlider,value);
};

Content.getComponent("ArpSteps").setControlCallback(onArpStepsControl);


inline function onArpTempoControl(component, value)
{
	//set the arp tempo
	Arpeggiator1.setAttribute(Arpeggiator1.SpeedKnob, value);
};

Content.getComponent("ArpTempo").setControlCallback(onArpTempoControl);


inline function onArpSwingControl(component, value)
{
	//A
	Arpeggiator1.setAttribute(Arpeggiator1.Shuffle, value);
};

Content.getComponent("ArpSwing").setControlCallback(onArpSwingControl);


inline function onArpOctaveControl(component, value)
{
	//set the arp octaves..
	Arpeggiator1.setAttribute(Arpeggiator1.OctaveRange, value);
};

Content.getComponent("ArpOctave").setControlCallback(onArpOctaveControl);


inline function onArpStepIncrementControl(component, value)
{
	//set the Arp step increment value
	Arpeggiator1.setAttribute(Arpeggiator1.StepSkipSlider, value);
};

Content.getComponent("ArpStepIncrement").setControlCallback(onArpStepIncrementControl);


inline function onArpUpControl(component, value)
{
	//
	Arpeggiator1.setAttribute(Arpeggiator1.SequenceComboBox, 1);
};

Content.getComponent("ArpUp").setControlCallback(onArpUpControl);

inline function onArpDownControl(component, value)
{
	//
	Arpeggiator1.setAttribute(Arpeggiator1.SequenceComboBox, 2);
};

Content.getComponent("ArpDown").setControlCallback(onArpDownControl);

inline function onArpUpDownControl(component, value)
{
	//
	Arpeggiator1.setAttribute(Arpeggiator1.SequenceComboBox, 3);
};

Content.getComponent("ArpUpDown").setControlCallback(onArpUpDownControl);

inline function onArpDownUPControl(component, value)
{
	//
	Arpeggiator1.setAttribute(Arpeggiator1.SequenceComboBox, 4);
};

Content.getComponent("ArpDownUp").setControlCallback(onArpDownUpControl);


inline function onArpRandomControl(component, value)
{
	//
	Arpeggiator1.setAttribute(Arpeggiator1.SequenceComboBox, 5);
};

Content.getComponent("ArpRandom").setControlCallback(onArpRandomControl);


const var SettingsPanel = Content.getComponent("SettingsPanel");


inline function onSettingsSelectorControl(component, value)
{
	//
	SettingsPanel.showControl(value);
};

Content.getComponent("SettingsSelector").setControlCallback(onSettingsSelectorControl);

const var ArpFilter = Synth.getMidiProcessor("ArpFilter");
const var IgnoreInput = Content.getComponent("IgnoreInput");
const var ArpBypass = Content.getComponent("ArpBypass");
const var ArpHolder = Synth.getMidiProcessor("ArpHolder");


inline function onIgnoreInputControl(component, value)
{
	//
	ArpFilter.setAttribute(1,1 - value);
	/*
	if (ArpBypass.getValue() == 1)
    {
        // the arp is running..
        if (value)
        {
            //we need to turn the filter on..
            ArpFilter.setBypassed(false);
        }else{
            ArpFilter.setBypassed(true);
        }
    }
    */
};

Content.getComponent("IgnoreInput").setControlCallback(onIgnoreInputControl);



const var arpHold = Content.getComponent("arpHold");
//const var arpClassic = Content.getComponent("arpClassic");


inline function onarpClassicControl(component, value)
{
	//
	if (ArpBypass.getValue() == 1)
    {
        // the arp is running
        if (!value)
        {
            Engine.allNotesOff();
        }
    }
};

//Content.getComponent("arpClassic").setControlCallback(onarpClassicControl);



inline function onarpHoldControl(component, value)
{
	//
	if (ArpBypass.getValue() == 1)
    {
        // the arp is running
        if (!value)
        {
            Engine.allNotesOff();
        }
    }
};

Content.getComponent("arpHold").setControlCallback(onarpHoldControl);



inline function onarpLatchResetControl(component, value)
{
	//
	if (ArpBypass.getValue() == 1)
    {
        // the arp is running
        if (arpHold.getValue() == 1)
        {
            // and they are using latch
            Engine.allNotesOff();
        }
    }
};

Content.getComponent("arpLatchReset").setControlCallback(onarpLatchResetControl);


const var ArpSteps = Content.getComponent("ArpSteps");
const var PitchSliderPack = Content.getComponent("PitchSliderPack");



inline function onarpPitchResetControl(component, value)
{
	//
	local stepSize = ArpSteps.getValue();
	local rdx;
	local resetArray = [];
	if(value)
    {
        for(rdx=0; rdx<setpSize;rdx++)
        {
            resetArray[rdx] = 0;
        };
        PitchSliderPack.setValue(resetArray);
    };
    ArpSteps.setValue(stepSize);
    ArpSteps.changed();
    
};

Content.getComponent("arpPitchReset").setControlCallback(onarpPitchResetControl);


// PRESETS

const var PresetPanel = Content.getComponent("PresetPanel");
const var myPresetName = Content.getComponent("myPresetName");



inline function onPresetsControl(component, value)
{
    local preName; 
  //show - hide the preset panel...
  if (value == 1){
      //Arp.setValue(0);
      SettingsPanel.setValue(0);
      //About.setValue(0);
      PresetPanel.showControl(1);
      
  }else{
      PresetPanel.showControl(0);
  }
  //showPanels();
  preName = Engine.getCurrentUserPresetName();
  if (preName == "")
    preName = "EMPTY";
  myPresetName.set("text",preName);
  
};

Content.getComponent("Presets").setControlCallback(onPresetsControl);

// FX Call backs

const var FXPanelCollection = Content.getComponent("FXPanelCollection");


inline function onFXLaunchControl(component, value)
{
    local pos = theFXLaunchers.indexOf(component);
// Console.print("----------:" + VoiceNames[pos]);
    closeAllPanels();
    reg fdx;
    for (fdx = 0;fdx<NUM_VOICES;fdx++)
    {
        if (fdx != pos)
            theFXLaunchers[fdx].setValue(0);
    };
    if (value)
    {
        FXPanelCollection.showControl(true);
        theNamedVoices[pos].set("text", VoiceNames[pos]);
        theFXPanels[pos].showControl(true);
    }else{
        FXPanelCollection.showControl(false);
        theFXPanels[pos].showControl(false);
    }
}

inline function onFXDismissControl(component, value)
{
	//close this fx panel...
	local pos = theFXDismisses.indexOf(component);
    FXPanelCollection.showControl(false);
	theFXPanels[pos].showControl(false);
	theFXLaunchers[pos].setValue(0);
	
};



inline function onEQSelectorControl(component, value)
{
	//open/close this eq panel...
	local pos = theEQSelectors.indexOf(component);
	if (value)
    {
        theEQPanels[pos].showControl(true);
        theCompPanels[pos].showControl(false);
        theVoxPanels[pos].showControl(false);
    }

};

inline function onCompSelectorControl(component, value)
{
	//open/close this eq panel...
	local pos = theCompSelectors.indexOf(component);
	if (value)
    {
        theEQPanels[pos].showControl(false);
        theCompPanels[pos].showControl(true);
        theVoxPanels[pos].showControl(false);
    }

};


inline function onEQLoShelfFreqControl(component, value)
{
    local pos = theEQLoShelfFreqs.indexOf(component);
    local eqdx = 0 * theEQs[pos].BandOffset + theEQs[pos].Freq;
	theEQs[pos].setAttribute(eqdx, value);
}
inline function onEQLoShelfQControl(component, value)
{
    local pos = theEQLoShelfQs.indexOf(component);
    local eqdx = 0 * theEQs[pos].BandOffset + theEQs[pos].Q;
	theEQs[pos].setAttribute(eqdx, value);
}

inline function onEQLoShelfGainControl(component, value)
{
    local pos = theEQLoShelfGains.indexOf(component); 
    local eqdx = 0 * theEQs[pos].BandOffset + theEQs[pos].Gain;
	theEQs[pos].setAttribute(eqdx, value);
}

inline function onEQLoMidFreqControl(component, value)
{
    local pos = theEQLoMidFreqs.indexOf(component);
    local eqdx = 1 * theEQs[pos].BandOffset + theEQs[pos].Freq;
	theEQs[pos].setAttribute(eqdx, value);
}
inline function onEQLoMidQControl(component, value)
{
    local pos = theEQLoMidQs.indexOf(component);
	local eqdx = 1 * theEQs[pos].BandOffset + theEQs[pos].Q;
	theEQs[pos].setAttribute(eqdx, value);
    
}
inline function onEQLoMidGainControl(component, value)
{
    local pos = theEQLoMidGains.indexOf(component);
	local eqdx = 1 * theEQs[pos].BandOffset + theEQs[pos].Gain;
	theEQs[pos].setAttribute(eqdx, value);
    
}

inline function onEQHiMidFreqControl(component, value)
{
    local pos = theEQHiMidFreqs.indexOf(component);
    local eqdx = 2 * theEQs[pos].BandOffset + theEQs[pos].Freq;
	theEQs[pos].setAttribute(eqdx, value);
}
inline function onEQHiMidQControl(component, value)
{
    local pos = theEQHiMidQs.indexOf(component);
	local eqdx = 2 * theEQs[pos].BandOffset + theEQs[pos].Q;
	theEQs[pos].setAttribute(eqdx, value);
    
}
inline function onEQHiMidGainControl(component, value)
{
    local pos = theEQHiMidGains.indexOf(component);
	local eqdx = 2 * theEQs[pos].BandOffset + theEQs[pos].Gain;
	theEQs[pos].setAttribute(eqdx, value);
    
}  


inline function onEQHiShelfFreqControl(component, value)
{
    local pos = theEQHiShelfFreqs.indexOf(component);
    local eqdx = 3 * theEQs[pos].BandOffset + theEQs[pos].Freq;
	theEQs[pos].setAttribute(eqdx, value);
}
inline function onEQHiShelfQControl(component, value)
{
    local pos = theEQHiShelfQs.indexOf(component);
    local eqdx = 3 * theEQs[pos].BandOffset + theEQs[pos].Q;
	theEQs[pos].setAttribute(eqdx, value);
}

inline function onEQHiShelfGainControl(component, value)
{
    local pos = theEQHiShelfGains.indexOf(component); 
    local eqdx = 3 * theEQs[pos].BandOffset + theEQs[pos].Gain;
	theEQs[pos].setAttribute(eqdx, value);
}

// COMPRESSORS


inline function onCompOnOffControl(component, value)
{
    //
    local pos = theCompOnOffs.indexOf(component); 
    //Console.print(pos);
    theComps[pos].setBypassed(1 - value);
}

inline function onCompThresholdControl(component, value)
{
    //
    local pos = theCompThresholds.indexOf(component); 
    theComps[pos].setAttribute(theComps[pos].CompressorThreshold,value);
}
inline function onCompAttackControl(component, value)
{
    //
    local pos = theCompAttacks.indexOf(component); 
    theComps[pos].setAttribute(theComps[pos].CompressorAttack,value);
}

inline function onCompReleaseControl(component, value)
{
    //
    local pos = theCompReleases.indexOf(component); 
    theComps[pos].setAttribute(theComps[pos].CompressorRelease,value);
}

inline function onCompRatioControl(component, value)
{
    //
    local pos = theCompRatios.indexOf(component); 
    theComps[pos].setAttribute(theComps[pos].CompressorRatio,value);
}
inline function onCompMakeupControl(component, value)
{
    //
    local pos = theCompMakeups.indexOf(component); 
    theComps[pos].setAttribute(theComps[pos].CompressorMakeup,value);
}




// VOX ELEMENTS
inline function onVoxSelectorControl(component, value)
{
	//open/close this panel...
	local pos = theVoxSelectors.indexOf(component);
	if (value)
    {
        theEQPanels[pos].showControl(false);
        theVoxPanels[pos].showControl(true);
        theCompPanels[pos].showControl(false);
    }

};



inline function onVoxPanControl(component, value)
{
    //
    local pos = theVoxPans.indexOf(component); 
    theSimpleGains[pos].setAttribute(theSimpleGains[pos].Balance, value);
}


inline function onVoxWidthControl(component, value)
{
    //
    local pos = theVoxWidths.indexOf(component); 
    theSimpleGains[pos].setAttribute(theSimpleGains[pos].Width, value);
}


inline function onVoxDelayControl(component, value)
{
    //
    local pos = theVoxDelays.indexOf(component); 
    theSimpleGains[pos].setAttribute(theSimpleGains[pos].Delay, value);
}
//================================================================================

// LOWER AREA CONTROLS AND THEIR PANEL CONTROLS

//===========================================================================

const var MasterFXPanelCollection = Content.getComponent("MasterFXPanelCollection");
const var EnvelopePanel = Content.getComponent("EnvelopePanel");
const var EnvelopeLaunch1 = Content.getComponent("EnvelopeLaunch1");
const var EnvelopeLaunch2 = Content.getComponent("EnvelopeLaunch2");
const var FilterLaunch = Content.getComponent("FilterLaunch");
const var DriveLaunch = Content.getComponent("DriveLaunch");
const var ReverbLaunch = Content.getComponent("ReverbLaunch");


//ENVELOPE




inline function onEnvelopeLaunch1Control(component, value)
{

    closeAllPanels();
    if (value)
    {
        EnvelopeLaunch2.setValue(0);
        FilterLaunch.setValue(0);
        DriveLaunch.setValue(0);
        ReverbLaunch.setValue(0);
        EnvelopePanel.showControl(true);
        MasterFXPanelCollection.showControl(true);
    }
};

Content.getComponent("EnvelopeLaunch1").setControlCallback(onEnvelopeLaunch1Control);

inline function onEnvelopeLaunch2Control(component, value)
{

    closeAllPanels();
    if (value)
    {
        EnvelopeLaunch1.setValue(0);
        FilterLaunch.setValue(0);
        DriveLaunch.setValue(0);
        ReverbLaunch.setValue(0);
        EnvelopePanel.showControl(true);
        EnvelopePanel.showControl(true);
        MasterFXPanelCollection.showControl(true);
    }
};

Content.getComponent("EnvelopeLaunch2").setControlCallback(onEnvelopeLaunch2Control);

inline function onEnvDismissControl(component, value)
{
	//
	
    EnvelopeLaunch1.setValue(0);
    EnvelopeLaunch2.setValue(0);
    MasterFXPanelCollection.showControl(false);
	EnvelopePanel.showControl(false);
};

Content.getComponent("EnvDismiss").setControlCallback(onEnvDismissControl);



inline function onEnvPanelAttackControl(component, value)
{
	//
	Attack.setValue(value);
	Attack.changed();
};

Content.getComponent("EnvPanelAttack").setControlCallback(onEnvPanelAttackControl);


inline function onEnvPanelHoldControl(component, value)
{
	//
	
	for(i=0; i<NUM_VOICES;i++)
    {
        TheEnvelopes[i].setAttribute(TheEnvelopes[i].Hold, value);
    }
};

Content.getComponent("EnvPanelHold").setControlCallback(onEnvPanelHoldControl);


inline function onEnvPanelDecayControl(component, value)
{
	//
	
	for(i=0; i<NUM_VOICES;i++)
    {
        TheEnvelopes[i].setAttribute(TheEnvelopes[i].Decay, value);
    }
};

Content.getComponent("EnvPanelDecay").setControlCallback(onEnvPanelDecayControl);


inline function onEnvPanelSustaiinControl(component, value)
{
	//
	
	for(i=0; i<NUM_VOICES;i++)
    {
        TheEnvelopes[i].setAttribute(TheEnvelopes[i].Sustain, value);
    }
};

Content.getComponent("EnvPanelSustaiin").setControlCallback(onEnvPanelSustaiinControl);



inline function onEnvPanelReleaseControl(component, value)
{
	//
	Release.setValue(value);
	Release.changed();
};

Content.getComponent("EnvPanelRelease").setControlCallback(onEnvPanelReleaseControl);


// FILTER

const var FilterPanel = Content.getComponent("FilterPanel");


inline function onFilterLaunchControl(component, value)
{
    
    closeAllPanels();
    if (value)
    {
        EnvelopeLaunch1.setValue(0);
        EnvelopeLaunch2.setValue(0);
        DriveLaunch.setValue(0);
        ReverbLaunch.setValue(0);
        MasterFXPanelCollection.showControl(true);
        FilterPanel.showControl(true);
        Analyser1.setBypassed(false);
    }
};

Content.getComponent("FilterLaunch").setControlCallback(onFilterLaunchControl);


inline function onFilterDismissControl(component, value)
{
	//Add your custom logic here...
	
    FilterLaunch.setValue(0);
	FilterPanel.showControl(false);
    MasterFXPanelCollection.showControl(false);
	Analyser1.setBypassed(true);
};

Content.getComponent("FilterDismiss").setControlCallback(onFilterDismissControl);



inline function onFilterTypeSelectorControl(component, value)
{
	//
	switch (value) 
    {
      case 1:
        Filter1.setAttribute(Filter1.Mode, 6);
        break;
      case 2:
        Filter1.setAttribute(Filter1.Mode, 7);
        break;
      case 3:
        Filter1.setAttribute(Filter1.Mode, 12);
        break;
      case 4:
        Filter1.setAttribute(Filter1.Mode, 13);
        break;
      case 5:
        Filter1.setAttribute(Filter1.Mode, 9);
        break;
      case 6:
        Filter1.setAttribute(Filter1.Mode, 10);
        break;
      case 7:
        Filter1.setAttribute(Filter1.Mode, 0);
        break;
      case 8:
        Filter1.setAttribute(Filter1.Mode, 5);
        break;
      case 9:
        Filter1.setAttribute(Filter1.Mode, 1);
        break;
      case 10:
        Filter1.setAttribute(Filter1.Mode, 15);
        break;
    };
};

Content.getComponent("FilterTypeSelector").setControlCallback(onFilterTypeSelectorControl);


inline function onPanelFilterCutoffControl(component, value)
{
	//
	CutOff.setValue(value);
	CutOff.changed();
};

Content.getComponent("PanelFilterCutoff").setControlCallback(onPanelFilterCutoffControl);


inline function onPanelFilterResonanceControl(component, value)
{
	//
	Filter1.setAttribute(Filter1.Q, value);
};

Content.getComponent("PanelFilterResonance").setControlCallback(onPanelFilterResonanceControl);


// SHAPER

const var ShapePanel = Content.getComponent("ShapePanel");


inline function onDriveLaunchControl(component, value)
{

    closeAllPanels();
    if (value)
    {
        EnvelopeLaunch1.setValue(0);
        EnvelopeLaunch2.setValue(0);
        FilterLaunch.setValue(0);
        ReverbLaunch.setValue(0);
        MasterFXPanelCollection.showControl(true);
        ShapePanel.showControl(true);
    }

};

Content.getComponent("DriveLaunch").setControlCallback(onDriveLaunchControl);

inline function onShapeDismissControl(component, value)
{
	//Add your custom logic here...
	DriveLaunch.setValue(0);
	ShapePanel.showControl(false);
    MasterFXPanelCollection.showControl(false);
};

Content.getComponent("ShapeDismiss").setControlCallback(onShapeDismissControl);


inline function onShapeTypeControl(component, value)
{
	//shape selection
	ShapeFX1.setAttribute(ShapeFX1.Mode, value);
};

Content.getComponent("ShapeType").setControlCallback(onShapeTypeControl);


inline function onShapeLoPassControl(component, value)
{
	ShapeFX1.setAttribute(ShapeFX1.LowPass, value);
};

Content.getComponent("ShapeLoPass").setControlCallback(onShapeLoPassControl);


inline function onShapeHiPassControl(component, value)
{
	ShapeFX1.setAttribute(ShapeFX1.HighPass, value);
};

Content.getComponent("ShapeHiPass").setControlCallback(onShapeHiPassControl);


inline function onShapePanelDriveControl(component, value)
{
	Drive.setValue(value);
	Drive.changed();
};

Content.getComponent("ShapePanelDrive").setControlCallback(onShapePanelDriveControl);


inline function onShapePanelMixControl(component, value)
{
	ShapeFX1.setAttribute(ShapeFX1.Mix, value);
};

Content.getComponent("ShapePanelMix").setControlCallback(onShapePanelMixControl);

// REVERB

const var ReverbPanel = Content.getComponent("ReverbPanel");

inline function onReverbLaunchControl(component, value)
{
    closeAllPanels();
    if (value)
    {
        EnvelopeLaunch1.setValue(0);
        EnvelopeLaunch2.setValue(0);
        FilterLaunch.setValue(0);
        DriveLaunch.setValue(0);
        MasterFXPanelCollection.showControl(true);
        ReverbPanel.showControl(true);
    }

};

Content.getComponent("ReverbLaunch").setControlCallback(onReverbLaunchControl);

inline function onReverbDismissControl(component, value)
{
	//Add your custom logic here...
	
    ReverbLaunch.setValue(0);
	ReverbPanel.showControl(false);
    MasterFXPanelCollection.showControl(false);
};

Content.getComponent("ReverbDismiss").setControlCallback(onReverbDismissControl);



inline function onReverbPanelAmtControl(component, value)
{
	//
	Reverb.setValue(value);
	Reverb.changed(); 
};

Content.getComponent("ReverbPanelAmt").setControlCallback(onReverbPanelAmtControl);


inline function onReverbDampingControl(component, value)
{
	//
	SimpleReverb1.setAttribute(SimpleReverb1.Damping, value);
};

Content.getComponent("ReverbDamping").setControlCallback(onReverbDampingControl);


inline function onReverbWidthControl(component, value)
{
	//
	SimpleReverb1.setAttribute(SimpleReverb1.Width,value);


};

Content.getComponent("ReverbWidth").setControlCallback(onReverbWidthControl);


inline function onReverbSizeControl(component, value)
{
	//
	SimpleReverb1.setAttribute(SimpleReverb1.RoomSize, value);
};

Content.getComponent("ReverbSize").setControlCallback(onReverbSizeControl);

//===================================================================
// END LOWER AREA CONTROL AND THER PANEL CONTROLS
//====================================================================



inline function onMasterPanControl(component, value)
{
	//
	GainMaster.setAttribute(GainMaster.Balance, value);
};

Content.getComponent("MasterPan").setControlCallback(onMasterPanControl);


inline function onMasterPitchControl(component, value)
{
	//
	local pdx;
	for (pdx=0;pdx<NUM_VOICES;pdx++)
    {
        theMasterPitches[pdx].setIntensity(value);
    }
};

Content.getComponent("MasterPitch").setControlCallback(onMasterPitchControl);




inline function onVelocityCurveOnOffControl(component, value)
{
	//
	for (i = 0; i < NUM_VOICES; i++)
    {
	    TheVeloMods[i].setBypassed(1-value);
    };
};

Content.getComponent("VelocityCurveOnOff").setControlCallback(onVelocityCurveOnOffControl);



inline function onIRRETimbreControl(component, value)
{
	//
	IRREScript1.setAttribute(1, value);
};

Content.getComponent("IRRETimbre").setControlCallback(onIRRETimbreControl);



inline function onIRREPitchControl(component, value)
{
	//
	IRREScript1.setAttribute(2, value);
};

Content.getComponent("IRREPitch").setControlCallback(onIRREPitchControl);

const var GainLFOTable = Content.getComponent("GainLFOTable");
const var PitchLFOTable = Content.getComponent("PitchLFOTable");
const var FreqLFOTable = Content.getComponent("FreqLFOTable");
const var Table1 = Content.getComponent("Table1");


GainLFOTable.setTablePopupFunction(function(v){
    return "";
});
PitchLFOTable.setTablePopupFunction(function(v){
    return "";
});

FreqLFOTable.setTablePopupFunction(function(v){
    return "";
});
Table1.setTablePopupFunction(function(v){
    return "";
});

//ABOUT BOX Vars and callbacks...

const var AboutBox = Content.getComponent("AboutBox");


inline function onOpenAboutBoxControl(component, value)
{
    //
    if(value)
    {
        AboutBox.showControl(true);
        component.setValue(0);
    };
};

Content.getComponent("OpenAboutBox").setControlCallback(onOpenAboutBoxControl);


inline function onAboutDismissControl(component, value)
{
    //close the about box
    AboutBox.showControl(false);
};
Content.getComponent("AboutDismiss").setControlCallback(onAboutDismissControl);

inline function onGridSoundsButtonControl(component, value)
{
    //open the grid sounds page
    if(value)
    {
        Engine.openWebsite("www.thegridsounds.com");
        component.setValue(0);
    }
};
Content.getComponent("GridSoundsButton").setControlCallback(onGridSoundsButtonControl);



inline function onChannelRobotControl(component, value)
{
    //open the channel robot page
    if(value)
    {
        Engine.openWebsite("www.channelrobot.com");
        component.setValue(0);
    }
};
Content.getComponent("ChannelRobot").setControlCallback(onChannelRobotControl);

//END ABOUT BOX work

//MOD LFO additions...
//const var GainLFOTable = Content.getComponent("GainLFOTable");
const var GainSineImage = Content.getComponent("GainSineImage");
const var GainTriangleImage = Content.getComponent("GainTriangleImage");
const var GainSawImage = Content.getComponent("GainSawImage");
const var GainSquareImage = Content.getComponent("GainSquareImage");
const var GainRandomImage = Content.getComponent("GainRandomImage");


const var PitchSineImage = Content.getComponent("PitchSineImage");
const var PitchTriangleImage = Content.getComponent("PitchTriangleImage");
const var PitchSawImage = Content.getComponent("PitchSawImage");
const var PitchSquareImage = Content.getComponent("PitchSquareImage");
const var PitchRandomImage = Content.getComponent("PitchRandomImage");


const var FreqSineImage = Content.getComponent("FreqSineImage");
const var FreqTriangleImage = Content.getComponent("FreqTriangleImage");
const var FreqSawImage = Content.getComponent("FreqSawImage");
const var FreqSquareImage = Content.getComponent("FreqSquareImage");
const var FreqRandomImage = Content.getComponent("FreqRandomImage");


inline function onGainLFOShapeSelectorControl(component, value)
{
	//
	GainSineImage.showControl(false);
	GainTriangleImage.showControl(false);
	GainSawImage.showControl(false);
	GainSquareImage.showControl(false);
	GainRandomImage.showControl(false);
	  GainLFOTable.showControl(false);
	GlobalGainLFO.setAttribute(GlobalGainLFO.WaveFormType, value);
	
	if (value == 1)
	  GainSineImage.showControl(true);
	if (value == 2)
	  GainTriangleImage.showControl(true);
	if (value == 3)
	  GainSawImage.showControl(true);
	if (value == 4)
	  GainSquareImage.showControl(true);
	if (value == 5)
	  GainRandomImage.showControl(true);
	if (value == 6)
	  GainLFOTable.showControl(true);

};

Content.getComponent("GainLFOShapeSelector").setControlCallback(onGainLFOShapeSelectorControl);


inline function onPitchLFOShapeSelectorControl(component, value)
{
	//
	PitchSineImage.showControl(false);
	PitchTriangleImage.showControl(false);
	PitchSawImage.showControl(false);
	PitchSquareImage.showControl(false);
	PitchRandomImage.showControl(false);
	  PitchLFOTable.showControl(false);
	GlobalPitchLFO.setAttribute(GlobalPitchLFO.WaveFormType, value);
	
	if (value == 1)
	  PitchSineImage.showControl(true);
	if (value == 2)
	  PitchTriangleImage.showControl(true);
	if (value == 3)
	  PitchSawImage.showControl(true);
	if (value == 4)
	  PitchSquareImage.showControl(true);
	if (value == 5)
	  PitchRandomImage.showControl(true);
	if (value == 6)
	  PitchLFOTable.showControl(true);

};

Content.getComponent("PitchLFOShapeSelector").setControlCallback(onPitchLFOShapeSelectorControl);



inline function onFreqLFOShapeSelectorControl(component, value)
{
	//
	FreqSineImage.showControl(false);
	FreqTriangleImage.showControl(false);
	FreqSawImage.showControl(false);
	FreqSquareImage.showControl(false);
	FreqRandomImage.showControl(false);
	  FreqLFOTable.showControl(false);
	FreqModulator1.setAttribute(FreqModulator1.WaveFormType, value);
	
	if (value == 1)
	  FreqSineImage.showControl(true);
	if (value == 2)
	  FreqTriangleImage.showControl(true);
	if (value == 3)
	  FreqSawImage.showControl(true);
	if (value == 4)
	  FreqSquareImage.showControl(true);
	if (value == 5)
	  FreqRandomImage.showControl(true);
	if (value == 6)
	  FreqLFOTable.showControl(true);

};

Content.getComponent("FreqLFOShapeSelector").setControlCallback(onFreqLFOShapeSelectorControl);

// END MODS UPDATE

// MUTE UPDATE
const var MAsterVolume = Content.getComponent("MAsterVolume");
const var MasterMute = Content.getComponent("MasterMute");




inline function onMasterMuteControl(component, value)
{
	//
	if (value)
	    GainMaster.setAttribute(GainMaster.Gain, -100);
	else
	    GainMaster.setAttribute(GainMaster.Gain,MAsterVolume.getValue() );
};

Content.getComponent("MasterMute").setControlCallback(onMasterMuteControl);


// END MUTE UPDATE


//PITCH BEND UPDATE

var pitchBendMods = [];
for (i=0;i<NUM_VOICES; i++)
{
    pitchBendMods[i] = Synth.getModulator("Pitch Wheel Modulator" + (i+1));
}

inline function onPitchBendAmtControl(component, value)
{
	//
	for (i=0;i<NUM_VOICES; i++)
    {
       pitchBendMods[i].setIntensity(value); 
    }
};

Content.getComponent("PitchBendAmt").setControlCallback(onPitchBendAmtControl);


//

// PRESET PANEL UPDATE

const var Presets = Content.getComponent("Presets");
inline function onPresetPanelDismissControl(component, value)
{
	//
	PresetPanel.showControl(false);
	Presets.setValue(0);
};

Content.getComponent("PresetPanelDismiss").setControlCallback(onPresetPanelDismissControl);

//

// SETTINGS PANEL UPDATE

const var SettingsSelector = Content.getComponent("SettingsSelector");

inline function onSettingsPanelDismissControl(component, value)
{
	//
	SettingsPanel.showControl(false);
	SettingsSelector.setValue(0);
};

Content.getComponent("SettingsPanelDismiss").setControlCallback(onSettingsPanelDismissControl);

//
function onNoteOn()
{
	
}
 function onNoteOff()
{
    //Console.print("Off:" + Globals.numKeyz );
    if (ArpBypass.getValue() == 1)
    {
	    if (arpHold.getValue())
        {
            // they want to hold so ignore the note off
            Message.ignoreEvent(true);
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
 