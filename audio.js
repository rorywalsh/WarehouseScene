const orcCode = `
; Initialize the global variables. 
; Initialize the global variables. 
ksmps = 32
nchnls = 2
0dbfs = 1

instr SayHello
    iSize = ftlen(1)
    a1 diskin2 "hello.ogg", 1, 0, 0
    aRev ftconv (a1)*.3, 1, 512
    if p4 != 0 then
        outs aRev, aRev          ;output 
    else
        outs a1, a1
    endif

endin

instr FootstepSequencer
if chnget:k("walking") == 1 then
    if metro(1.2+abs(randi:k(.4, 400))) == 1 then
        event "i", "Footsteps", 0, .1, 300
        event "i", "Footsteps", .1, .1, 100
    endif
endif
endin

instr Footsteps
    a1 pinker
    aExp1 linseg 1, p3*.1, 0.001
    aBut1 butterlp a1*aExp1, aExp1*p4
    aBut1 clip aBut1*random:i(6,10), 2, .1
    aR1 reson aBut1, 400, 10, 1
    aHp butterhp aBut1+aR1, 300
    outs aHp, aHp
endin

instr LowRumble
    a1 pinker
    a2 butterlp a1, 100
    outs a2, a2
endin



`;

let csound;
let isLoaded = false;
let isPlaying = false;

CsoundObj.initialize().then(async() => {
    console.log("loading... loaded!");
    csound = new CsoundObj();
    csound.setOption('-m0d');
    csound.setOption('-m0d');
    await loadResources(csound, ['hello.ogg', 'mine.wav']);
    csound.compileOrc(orcCode);
    csound.start();


    isLoaded = true;
});

async function loadResources(csound, filesArray) {
    for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        //   console.log(serverUrl);
        const f = await fetch(file);
        const buffer = await f.arrayBuffer();
        await csound.writeToFS(file, buffer);
        console.log("loaded:", file);
    }
    return true;
}