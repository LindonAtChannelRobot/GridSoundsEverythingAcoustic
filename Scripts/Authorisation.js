

// -------------- Authorisation & Demo ----------------------------

include("Serials.js");
include("BundleSerials.js");


//const var MasterContainer = Synth.getChildSynth("Container1");

var AuthState = false;
var DemoK = 0;
const var AuthoriseInInst = Content.getComponent("AuthoriseInInst");

const var SerialInput = Content.getComponent("SerialInput");
const var Description = Content.getComponent("Description");
// const var SerialStateLabel = Content.getComponent("SerialStateLabel");
const var AuthorisationDialogue = Content.getComponent("AuthorisationDialog");
const var GlobalMute = Synth.getMidiProcessor("GlobalMute");
    
const var OrText = Content.getComponent("OrText");
const var DemoCountText = Content.getComponent("DemoCountText");
// demo mode timer....
var engineStartTime = Engine.getUptime();
var timerState = 1;  // 1 = in the initial period, 2 = in the on/off period
var masterByPass = 1;  // used to set the bypass
// const var timer = Engine.createTimerObject();

inline function getDemoCounter(demoString)
{

	local kstr;
	local knum;
	local invK;

	kstr = demoString.substring(4,5);
	knum = parseInt(kstr,10);
	invK = 9 - knum;
	return invK;
}

inline function createOffset(num)
{
    local invKount = 9 - num;
    //Console.print("in bound num:" + num);
	local Kstring = "";
	for (k=0; k < 4; k++)
    {
        Kstring = Kstring.concat(Math.floor(Math.random()* 10));
    }
    Kstring = Kstring.concat(invKount);
    for (k=0; k < 4; k++)
    {
        Kstring = Kstring.concat(Math.floor(Math.random()* 10));
    }
    return Kstring;
}
// Checks if the serial input is valid and stores the result if successful. //
inline function onSubmitButtonControl(component, value)
{
    if(!value) // Just execute once
        return;
    
    local v = SerialInput.getValue();
    
    //Console.print(v);
    v = v.trim();
    // Checks if it's in the input
    if(serials.Data.contains(v) || bundleserials.Data.contains(v))
    {
        Console.print("Serial number found");
        
        local data = 
        {
            "Serial": v
        };
        
        // Stores the file to the hard drive. In HISE it will be the project folder
        // but in the compiled plugin it will use the parent directory to the 
        // user preset directory (which is usually the app data folder).
        Engine.dumpAsJSON(data, "../RegistrationInfo.js");
            
        setValidLicense(true);
    }
    else
    {
        Console.print("Invalid serial number");
        Description.set("text", "Invalid serial number. The number you supplied does not match");
            
        setValidLicense(false);
    }
};

Content.getComponent("SubmitButton").setControlCallback(onSubmitButtonControl);


inline function onAuthoriseInInstControl(component, value)
{
    //
    //Console.print("this value is:" + value);

    local offsetKString;
    AuthorisationDialogue.set("visible", false);
    GlobalMute.setAttribute(0, false);
    DemoK--;
    offsetKString = createOffset(DemoK);
    //Console.print(offsetKString);
    local data = 
    {
        "Setting": offsetKString
    };
    Engine.dumpAsJSON(data, "../OffsetValues.js");
    AuthorisationDialogue.startTimer(900000);

};
Content.getComponent("AuthoriseInInst").setControlCallback(onAuthoriseInInstControl);


inline function setValidLicense(isValid)
{
    // Do whatever you want to do here. I suggest a MIDI muter...

    GlobalMute.setAttribute(0, 1 - isValid);
    
    if(isValid)
    {
        // Change this to any other visual indication...
        // a valid license...
        AuthorisationDialogue.set("visible", false);
        AuthorisationDialogue.stopTimer();
        AuthState = true;
        //AuthoriseInInst.showControl(false);
        // make sure we are currently unmuted.
        //MasterContainer.setBypassed(0);
    }
    else
    {
        //not a valid license...
        // AuthorisationDialogue.set("visible", true);
        AuthState = false;
        // make sure we are currently muted.
        //MasterContainer.setBypassed(1);
        //AuthorisationDialogue.showControl(true);
    }
}


inline function checkOnLoad()
{
    // Clear the input
    SerialInput.set("text", "");
        
    // Load the serial from the stored file
    local pData = Engine.loadFromJSON("../RegistrationInfo.js");
    local dataC = Engine.loadFromJSON("../OffsetValues.js");
    Console.print("Checking serial");
    
    if(dataC)
    {
        DemoK = getDemoCounter(dataC.Setting);
    }else{
        local offSets;
        offSets = createOffset(9);
        local data = 
        {
            "Setting": offSets
        };
        DemoK = 9;
        Engine.dumpAsJSON(data, "../OffsetValues.js");
    }
    
    
    if(pData)    
    {
        local v = pData.Serial;
        Console.print("Restored serial: " + v);
        
        if(serials.Data.contains(v) || bundleserials.Data.contains(v))
        {
            setValidLicense(true);
            Console.print("valid license apparently..");
            return;
        }else{
            setValidLicense(false);
            Description.set("text", "Invalid serial found, please enter your number below.");
            Console.print("bad number.....");
            return;
        }
    }else{
        setValidLicense(false);
        Console.print("not a valid license..");
        //Console.print("DemoK is:" + DemoK);
        if (DemoK <=0)
        {
            OrText.showControl(false);
            AuthoriseInInst.showControl(false);
            DemoCountText.showControl(false);
                
        }else{
            OrText.showControl(true);
            AuthoriseInInst.showControl(true);
            DemoCountText.showControl(true);
            DemoCountText.set("text",("Number of Demos left:" + DemoK));
        }
        Description.set("text", "Please enter your serial number below.");
        AuthorisationDialogue.showControl(true);
    }
    

}

// Call this on startup
checkOnLoad();


//  enable for the demo version......


//MasterContainer.setBypassed(1 - masterByPass);

//AuthorisationDialogue.startTimer(5000);

// timer.startTimer(900000); // in milliseconds



AuthorisationDialogue.setTimerCallback(function()
{
    //Console.print(Engine.getUptime() - engineStartTime );
    checkOnLoad();
    /*
    if (timerState == 1){
        // check is the license valid yet
        if (AuthState == false)
        {
            timerState = 2;
            MasterContainer.setBypassed(masterByPass);
            AuthorisationDialogue.stopTimer();
            AuthorisationDialogue.startTimer(1000);
            AuthoriseInInst.setValue(1);
            AuthoriseInInst.changed();

        }else{
            // authorised so no need for a timer..
            AuthorisationDialogue.stopTimer();
        };
    };
    if (timerState == 2){
        if (AuthState == false)
        {
            masterByPass = 1 - masterByPass;
            MasterContainer.setBypassed(masterByPass);
        }else{
            // authorised so no need for a timer..
            AuthorisationDialogue.stopTimer();
        };
    };
    */
});

// ------------- end auth and demo --------------------------
    