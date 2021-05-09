[Setup]
#define AppName "Everything Acoustic"
#define DevDir "Nightfox Audio"
AppName={#AppName}
AppVersion=1.0.0

DefaultDirName={pf}\{#DevDir}\{#AppName}
DefaultGroupName="Nightfox Audio\{#AppName}"
Compression=lzma2
SolidCompression=yes
OutputDir=.\installerbuild
ArchitecturesInstallIn64BitMode=x64
OutputBaseFilename={#AppName} Installer 1.0.0
LicenseFile="H:\Audio\Channel Robot\Hise_Work\Nightfox\installerAssets\EULA.txt"
PrivilegesRequired=admin
WizardSmallImageFile="H:\Audio\Channel Robot\Hise_Work\Nightfox\installerAssets\Logo55x58.bmp"
WizardImageFile="H:\Audio\Channel Robot\Hise_Work\Nightfox\installerAssets\Logo164x314.bmp"
DisableWelcomePage=no

SetupLogging=yes
ChangesAssociations=no

[Types]
Name: "full"; Description: "Full installation"
Name: "custom"; Description: "Custom installation"; Flags: iscustom

[Dirs]
Name: "{app}\"; Permissions: users-modify powerusers-modify admins-modify system-modify

[Components]
Name: "vst3_64"; Description: "{#AppName} 64-bit VSTi Plugin"; Types: full custom; Check: Is64BitInstallMode;
Name: "StandAlone_64"; Description: "{#AppName} 64-bit Stand Alone"; Types: full custom; Check: Is64BitInstallMode; 


[Files]

; VST
Source: "Binaries\Compiled\VST3\Everything Acoustic x64.vst3"; DestDir: "{commoncf64}\VST3\{#DevDir}"; Flags: ignoreversion; Components: vst3_64;

; STANDALONE
Source: "Binaries\Compiled\App\{#AppName} x64.exe"; DestDir: "{app}"; Flags: ignoreversion; Components: StandAlone_64; Check: Is64BitInstallMode

; MANUAL
 Source: "H:\Audio\Channel Robot\Hise_Work\Nightfox\installerAssets\NightfoxAudio_MANUAL.pdf"; DestDir: "{app}"; Flags: ignoreversion;


[Icons]                                                                            
Name: "{group}\{#AppName} Stand Alone"; Filename: "{app}\{#AppName} x64.exe"; Check: Is64BitInstallMode
Name: "{group}\Uninstall {#AppName}"; Filename: "{app}\unins000.exe"    
Name: "{group}\{#AppName}_Manual"; Filename: "{app}\NightfoxAudio_MANUAL.pdf"    


[Code]
var
  OkToCopyLog : Boolean;
  VST3DirPage_64: TInputDirWizardPage;


procedure InitializeWizard;

begin


end;





procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssDone then
    OkToCopyLog := True;
end;

procedure DeinitializeSetup();
begin
  if OkToCopyLog then
    FileCopy (ExpandConstant ('{log}'), ExpandConstant ('{app}\InstallationLogFile.log'), FALSE);
  RestartReplace (ExpandConstant ('{log}'), '');
end;

[UninstallDelete]
Type: files; Name: "{app}\InstallationLogFile.log"
