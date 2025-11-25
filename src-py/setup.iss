[Setup]
AppName=dcp-cu
AppVersion=0.1.0
DefaultDirName={userappdata}\dcp-cu
DefaultGroupName=dcp-cu
OutputBaseFilename=dcp-cu-installer
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin
DisableDirPage=yes
;SignTool=signtool
;SignParameters=sign /a /tr http://timestamp.digicert.com /td sha256 /fd sha256 $f

[Files]
; onefile exe
Source: "dist\dcp-cu.exe"; DestDir: "{app}"; Flags: ignoreversion
; venv
Source: ".venv\*"; DestDir: "{app}\.venv"; Flags: recursesubdirs ignoreversion
; scripts
Source: "scripts\*"; DestDir: "{app}"; Flags: recursesubdirs ignoreversion

[Run]
Filename: "{app}\dcp-cu.exe"; Description: "Launch dcp-cu"; Flags: nowait postinstall skipifsilent

[Icons]
; link
Name: "{userdesktop}\dcp-cu"; Filename: "{app}\dcp-cu.exe"; WorkingDir: "{app}"; IconFilename: "{app}\dcp-cu.exe"; Comment: "Launch dcp-cu"

; start menu
;Name: "{group}\dcp-cu"; Filename: "{app}\dcp-cu.exe"; WorkingDir: "{app}"; IconFilename: "{app}\dcp-cu.exe"; Comment: "Launch dcp-cu"
