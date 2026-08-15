/**
 * MAIN.JS — INICIALIZAÇÃO, NAVEGAÇÃO DE TELAS, MODAIS E INTERFACE DE USUÁRIO
 * Quiz Educacional de Física (Matriz Energética e Sustentabilidade)
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // ELEMENTOS DO DOM
  // ==========================================
  
  // Telas
  const screenHome = document.getElementById("screen-home");
  const screenQuiz = document.getElementById("screen-quiz");
  const screenResult = document.getElementById("screen-result");

  // Modais
  const modalRules = document.getElementById("modal-rules");
  const modalLevelUp = document.getElementById("modal-level-up");
  const modalReset = document.getElementById("modal-reset-confirm");

  // Botões de Ação
  const btnStart = document.getElementById("btn-start-game");
  const btnRules = document.getElementById("btn-open-rules");
  const btnCloseRules = document.getElementById("btn-close-rules");
  const btnCloseRulesFooter = document.getElementById("btn-close-rules-footer");
  const btnPlayAgain = document.getElementById("btn-play-again");
  const btnBackToHome = document.getElementById("btn-back-to-home");
  const btnCloseLevelUp = document.getElementById("btn-close-levelup");
  const btnSoundToggle = document.getElementById("btn-sound-toggle");
  const btnResetStats = document.getElementById("btn-reset-stats");
  const btnConfirmReset = document.getElementById("btn-confirm-reset");
  const btnCancelReset = document.getElementById("btn-cancel-reset");

  // Elementos do Header Global
  const headerLevelBadge = document.getElementById("header-level-badge");
  const iconSoundMuted = document.getElementById("icon-sound-muted");
  const iconSoundOn = document.getElementById("icon-sound-on");

  // Elementos da Tela Inicial
  const homeStatLevel = document.getElementById("home-stat-level");
  const homeStatXP = document.getElementById("home-stat-xp");
  const homeStatRounds = document.getElementById("home-stat-rounds");

  // Elementos do HUD do Quiz
  const quizProgressText = document.getElementById("quiz-progress-text");
  const quizProgressBar = document.getElementById("quiz-progress-bar");
  const quizScoreBadge = document.getElementById("quiz-score-badge");
  const quizHitsBadge = document.getElementById("quiz-hits-badge");
  const quizMissesBadge = document.getElementById("quiz-misses-badge");

  // Elementos do Card da Pergunta
  const badgeDifficulty = document.getElementById("badge-difficulty");
  const questionText = document.getElementById("question-text");
  const timerContainer = document.getElementById("timer-container");
  const timerCircleProgress = document.getElementById("timer-circle-progress");
  const timerValue = document.getElementById("timer-value");
  const optionButtons = document.querySelectorAll(".option-btn");
  const feedbackBanner = document.getElementById("feedback-banner");

  // Elementos da Tela de Resultado
  const resultScoreHighlight = document.getElementById("result-score-highlight");
  const resultHitsBox = document.getElementById("result-hits-box");
  const resultMissesBox = document.getElementById("result-misses-box");
  const resultXpGainedTag = document.getElementById("result-xp-gained-tag");
  const resultLevelTag = document.getElementById("result-level-tag");
  const resultTotalXpText = document.getElementById("result-total-xp-text");
  const resultXpBarFill = document.getElementById("result-xp-bar-fill");
  const resultXpNextText = document.getElementById("result-xp-next-text");

  // Elementos do Modal de Level Up
  const levelUpNewLevelText = document.getElementById("levelup-new-level");

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
      // Áudio silenciado por permissão de autoplay
    }
  }

  const SoundFX = {
    click: () => playTone(600, "sine", 0.08, 0.08),
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
    levelUp: () => {
      if (isSoundMuted) return;
      try {
        initAudioContext();
        if (!audioCtx) return;
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        const now = audioCtx.currentTime;
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.14, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.3);
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
  // NAVEGAÇÃO DE TELAS
  // ==========================================
  
  function showScreen(screenName) {
    screenHome.classList.remove("active");
    screenQuiz.classList.remove("active");
    screenResult.classList.remove("active");

    if (screenName === "home") {
      screenHome.classList.add("active");
      updateHomeScreenStats();
    } else if (screenName === "quiz") {
      screenQuiz.classList.add("active");
    } else if (screenName === "result") {
      screenResult.classList.add("active");
    }
    updateGlobalHeader();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateGlobalHeader() {
    const stats = QuizEngine.getPlayerStats();
    if (headerLevelBadge) {
      headerLevelBadge.textContent = `Nível ${stats.level}`;
    }
  }

  function updateHomeScreenStats() {
    const stats = QuizEngine.getPlayerStats();
    if (homeStatLevel) homeStatLevel.textContent = stats.level;
    if (homeStatXP) homeStatXP.textContent = stats.totalXP;
    if (homeStatRounds) homeStatRounds.textContent = Math.max(1, stats.currentRound - 1);
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
  [modalRules, modalLevelUp, modalReset].forEach(modal => {
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
      closeModal(modalLevelUp);
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
    if (quizScoreBadge) quizScoreBadge.textContent = `${qData.score} PTS`;
    if (quizHitsBadge) quizHitsBadge.textContent = `✓ ${qData.hits}`;
    if (quizMissesBadge) quizMissesBadge.textContent = `✕ ${qData.misses}`;

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

    // Bloqueia botões
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

    // Atualiza HUD
    if (quizMissesBadge) quizMissesBadge.textContent = `✕ ${result.misses}`;

    // Banner de feedback
    if (feedbackBanner) {
      feedbackBanner.className = "feedback-banner timeout show";
      feedbackBanner.textContent = "⏰ TEMPO ESGOTADO!";
    }

    // Aguarda e avança
    setTimeout(() => {
      advanceFlow();
    }, 1800);
  }

  // Resposta clicada pelo usuário
  function handleOptionClick(selectedIndex) {
    initAudioContext();
    const result = QuizEngine.submitAnswer(selectedIndex);
    if (!result) return; // Já bloqueado ou inválido

    // Atualiza HUD
    if (quizScoreBadge) quizScoreBadge.textContent = `${result.totalScore} PTS`;
    if (quizHitsBadge) quizHitsBadge.textContent = `✓ ${result.hits}`;
    if (quizMissesBadge) quizMissesBadge.textContent = `✕ ${result.misses}`;
    updateGlobalHeader();

    // Atualiza estilo dos botões
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
        // Mostra a correta caso o usuário tenha errado
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
        feedbackBanner.textContent = "✓ CORRETO! (+100 PONTOS / +10 XP)";
      }
    } else {
      SoundFX.wrong();
      if (feedbackBanner) {
        feedbackBanner.className = "feedback-banner wrong show";
        feedbackBanner.textContent = "✕ INCORRETO!";
      }
    }

    // Verifica se subiu de nível durante a questão
    if (result.didLevelUp) {
      setTimeout(() => {
        triggerLevelUpCelebration(result.newLevel);
      }, 500);
    }

    // Aguarda 1.8s e avança
    setTimeout(() => {
      advanceFlow();
    }, 1800);
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
  // RENDERIZAÇÃO DA TELA DE RESULTADO
  // ==========================================

  function renderResultsScreen(result) {
    if (resultScoreHighlight) {
      resultScoreHighlight.textContent = `${result.finalScore} PONTOS`;
    }
    if (resultHitsBox) {
      resultHitsBox.textContent = `✓ ${result.hits} ACERTOS`;
    }
    if (resultMissesBox) {
      resultMissesBox.textContent = `✕ ${result.misses} ERROS`;
    }
    if (resultXpGainedTag) {
      resultXpGainedTag.textContent = `+${result.roundXPGained} XP`;
    }
    if (resultLevelTag) {
      resultLevelTag.textContent = `NÍVEL: ${result.level}`;
    }
    if (resultTotalXpText) {
      resultTotalXpText.textContent = `XP TOTAL: ${result.totalXP}`;
    }

    const lvlData = result.levelData;
    if (resultXpBarFill) {
      resultXpBarFill.style.width = "0%";
      setTimeout(() => {
        resultXpBarFill.style.width = `${lvlData.progressPercent}%`;
      }, 200);
    }
    if (resultXpNextText) {
      resultXpNextText.textContent = `${lvlData.xpInCurrentLevel} / ${lvlData.xpRequiredForNext} XP para o Nível ${lvlData.level + 1}`;
    }

    updateGlobalHeader();
  }

  // Celebração de Level Up
  function triggerLevelUpCelebration(newLevel) {
    SoundFX.levelUp();
    if (levelUpNewLevelText) {
      levelUpNewLevelText.textContent = `NÍVEL ${newLevel}!`;
    }
    openModal(modalLevelUp);
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================

  // Iniciar Jogo
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      SoundFX.click();
      const firstQ = QuizEngine.startNewRound();
      showScreen("quiz");
      renderQuestion(firstQ);
    });
  }

  // Jogar Novamente
  if (btnPlayAgain) {
    btnPlayAgain.addEventListener("click", () => {
      SoundFX.click();
      const firstQ = QuizEngine.startNewRound();
      showScreen("quiz");
      renderQuestion(firstQ);
    });
  }

  // Voltar ao Início
  if (btnBackToHome) {
    btnBackToHome.addEventListener("click", () => {
      SoundFX.click();
      showScreen("home");
    });
  }

  // Botões de Alternativas
  optionButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      handleOptionClick(index);
    });
  });

  // Abrir e Fechar Modal de Regras
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

  // Fechar Modal de Level Up
  if (btnCloseLevelUp) {
    btnCloseLevelUp.addEventListener("click", () => {
      SoundFX.click();
      closeModal(modalLevelUp);
    });
  }

  // Toggle de Som
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

  // Resetar Progresso
  if (btnResetStats) {
    btnResetStats.addEventListener("click", () => {
      SoundFX.click();
      openModal(modalReset);
    });
  }
  if (btnConfirmReset) {
    btnConfirmReset.addEventListener("click", () => {
      QuizEngine.resetProgress();
      closeModal(modalReset);
      updateGlobalHeader();
      updateHomeScreenStats();
      SoundFX.click();
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
  showScreen("home");
});
