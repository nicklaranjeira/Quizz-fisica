/**
 * MAIN.JS — INICIALIZAÇÃO, NAVEGAÇÃO DE TELAS, CONTROLE DE EQUIPES E CONFETES
 * Quiz Educacional de Física (Matriz Energética e Sustentabilidade)
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // ELEMENTOS DO DOM
  // ==========================================
  
  // Telas
  const screenTeamSetup = document.getElementById("screen-team-setup");
  const screenHome = document.getElementById("screen-home");
  const screenQuiz = document.getElementById("screen-quiz");
  const screenResult = document.getElementById("screen-result");

  // Modais
  const modalRules = document.getElementById("modal-rules");
  const modalReset = document.getElementById("modal-reset-confirm");

  // Formulário de Configuração das Equipes
  const formTeamSetup = document.getElementById("form-team-setup");
  const inputTeam1 = document.getElementById("input-team-1");
  const inputTeam2 = document.getElementById("input-team-2");
  const teamSetupError = document.getElementById("team-setup-error");
  const btnConfirmTeams = document.getElementById("btn-confirm-teams");

  // Elementos da Tela Inicial
  const homeTeam1Name = document.getElementById("home-team1-name");
  const homeTeam2Name = document.getElementById("home-team2-name");
  const btnStart = document.getElementById("btn-start-game");
  const btnRules = document.getElementById("btn-open-rules");
  const btnCloseRules = document.getElementById("btn-close-rules");
  const btnCloseRulesFooter = document.getElementById("btn-close-rules-footer");

  // Elementos do Header Global
  const btnSoundToggle = document.getElementById("btn-sound-toggle");
  const iconSoundMuted = document.getElementById("icon-sound-muted");
  const iconSoundOn = document.getElementById("icon-sound-on");
  const btnResetStats = document.getElementById("btn-reset-stats");
  const btnConfirmReset = document.getElementById("btn-confirm-reset");
  const btnCancelReset = document.getElementById("btn-cancel-reset");

  // Elementos do HUD do Quiz
  const quizProgressText = document.getElementById("quiz-progress-text");
  const quizProgressBar = document.getElementById("quiz-progress-bar");
  const hudTeam1Name = document.getElementById("hud-team1-name");
  const hudTeam1Points = document.getElementById("hud-team1-points");
  const hudTeam2Name = document.getElementById("hud-team2-name");
  const hudTeam2Points = document.getElementById("hud-team2-points");

  // Botões das Equipes no Quiz
  const btnTeam1 = document.getElementById("btn-team-1");
  const btnTeam2 = document.getElementById("btn-team-2");
  const team1BtnName = document.getElementById("team1-btn-name");
  const team2BtnName = document.getElementById("team2-btn-name");

  // Elementos do Card da Pergunta
  const badgeDifficulty = document.getElementById("badge-difficulty");
  const questionText = document.getElementById("question-text");
  const timerContainer = document.getElementById("timer-container");
  const timerCircleProgress = document.getElementById("timer-circle-progress");
  const timerValue = document.getElementById("timer-value");
  const optionButtons = document.querySelectorAll(".option-btn");
  const btnPassQuestion = document.getElementById("btn-pass-question");
  const feedbackBanner = document.getElementById("feedback-banner");

  // Elementos da Tela de Resultado
  const resultWinnerTitle = document.getElementById("result-winner-title");
  const resultWinnerSub = document.getElementById("result-winner-sub");
  const resultWinnerPoints = document.getElementById("result-winner-points");
  const resultCardTeam1 = document.getElementById("result-card-team1");
  const resultCardTeam2 = document.getElementById("result-card-team2");
  const resultNameTeam1 = document.getElementById("result-name-team1");
  const resultScoreTeam1 = document.getElementById("result-score-team1");
  const resultHitsTeam1 = document.getElementById("result-hits-team1");
  const resultMissesTeam1 = document.getElementById("result-misses-team1");
  const resultNameTeam2 = document.getElementById("result-name-team2");
  const resultScoreTeam2 = document.getElementById("result-score-team2");
  const resultHitsTeam2 = document.getElementById("result-hits-team2");
  const resultMissesTeam2 = document.getElementById("result-misses-team2");
  const btnRestartGame = document.getElementById("btn-restart-game");

  // Canvas de Confetes
  const confettiCanvas = document.getElementById("confetti-canvas");

  // ==========================================
  // SINTETIZADOR DE ÁUDIO WEB (Web Audio API)
  // ==========================================
  
  let audioCtx = null;
  let isSoundMuted = localStorage.getItem("quiz_fisica_sound_muted") === "true";

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = "sine", duration = 0.15, gainVal = 0.1) {
    if (isSoundMuted) return;
    try {
      initAudioContext();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio silenciado
    }
  }

  const SoundFX = {
    click: () => playTone(600, "sine", 0.08, 0.08),
    teamSelect: () => playTone(750, "triangle", 0.1, 0.12),
    pass: () => playTone(450, "sine", 0.12, 0.09),
    correct: () => {
      if (isSoundMuted) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.12, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.2);
        });
      } catch (e) {}
    },
    wrong: () => {
      if (isSoundMuted) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        [280, 220].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + i * 0.14);
          gain.gain.setValueAtTime(0.08, now + i * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.14 + 0.22);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.14);
          osc.stop(now + i * 0.14 + 0.22);
        });
      } catch (e) {}
    },
    timeout: () => {
      if (isSoundMuted) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        [349.23, 293.66, 246.94].forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.1, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.2);
        });
      } catch (e) {}
    },
    victory: () => {
      if (isSoundMuted) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        const now = audioCtx.currentTime;
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.14, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.35);
        });
      } catch (e) {}
    }
  };

  function updateSoundButtonUI() {
    if (isSoundMuted) {
      iconSoundMuted.style.display = "block";
      iconSoundOn.style.display = "none";
      btnSoundToggle.setAttribute("aria-label", "Ativar Som");
      btnSoundToggle.title = "Ativar som";
    } else {
      iconSoundMuted.style.display = "none";
      iconSoundOn.style.display = "block";
      btnSoundToggle.setAttribute("aria-label", "Silenciar Som");
      btnSoundToggle.title = "Silenciar som";
    }
  }

  // ==========================================
  // GERADOR DE CONFETES EM CANVAS (NATIVO)
  // ==========================================

  let confettiAnimationId = null;
  let confettiParticles = [];

  function launchConfetti() {
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext("2d");
    if (!ctx) return;

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#fbbf24"];
    confettiParticles = [];

    const particleCount = 120;
    for (let i = 0; i < particleCount; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height * 0.5 - confettiCanvas.height * 0.4,
        w: Math.random() * 10 + 6,
        h: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        velX: (Math.random() - 0.5) * 4,
        velY: Math.random() * 3 + 2.5,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }

    let startTime = Date.now();

    function renderConfetti() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      const elapsed = (Date.now() - startTime) / 1000;

      let stillAlive = false;
      confettiParticles.forEach(p => {
        p.x += p.velX;
        p.y += p.velY;
        p.rotation += p.rotSpeed;

        if (elapsed > 3.5) {
          p.opacity -= 0.015;
        }

        if (p.opacity > 0 && p.y < confettiCanvas.height + 20) {
          stillAlive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });

      if (stillAlive && elapsed < 6) {
        confettiAnimationId = requestAnimationFrame(renderConfetti);
      } else {
        stopConfetti();
      }
    }

    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
    }
    renderConfetti();
  }

  function stopConfetti() {
    if (confettiAnimationId) {
      cancelAnimationFrame(confettiAnimationId);
      confettiAnimationId = null;
    }
    if (confettiCanvas) {
      const ctx = confettiCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }
  }

  window.addEventListener("resize", () => {
    if (confettiCanvas && confettiAnimationId) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });

  // ==========================================
  // NAVEGAÇÃO DE TELAS
  // ==========================================
  
  function showScreen(screenName) {
    if (screenName !== "result") {
      stopConfetti();
    }

    screenTeamSetup.classList.remove("active");
    screenHome.classList.remove("active");
    screenQuiz.classList.remove("active");
    screenResult.classList.remove("active");

    if (screenName === "team-setup") {
      screenTeamSetup.classList.add("active");
      if (inputTeam1) inputTeam1.focus();
    } else if (screenName === "home") {
      screenHome.classList.add("active");
      updateHomeScreenMatchup();
    } else if (screenName === "quiz") {
      screenQuiz.classList.add("active");
    } else if (screenName === "result") {
      screenResult.classList.add("active");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateHomeScreenMatchup() {
    const teams = QuizEngine.getTeamsData();
    if (homeTeam1Name) homeTeam1Name.textContent = teams.team1.name || "Equipe 1";
    if (homeTeam2Name) homeTeam2Name.textContent = teams.team2.name || "Equipe 2";
  }

  function updateScoreboardUI() {
    const teams = QuizEngine.getTeamsData();
    if (hudTeam1Name) hudTeam1Name.textContent = teams.team1.name || "Equipe 1";
    if (hudTeam1Points) hudTeam1Points.textContent = `${teams.team1.score} PTS`;
    if (hudTeam2Name) hudTeam2Name.textContent = teams.team2.name || "Equipe 2";
    if (hudTeam2Points) hudTeam2Points.textContent = `${teams.team2.score} PTS`;
  }

  // ==========================================
  // GERENCIAMENTO DE MODAIS
  // ==========================================

  function openModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.add("active");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("active");
    modalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Fechar modais ao clicar no backdrop ou tecla ESC
  [modalRules, modalReset].forEach(modal => {
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(modalRules);
      closeModal(modalReset);
    }
  });

  // ==========================================
  // RENDERIZAÇÃO DO QUIZ E TIMER
  // ==========================================

  const CIRCLE_CIRCUMFERENCE = 163.36; // 2 * PI * r (r=26)

  function updateTimerVisual(secondsLeft, totalSeconds = 20) {
    if (timerValue) {
      timerValue.textContent = secondsLeft;
    }

    if (timerCircleProgress) {
      const offset = CIRCLE_CIRCUMFERENCE * (1 - secondsLeft / totalSeconds);
      timerCircleProgress.style.strokeDashoffset = offset;
    }

    if (timerContainer) {
      timerContainer.classList.remove("warning", "alert");
      if (secondsLeft <= 3) {
        timerContainer.classList.add("alert");
      } else if (secondsLeft <= 7) {
        timerContainer.classList.add("warning");
      }
    }
  }

  function renderQuestion(qData) {
    if (!qData) return;

    // Atualiza HUD
    if (quizProgressText) {
      quizProgressText.textContent = `Pergunta ${qData.questionNumber} de ${qData.totalQuestions}`;
    }
    if (quizProgressBar) {
      const pct = (qData.questionNumber / qData.totalQuestions) * 100;
      quizProgressBar.style.width = `${pct}%`;
    }

    // Atualiza Placar das Equipes no HUD
    updateScoreboardUI();

    // Atualiza Nomes nos Botões das Equipes
    const teams = qData.teams;
    if (team1BtnName) team1BtnName.textContent = teams.team1.name;
    if (team2BtnName) team2BtnName.textContent = teams.team2.name;

    // Reseta estado de seleção dos botões de equipe
    if (btnTeam1) {
      btnTeam1.disabled = false;
      btnTeam1.classList.remove("selected");
    }
    if (btnTeam2) {
      btnTeam2.disabled = false;
      btnTeam2.classList.remove("selected");
    }

    // Atualiza Badge de Dificuldade
    if (badgeDifficulty) {
      badgeDifficulty.className = `badge-difficulty ${qData.difficulty}`;
      const diffMap = {
        facil: "Nível Fácil",
        medio: "Nível Médio",
        dificil: "Nível Difícil"
      };
      badgeDifficulty.textContent = diffMap[qData.difficulty] || qData.difficulty;
    }

    // Texto da pergunta
    if (questionText) {
      questionText.textContent = qData.question;
    }

    // Esconde feedback banner
    if (feedbackBanner) {
      feedbackBanner.className = "feedback-banner";
      feedbackBanner.textContent = "";
    }

    // Reseta e habilita botão de passar
    if (btnPassQuestion) {
      btnPassQuestion.disabled = false;
    }

    // Reseta e renderiza as alternativas
    optionButtons.forEach((btn, idx) => {
      btn.disabled = false;
      btn.className = "option-btn";
      const txtSpan = btn.querySelector(".option-text");
      const iconSpan = btn.querySelector(".option-status-icon");

      if (txtSpan && qData.options[idx]) {
        txtSpan.textContent = qData.options[idx];
      }
      if (iconSpan) {
        iconSpan.textContent = "";
      }
    });

    // Inicia o cronômetro de 20s
    QuizEngine.startTimer(
      (secondsLeft, total) => {
        updateTimerVisual(secondsLeft, total);
      },
      (timeoutResult) => {
        handleTimeoutUI(timeoutResult);
      }
    );
  }

  // Feedback de Tempo Esgotado
  function handleTimeoutUI(result) {
    SoundFX.timeout();
    lockQuizControls();

    // Mostra a alternativa correta
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === result.correctOptionIndex) {
        btn.classList.add("correct");
        const iconSpan = btn.querySelector(".option-status-icon");
        if (iconSpan) iconSpan.textContent = "✓";
      } else {
        btn.classList.add("dimmed");
      }
    });

    // Banner de feedback
    if (feedbackBanner) {
      feedbackBanner.className = "feedback-banner timeout show";
      feedbackBanner.textContent = "⏰ TEMPO ESGOTADO! (0 PONTOS)";
    }

    // Aguarda e avança
    setTimeout(() => {
      advanceFlow();
    }, 1800);
  }

  // Ação de Passar Pergunta
  function handlePassClick() {
    initAudioContext();
    SoundFX.pass();
    const result = QuizEngine.passQuestion();
    if (!result) return;

    lockQuizControls();

    // Mostra a alternativa correta suavemente
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === result.correctOptionIndex) {
        btn.classList.add("correct");
        const iconSpan = btn.querySelector(".option-status-icon");
        if (iconSpan) iconSpan.textContent = "✓";
      } else {
        btn.classList.add("dimmed");
      }
    });

    // Banner de feedback
    if (feedbackBanner) {
      feedbackBanner.className = "feedback-banner pass show";
      feedbackBanner.textContent = "⏭️ PERGUNTA PASSADA (0 PONTOS)";
    }

    // Aguarda e avança
    setTimeout(() => {
      advanceFlow();
    }, 1600);
  }

  // Resposta clicada pelo usuário
  function handleOptionClick(selectedIndex) {
    initAudioContext();

    // Verifica se uma equipe foi selecionada antes de responder
    const selectedTeam = QuizEngine.getSelectedTeam();
    if (!selectedTeam) {
      SoundFX.click();
      if (feedbackBanner) {
        feedbackBanner.className = "feedback-banner warning show";
        feedbackBanner.textContent = "⚠️ Selecione uma equipe primeiro.";
      }
      return;
    }

    const result = QuizEngine.submitAnswer(selectedIndex);
    if (!result || result.error) return; // Bloqueado ou inválido

    lockQuizControls();

    // Atualiza Placar das Equipes no HUD
    updateScoreboardUI();

    // Atualiza estilo dos botões das alternativas
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      const iconSpan = btn.querySelector(".option-status-icon");

      if (idx === selectedIndex) {
        if (result.isCorrect) {
          btn.classList.add("correct");
          if (iconSpan) iconSpan.textContent = "✓";
        } else {
          btn.classList.add("wrong");
          if (iconSpan) iconSpan.textContent = "✕";
        }
      } else if (idx === result.correctOptionIndex) {
        // Mostra a correta caso a equipe tenha errado
        btn.classList.add("correct");
        if (iconSpan) iconSpan.textContent = "✓";
      } else {
        btn.classList.add("dimmed");
      }
    });

    // Som e Banner
    if (result.isCorrect) {
      SoundFX.correct();
      if (feedbackBanner) {
        feedbackBanner.className = "feedback-banner correct show";
        feedbackBanner.textContent = `✓ CORRETO! (+100 PONTOS PARA ${result.teamName.toUpperCase()})`;
      }
    } else {
      SoundFX.wrong();
      if (feedbackBanner) {
        feedbackBanner.className = "feedback-banner wrong show";
        feedbackBanner.textContent = `✕ INCORRETO! (-100 PONTOS PARA ${result.teamName.toUpperCase()})`;
      }
    }

    // Aguarda 1.8s e avança
    setTimeout(() => {
      advanceFlow();
    }, 1800);
  }

  // Bloqueia todos os controles do quiz após uma resposta/timeout/pass
  function lockQuizControls() {
    optionButtons.forEach(btn => (btn.disabled = true));
    if (btnTeam1) btnTeam1.disabled = true;
    if (btnTeam2) btnTeam2.disabled = true;
    if (btnPassQuestion) btnPassQuestion.disabled = true;
  }

  // Seleção de Equipe na Tela do Quiz
  function handleTeamSelection(teamKey) {
    initAudioContext();
    const success = QuizEngine.selectTeam(teamKey);
    if (!success) return;

    SoundFX.teamSelect();

    if (teamKey === "team1") {
      btnTeam1.classList.add("selected");
      btnTeam2.classList.remove("selected");
    } else {
      btnTeam2.classList.add("selected");
      btnTeam1.classList.remove("selected");
    }

    // Limpa aviso de "Selecione uma equipe primeiro" se estiver visível
    if (feedbackBanner && feedbackBanner.classList.contains("warning")) {
      feedbackBanner.className = "feedback-banner";
      feedbackBanner.textContent = "";
    }
  }

  // Avança para a próxima questão ou tela de resultado
  function advanceFlow() {
    const advanceResult = QuizEngine.advance();
    if (advanceResult.isRoundComplete) {
      renderResultsScreen(advanceResult);
      showScreen("result");
    } else {
      renderQuestion(advanceResult.nextQuestion);
    }
  }

  // ==========================================
  // RENDERIZAÇÃO DA TELA DE RESULTADO FINAL
  // ==========================================

  function renderResultsScreen(result) {
    const team1 = result.teams.team1;
    const team2 = result.teams.team2;

    // Preenche cards das duas equipes
    if (resultNameTeam1) resultNameTeam1.textContent = team1.name;
    if (resultScoreTeam1) resultScoreTeam1.textContent = `${team1.score} PTS`;
    if (resultHitsTeam1) resultHitsTeam1.textContent = `✓ ${team1.hits} acertos`;
    if (resultMissesTeam1) resultMissesTeam1.textContent = `✕ ${team1.misses} erros`;

    if (resultNameTeam2) resultNameTeam2.textContent = team2.name;
    if (resultScoreTeam2) resultScoreTeam2.textContent = `${team2.score} PTS`;
    if (resultHitsTeam2) resultHitsTeam2.textContent = `✓ ${team2.hits} acertos`;
    if (resultMissesTeam2) resultMissesTeam2.textContent = `✕ ${team2.misses} erros`;

    // Reseta classes de vencedor nos cards
    if (resultCardTeam1) resultCardTeam1.classList.remove("winner");
    if (resultCardTeam2) resultCardTeam2.classList.remove("winner");

    if (result.isTie) {
      // Cenário de Empate
      if (resultWinnerTitle) resultWinnerTitle.textContent = "EMPATE!";
      if (resultWinnerSub) resultWinnerSub.textContent = "AMBAS AS EQUIPES EMPATARAM!";
      if (resultWinnerPoints) resultWinnerPoints.textContent = `${team1.score} PONTOS`;
    } else {
      // Cenário de Vitória
      const winnerName = result.winnerName;
      const winnerScore = result.winnerScore;

      if (resultWinnerTitle) resultWinnerTitle.textContent = "PARABÉNS!";
      if (resultWinnerSub) resultWinnerSub.textContent = `A EQUIPE ${winnerName.toUpperCase()} VENCEU!`;
      if (resultWinnerPoints) resultWinnerPoints.textContent = `${winnerScore} PONTOS`;

      if (result.winner === "team1" && resultCardTeam1) {
        resultCardTeam1.classList.add("winner");
      } else if (result.winner === "team2" && resultCardTeam2) {
        resultCardTeam2.classList.add("winner");
      }
    }

    // Efeito Sonoro de Vitória e Chuva de Confetes
    SoundFX.victory();
    launchConfetti();
  }

  // ==========================================
  // FLUXO DE REINÍCIO COMPLETO DA PARTIDA
  // ==========================================

  function performFullRestart() {
    QuizEngine.resetMatch();
    stopConfetti();

    // Limpa campos de configuração
    if (inputTeam1) inputTeam1.value = "";
    if (inputTeam2) inputTeam2.value = "";
    if (teamSetupError) teamSetupError.style.display = "none";

    showScreen("team-setup");
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  // 1. Confirmar Configuração das Equipes
  if (btnConfirmTeams) {
    btnConfirmTeams.addEventListener("click", () => {
      initAudioContext();
      const name1 = (inputTeam1.value || "").trim();
      const name2 = (inputTeam2.value || "").trim();

      if (!name1 || !name2) {
        SoundFX.wrong();
        if (teamSetupError) {
          teamSetupError.style.display = "block";
        }
        if (!name1 && inputTeam1) inputTeam1.focus();
        else if (!name2 && inputTeam2) inputTeam2.focus();
        return;
      }

      if (teamSetupError) {
        teamSetupError.style.display = "none";
      }

      SoundFX.click();
      QuizEngine.setTeams(name1, name2);
      showScreen("home");
    });
  }

  // Permite confirmar pressionando Enter nos inputs
  [inputTeam1, inputTeam2].forEach(input => {
    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (btnConfirmTeams) btnConfirmTeams.click();
        }
      });
      input.addEventListener("input", () => {
        if (teamSetupError) {
          teamSetupError.style.display = "none";
        }
      });
    }
  });

  // 2. Iniciar Jogo (da Tela Inicial)
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      SoundFX.click();
      const firstQ = QuizEngine.startNewRound();
      showScreen("quiz");
      renderQuestion(firstQ);
    });
  }

  // 3. Botões de Seleção de Equipe no Quiz
  if (btnTeam1) {
    btnTeam1.addEventListener("click", () => {
      handleTeamSelection("team1");
    });
  }

  if (btnTeam2) {
    btnTeam2.addEventListener("click", () => {
      handleTeamSelection("team2");
    });
  }

  // 4. Botões de Alternativas
  optionButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      handleOptionClick(index);
    });
  });

  // 5. Botão Passar Pergunta
  if (btnPassQuestion) {
    btnPassQuestion.addEventListener("click", () => {
      handlePassClick();
    });
  }

  // 6. Botão Reiniciar Jogo (da Tela de Resultado)
  if (btnRestartGame) {
    btnRestartGame.addEventListener("click", () => {
      SoundFX.click();
      performFullRestart();
    });
  }

  // 7. Modais de Regras
  if (btnRules) {
    btnRules.addEventListener("click", () => {
      SoundFX.click();
      openModal(modalRules);
    });
  }
  if (btnCloseRules) {
    btnCloseRules.addEventListener("click", () => {
      SoundFX.click();
      closeModal(modalRules);
    });
  }
  if (btnCloseRulesFooter) {
    btnCloseRulesFooter.addEventListener("click", () => {
      SoundFX.click();
      closeModal(modalRules);
    });
  }

  // 8. Toggle de Som
  if (btnSoundToggle) {
    btnSoundToggle.addEventListener("click", () => {
      initAudioContext();
      isSoundMuted = !isSoundMuted;
      localStorage.setItem("quiz_fisica_sound_muted", isSoundMuted.toString());
      updateSoundButtonUI();
      if (!isSoundMuted) {
        SoundFX.click();
      }
    });
  }

  // 9. Resetar Partida pelo Header
  if (btnResetStats) {
    btnResetStats.addEventListener("click", () => {
      SoundFX.click();
      openModal(modalReset);
    });
  }
  if (btnConfirmReset) {
    btnConfirmReset.addEventListener("click", () => {
      closeModal(modalReset);
      SoundFX.click();
      performFullRestart();
    });
  }
  if (btnCancelReset) {
    btnCancelReset.addEventListener("click", () => {
      closeModal(modalReset);
      SoundFX.click();
    });
  }

  // ==========================================
  // INICIALIZAÇÃO DA INTERFACE
  // ==========================================
  
  updateSoundButtonUI();
  showScreen("team-setup");
});
