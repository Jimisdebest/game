const scareSound = document.getElementById('scareSound');
const blackout = document.getElementById('blackout');
let openedWindows = [];

function openAnnoyingTab(withMessage = false) {
  const screenW = window.screen.width;
  const screenH = window.screen.height;
  const x = Math.floor(Math.random() * (screenW - 400));
  const y = Math.floor(Math.random() * (screenH - 300));
  const colors = ['red', 'lime', 'yellow', 'blue', 'orange', 'cyan', 'magenta'];

  const newWindow = window.open('', '_blank', `width=400,height=300,left=${x},top=${y}`);
  if (newWindow) {
    openedWindows.push(newWindow);
    newWindow.document.write(`
      <html>
      <head>
        <style>
          body {
            margin: 0;
            background: black;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          #msg {
            animation: spin 4s linear infinite;
            font-size: 80px;
            font-family: sans-serif;
            color: red;
          }
          p {
            color: white;
            font-size: 20px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        ${withMessage ? '<p>💡 Click some tabs away for a better browsing experience</p>' : ''}
        <h1 id="msg">YOU ARE AN IDIOT</h1>
        <audio autoplay>
          <source src="YOUAREANIDIOT.mp3" type="audio/mpeg">
        </audio>
        <script>
          const colors = ${JSON.stringify(colors)};
          let i = 0;
          setInterval(() => {
            document.getElementById('msg').style.color = colors[i % colors.length];
            i++;
          }, 300);
          document.documentElement.requestFullscreen?.();
        <\/script>
      </body>
      </html>
    `);
  }
}

function startChaos() {
  openAnnoyingTab(true); // eerste pop-up met boodschap
  let seconds = 0;
  const interval = setInterval(() => {
    openAnnoyingTab();
    seconds++;
    if (seconds >= 20) {
      clearInterval(interval);
      closeAllWindows();
      triggerBlackout();
    }
  }, 500);
}

function closeAllWindows() {
  openedWindows.forEach(win => {
    try { win.close(); } catch {}
  });
  openedWindows = [];
}

function triggerBlackout() {
  blackout.style.display = 'block';
  document.body.style.cursor = 'none';
  try {
    scareSound.volume = 1.0;
    scareSound.play();
  } catch {}
  setTimeout(() => {
    blackout.style.display = 'none';
    document.body.style.cursor = 'default';
  }, 10000);
}

function requestFullscreen() {
  const el = document.documentElement;
  el.requestFullscreen?.();
  el.webkitRequestFullscreen?.();
  el.mozRequestFullScreen?.();
  el.msRequestFullscreen?.();
}

window.addEventListener('load', () => {
  requestFullscreen();
  startChaos();
});

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
