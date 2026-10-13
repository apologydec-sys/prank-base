(() => {
  const $ = (id) => document.getElementById(id);
  const terminal = $("terminal");
  const progress = $("progress-bar");
  const progressNumber = $("progress-number");
  const countdown = $("countdown");
  const fileCount = $("file-count");
  const reveal = $("reveal");
  const intro = $("intro");
  const dashboard = $("dashboard");
  const beginButton = $("begin-button");
  const replayButton = $("replay-button");
  const soundButton = $("sound-toggle");
  let audioContext = null, soundEnabled = false, runTimer = null, revealTimer = null;
  let progressValue = 0, elapsed = 0;

  // All displayed activity is fictional and runs only inside this page.
  const events = [
    ["CRITICAL", "UNAUTHORIZED ACCESS DETECTED — source signature flagged"],
    ["CRITICAL", "YOUR DEVICE HAS BEEN ATTACKED"],
    ["WARNING", "Locating user directories..."],
    ["CRITICAL", "YOUR FILES MAY HAVE BEEN EXPOSED"],
    ["WARNING", "Unexpected remote session signature detected"],
    ["CRITICAL", "SECURITY BOUNDARY BREACHED — containment failed"],
    ["WARNING", "File index enumeration in progress..."],
    ["CRITICAL", "PERSONAL DATA AT RISK — immediate response required"],
    ["WARNING", "Encrypted payload verification..."],
    ["CRITICAL", "ATTACK IN PROGRESS — connection established"],
    ["WARNING", "Incident escalation level: MAXIMUM"],
    ["CRITICAL", "FINAL WARNING: DEVICE COMPROMISE ACTIVE"]
  ];

  function tone(freq = 440, duration = .12) {
    if (!soundEnabled) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "sine"; osc.frequency.value = freq;
      gain.gain.setValueAtTime(.025, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(); osc.stop(audioContext.currentTime + duration);
    } catch (_) {}
  }

  function addLine(message, level = "warn") {
    const p = document.createElement("p");
    const stamp = document.createElement("span");
    stamp.className = "stamp";
    stamp.textContent = `[00:00:${String(elapsed).padStart(2, "0")}]`;
    const text = document.createElement("span");
    text.className = level === "bad" ? "bad" : level === "ok" ? "ok" : "warn";
    text.textContent = message;
    p.append(stamp, text);
    terminal.appendChild(p);
    while (terminal.children.length > 9) terminal.removeChild(terminal.firstChild);
    terminal.scrollTop = terminal.scrollHeight;
  }

  function resetState() {
    clearInterval(runTimer); runTimer = null;
    clearTimeout(revealTimer); revealTimer = null;
    document.body.classList.remove("glitching");
    terminal.innerHTML = "";
    progressValue = 0; elapsed = 0;
    progress.style.width = "0%"; progressNumber.textContent = "0%";
    countdown.textContent = "00:30"; fileCount.textContent = "0";
    $("breach-status").textContent = "CONFIRMED";
    $("terminal-state").textContent = "ANALYZING";
    $("progress-label").textContent = "CONTAINMENT ANALYSIS";
    [...$("file-list").children].forEach(row => row.lastElementChild.textContent = "SCANNING");
  }

  function tick() {
    elapsed++;
    progressValue = Math.min(100, progressValue + Math.floor(5 + Math.random() * 12));
    progress.style.width = `${progressValue}%`;
    progressNumber.textContent = `${progressValue}%`;
    countdown.textContent = `00:${String(Math.max(0, 30 - elapsed)).padStart(2, "0")}`;
    const event = events[Math.min(events.length - 1, Math.floor((elapsed - 1) / 2))];
    addLine(event[1], event[0] === "CRITICAL" ? "bad" : "warn");
    tone(event[0] === "CRITICAL" ? 196 : 330, .1);

    if (elapsed === 3) {
      $("breach-status").textContent = "ACTIVE";
      fileCount.textContent = "4";
      [...$("file-list").children].forEach(row => row.lastElementChild.textContent = "EXPOSED");
    }
    if (elapsed === 7) $("progress-label").textContent = "FILE ENUMERATION";
    if (elapsed === 12) $("progress-label").textContent = "CONTAINMENT FAILURE";
    if (elapsed >= 18) $("terminal-state").textContent = "ESCALATED";
    if (elapsed >= 22) $("progress-label").textContent = "FINAL INCIDENT RESPONSE";
    if (elapsed >= 30 || progressValue >= 100) finish();
  }

  function finish() {
    clearInterval(runTimer); runTimer = null;
    progress.style.width = "100%"; progressNumber.textContent = "100%";
    addLine("INCIDENT REPORT COMPLETE — SESSION TERMINATING", "bad");
    tone(440, .25);
    revealTimer = setTimeout(() => {
      document.body.classList.add("glitching");
      revealTimer = setTimeout(() => {
        document.body.classList.remove("glitching");
        reveal.classList.remove("hidden");
        replayButton.focus();
        if (soundEnabled) { tone(523, .12); setTimeout(() => tone(784, .18), 140); }
      }, 700);
    }, 900);
  }

  function begin() {
    resetState();
    reveal.classList.add("hidden");
    intro.classList.add("hidden");
    dashboard.classList.remove("hidden");
    addLine("SECURITY KERNEL INITIALIZED", "ok");
    addLine("Incident response sequence initiated...", "warn");
    runTimer = setInterval(tick, 950);
  }

  function replay() {
    resetState();
    reveal.classList.add("hidden");
    dashboard.classList.add("hidden");
    intro.classList.remove("hidden");
    beginButton.focus();
  }

  soundButton.addEventListener("click", async () => {
    soundEnabled = !soundEnabled;
    soundButton.textContent = soundEnabled ? "ALERT SOUND: ON" : "ALERT SOUND: OFF";
    soundButton.classList.toggle("secondary", !soundEnabled);
    if (soundEnabled) {
      try { audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)(); await audioContext.resume(); } catch (_) {}
      tone(440, .1);
    }
  });
  beginButton.addEventListener("click", begin);
  replayButton.addEventListener("click", replay);

  // Decorative Matrix rain only; it does not inspect the device.
  const canvas = $("matrix-rain"), ctx = canvas.getContext("2d");
  const glyphs = "01アイウエオカキクケコサシスセソタチツテト";
  let cols = 0, drops = [];
  function resize() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width / 16);
    drops = Array(cols).fill(1);
  }
  function drawRain() {
    ctx.fillStyle = "rgba(2,8,4,0.09)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4cff83";
    ctx.font = "14px monospace";
    drops.forEach((y, i) => {
      ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    });
    requestAnimationFrame(drawRain);
  }
  window.addEventListener("resize", resize);
  resize(); drawRain();
})();
