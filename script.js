const scareSound = document.getElementById('scareSound');
const blackout = document.getElementById('blackout');
let openedWindows = [];

function openAnnoyingTab() {
  const screenW = window.screen.width;
  const screenH = window.screen.height;
  const x = Math.floor(Math.random() * (screenW - 400));
  const y = Math.floor(Math.random() * (screenH - 300));

  const colors = ['red', 'lime', 'yellow', 'blue', 'orange', 'cyan', 'magenta'];
  const newWindow = window.open("", "_blank", `width=400,height=300,left=${x},top=${y}`);
  if (newWindow) {
    openedWindows.push(newWindow);
    newWindow.document.write(`
      <html><body style="margin:0; background:black; display:flex; justify-content:center; align-items:center; height:100vh;">
        <h1 id="msg" style="font-size:100px; font-family:sans-serif;">YOU ARE AN IDIOT</h1>
        <script>
          const colors = ${JSON.stringify(colors)};
          let i = 0;
          setInterval(() => {
            document.getElementById('msg').style.color = colors[i % colors.length];
            i++;
          }, 300);
          document.documentElement.requestFullscreen().catch(()=>{});
        <\/script>
      </body></html>
    `);
  }
}

function startChaos() {
  let seconds = 0;
  const interval = setInterval(() => {
    for (let i = 0; i < 100; i++) {
      openAnnoyingTab();
    }
    seconds++;
    if (seconds >= 10) {
      clearInterval(interval);
      closeAllWindows();
      triggerBlackout();
    }
  }, 1000);
}

function closeAllWindows() {
  openedWindows.forEach(win => {
    try { win.close(); } catch (e) {}
  });
  openedWindows = [];
}

function triggerBlackout() {
  blackout.style.display = 'block';
  document.body.style.cursor = 'none';

  try {
    scareSound.volume = 1.0;
    scareSound.play();
  } catch (e) {}

  setTimeout(() => {
    blackout.style.display = 'none';
    document.body.style.cursor = 'default';
  }, 10000);
}

window.addEventListener('load', () => {
  requestFullscreen();
  startChaos();
});

function requestFullscreen() {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
  else if (el.msRequestFullscreen) el.msRequestFullscreen();
}
document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'z') {
    closeAllWindows();
    blackout.style.display = 'none';
    document.body.style.cursor = 'default';
    scareSound.pause();
    scareSound.currentTime = 0;

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }
});
