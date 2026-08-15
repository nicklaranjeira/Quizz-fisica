/**
 * QUIZ.JS — LÓGICA DO JOGO DE QUIZ EDUCACIONAL DE FÍSICA
 * Gerenciamento de Estado, Seleção/Embaralhamento com Bloqueio de 3 Rodadas,
 * Temporizador de 20s, Validação de Gabarito, Pontuação, XP, Níveis e LocalStorage.
 */

const QuizEngine = (() => {
  // Constantes de Configuração
  const QUESTIONS_PER_ROUND = 10;
  const SECONDS_PER_QUESTION = 20;
  const POINTS_PER_CORRECT = 100;
  const XP_PER_100_POINTS = 10;
  const LOCKOUT_ROUNDS = 2; // Bloqueia nas 2 rodadas seguintes (reaparece a partir da rodada R + 3)

  // Chaves do LocalStorage
  const STORAGE_KEYS = {
    TOTAL_XP: "quiz_fisica_total_xp",
    LEVEL: "quiz_fisica_level",
    CURRENT_ROUND: "quiz_fisica_round",
    QUESTION_HISTORY: "quiz_fisica_history",
    GAMES_PLAYED: "quiz_fisica_games_played",
    TOTAL_HITS: "quiz_fisica_total_hits",
    SOUND_MUTED: "quiz_fisica_sound_muted"
  };

  // Estado do Quiz
  const state = {
    totalXP: 0,
    level: 1,
    currentRound: 1,
    questionHistory: {}, // { [questionId]: lastRoundNumber }
    gamesPlayed: 0,
    totalHits: 0,

    // Estado da rodada ativa
    activeRoundQuestions: [],
    currentQuestionIndex: 0,
    currentScore: 0,
    currentHits: 0,
    currentMisses: 0,
    roundXPGained: 0,
    
    // Controle do timer
    timerSecondsLeft: SECONDS_PER_QUESTION,
    timerInterval: null,
    isAnswerLocked: false,
    timerCallback: null,
    
    // Callbacks de eventos
    onTimerTick: null,
    onTimerExpire: null,
    onQuestionAnswered: null,
    onRoundFinished: null,
    onLevelUp: null
  };

  /**
   * Embaralhador Fisher-Yates genérico
   */
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Cálculo de Nível e Progresso de XP
   * Nível 1: 0 - 99 XP (100 XP para subir)
   * Nível 2: 100 - 249 XP (150 XP para subir)
   * Nível 3: 250 - 449 XP (200 XP para subir)
   * Nível 4: 450 - 699 XP (250 XP para subir)
   * Nível N: curva suave e progressiva
   */
  function calculateLevelData(xp) {
    let currentLvl = 1;
    let accumulatedNeeded = 0;
    let step = 100;

    while (true) {
      if (xp < accumulatedNeeded + step) {
        const xpInCurrentLevel = xp - accumulatedNeeded;
        const xpRequiredForNext = step;
        const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpRequiredForNext) * 100)));
        return {
          level: currentLvl,
          xpInCurrentLevel,
          xpRequiredForNext,
          progressPercent,
          totalXP: xp
        };
      }
      accumulatedNeeded += step;
      currentLvl++;
      step += 50; // Cada nível exige 50 XP adicionais
    }
  }

  /**
   * Inicializa e carrega dados salvos no LocalStorage
   */
  function init() {
    try {
      const savedXP = localStorage.getItem(STORAGE_KEYS.TOTAL_XP);
      const savedRound = localStorage.getItem(STORAGE_KEYS.CURRENT_ROUND);
      const savedHistory = localStorage.getItem(STORAGE_KEYS.QUESTION_HISTORY);
      const savedGames = localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED);
      const savedTotalHits = localStorage.getItem(STORAGE_KEYS.TOTAL_HITS);

      state.totalXP = savedXP !== null ? parseInt(savedXP, 10) : 0;
      state.currentRound = savedRound !== null ? parseInt(savedRound, 10) : 1;
      state.questionHistory = savedHistory ? JSON.parse(savedHistory) : {};
      state.gamesPlayed = savedGames !== null ? parseInt(savedGames, 10) : 0;
      state.totalHits = savedTotalHits !== null ? parseInt(savedTotalHits, 10) : 0;

      const lvlData = calculateLevelData(state.totalXP);
      state.level = lvlData.level;
    } catch (e) {
      console.warn("Erro ao carregar dados do localStorage:", e);
      state.totalXP = 0;
      state.level = 1;
      state.currentRound = 1;
      state.questionHistory = {};
    }
  }

  /**
   * Salva progresso no LocalStorage
   */
  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEYS.TOTAL_XP, state.totalXP.toString());
      localStorage.setItem(STORAGE_KEYS.LEVEL, state.level.toString());
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROUND, state.currentRound.toString());
      localStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(state.questionHistory));
      localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, state.gamesPlayed.toString());
      localStorage.setItem(STORAGE_KEYS.TOTAL_HITS, state.totalHits.toString());
    } catch (e) {
      console.warn("Erro ao salvar no localStorage:", e);
    }
  }

  /**
   * Seleciona 10 questões elegíveis para a rodada atual respeitando a regra de 3 rodadas
   * Uma questão usada na rodada R só reaparece na rodada R + 3 (bloqueada em R+1 e R+2).
   */
  function selectEligibleQuestions() {
    const round = state.currentRound;

    // Filtra questões elegíveis
    const isEligible = (q) => {
      const lastRound = state.questionHistory[q.id];
      if (lastRound === undefined) return true; // Nunca usada
      return (round - lastRound) > LOCKOUT_ROUNDS; // Ex: se round=4 e last=1, 4-1 = 3 > 2 (Liberada!)
    };

    let eligible = QUESTIONS_DATABASE.filter(isEligible);

    // Fallback de segurança se por algum motivo extremo não houver 10 elegíveis
    if (eligible.length < QUESTIONS_PER_ROUND) {
      console.warn("Poucas questões elegíveis encontradas. Liberando as mais antigas.");
      const sortedByAge = [...QUESTIONS_DATABASE].sort((a, b) => {
        const roundA = state.questionHistory[a.id] || 0;
        const roundB = state.questionHistory[b.id] || 0;
        return roundA - roundB;
      });
      eligible = sortedByAge.slice(0, QUESTIONS_PER_ROUND);
    }

    // Separa por dificuldade para distribuição equilibrada
    const faciles = shuffleArray(eligible.filter(q => q.difficulty === "facil"));
    const medios = shuffleArray(eligible.filter(q => q.difficulty === "medio"));
    const dificeis = shuffleArray(eligible.filter(q => q.difficulty === "dificil"));

    // Distribuição balanceada ideal: 4 fáceis, 3 médias, 3 difíceis (ou 3-4-3)
    let selected = [];

    // Pega fáceis (meta: 3 a 4)
    const targetFacil = Math.min(faciles.length, (state.currentRound % 3 === 1) ? 4 : 3);
    selected.push(...faciles.slice(0, targetFacil));

    // Pega médias (meta: 3 a 4)
    const targetMedio = Math.min(medios.length, (state.currentRound % 3 === 2) ? 4 : 3);
    selected.push(...medios.slice(0, targetMedio));

    // Pega difíceis (meta: restante até 10)
    const targetDificil = Math.min(dificeis.length, (state.currentRound % 3 === 0) ? 4 : 3);
    selected.push(...dificeis.slice(0, targetDificil));

    // Se ainda faltar para completar 10 devido a variações nos pools
    if (selected.length < QUESTIONS_PER_ROUND) {
      const selectedIds = new Set(selected.map(q => q.id));
      const remainingEligible = shuffleArray(eligible.filter(q => !selectedIds.has(q.id)));
      selected.push(...remainingEligible.slice(0, QUESTIONS_PER_ROUND - selected.length));
    }

    // Se ainda faltar (caso extremo), completa com qualquer questão disponível
    if (selected.length < QUESTIONS_PER_ROUND) {
      const selectedIds = new Set(selected.map(q => q.id));
      const allShuffled = shuffleArray(QUESTIONS_DATABASE.filter(q => !selectedIds.has(q.id)));
      selected.push(...allShuffled.slice(0, QUESTIONS_PER_ROUND - selected.length));
    }

    // Embaralha a ordem final das 10 perguntas da rodada
    selected = shuffleArray(selected.slice(0, QUESTIONS_PER_ROUND));

    // Prepara as questões embaralhando suas alternativas e recalculando o gabarito
    const preparedQuestions = selected.map(q => {
      const correctOptionText = q.options[q.correctAnswerIndex];
      const shuffledOptions = shuffleArray(q.options);
      const newCorrectIndex = shuffledOptions.indexOf(correctOptionText);

      return {
        id: q.id,
        difficulty: q.difficulty,
        question: q.question,
        options: shuffledOptions,
        correctAnswerIndex: newCorrectIndex,
        originalCorrectIndex: q.correctAnswerIndex
      };
    });

    return preparedQuestions;
  }

  /**
   * Inicia uma nova rodada
   */
  function startNewRound() {
    stopTimer();

    const selectedQuestions = selectEligibleQuestions();
    state.activeRoundQuestions = selectedQuestions;
    state.currentQuestionIndex = 0;
    state.currentScore = 0;
    state.currentHits = 0;
    state.currentMisses = 0;
    state.roundXPGained = 0;
    state.isAnswerLocked = false;

    // Registra no histórico que as questões entraram nesta rodada
    selectedQuestions.forEach(q => {
      state.questionHistory[q.id] = state.currentRound;
    });

    saveProgress();
    return getCurrentQuestionData();
  }

  /**
   * Retorna os dados da questão atual
   */
  function getCurrentQuestionData() {
    if (!state.activeRoundQuestions || state.activeRoundQuestions.length === 0) {
      return null;
    }
    const q = state.activeRoundQuestions[state.currentQuestionIndex];
    return {
      questionNumber: state.currentQuestionIndex + 1,
      totalQuestions: QUESTIONS_PER_ROUND,
      id: q.id,
      difficulty: q.difficulty,
      question: q.question,
      options: q.options,
      score: state.currentScore,
      hits: state.currentHits,
      misses: state.currentMisses,
      levelData: calculateLevelData(state.totalXP)
    };
  }

  /**
   * Inicia o cronômetro de 20s para a pergunta atual
   */
  function startTimer(onTick, onExpire) {
    stopTimer();
    state.timerSecondsLeft = SECONDS_PER_QUESTION;
    state.isAnswerLocked = false;
    state.onTimerTick = onTick;
    state.onTimerExpire = onExpire;

    if (state.onTimerTick) {
      state.onTimerTick(state.timerSecondsLeft, SECONDS_PER_QUESTION);
    }

    state.timerInterval = setInterval(() => {
      state.timerSecondsLeft--;

      if (state.onTimerTick) {
        state.onTimerTick(state.timerSecondsLeft, SECONDS_PER_QUESTION);
      }

      if (state.timerSecondsLeft <= 0) {
        stopTimer();
        handleTimeout();
      }
    }, 1000);
  }

  /**
   * Para o cronômetro
   */
  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  /**
   * Processa o esgotamento do tempo (0s)
   */
  function handleTimeout() {
    if (state.isAnswerLocked) return;
    state.isAnswerLocked = true;

    const currentQ = state.activeRoundQuestions[state.currentQuestionIndex];
    state.currentMisses++;

    const result = {
      isTimeout: true,
      isCorrect: false,
      selectedOptionIndex: -1,
      correctOptionIndex: currentQ.correctAnswerIndex,
      scoreGained: 0,
      xpGained: 0,
      totalScore: state.currentScore,
      hits: state.currentHits,
      misses: state.currentMisses,
      levelData: calculateLevelData(state.totalXP)
    };

    if (state.onTimerExpire) {
      state.onTimerExpire(result);
    }
  }

  /**
   * Processa a seleção de uma alternativa pelo jogador
   */
  function submitAnswer(optionIndex) {
    if (state.isAnswerLocked) return null;
    state.isAnswerLocked = true;
    stopTimer();

    const currentQ = state.activeRoundQuestions[state.currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctAnswerIndex;

    let scoreGained = 0;
    let xpGained = 0;
    const oldLevel = state.level;

    if (isCorrect) {
      scoreGained = POINTS_PER_CORRECT;
      xpGained = XP_PER_100_POINTS;
      state.currentScore += scoreGained;
      state.currentHits += 1;
      state.totalHits += 1;
      state.roundXPGained += xpGained;
      state.totalXP += xpGained;
    } else {
      state.currentMisses += 1;
    }

    const lvlData = calculateLevelData(state.totalXP);
    const didLevelUp = lvlData.level > oldLevel;
    if (didLevelUp) {
      state.level = lvlData.level;
    }

    saveProgress();

    return {
      isTimeout: false,
      isCorrect,
      selectedOptionIndex: optionIndex,
      correctOptionIndex: currentQ.correctAnswerIndex,
      scoreGained,
      xpGained,
      totalScore: state.currentScore,
      hits: state.currentHits,
      misses: state.currentMisses,
      didLevelUp,
      newLevel: state.level,
      levelData: lvlData
    };
  }

  /**
   * Avança para a próxima pergunta ou conclui a rodada
   */
  function advance() {
    if (state.currentQuestionIndex + 1 < QUESTIONS_PER_ROUND) {
      state.currentQuestionIndex++;
      state.isAnswerLocked = false;
      return {
        isRoundComplete: false,
        nextQuestion: getCurrentQuestionData()
      };
    } else {
      // Fim da rodada
      state.gamesPlayed++;
      const finalResult = {
        isRoundComplete: true,
        roundNumber: state.currentRound,
        finalScore: state.currentScore,
        hits: state.currentHits,
        misses: state.currentMisses,
        roundXPGained: state.roundXPGained,
        totalXP: state.totalXP,
        level: state.level,
        levelData: calculateLevelData(state.totalXP)
      };

      // Incrementa o número da rodada para a próxima partida
      state.currentRound++;
      saveProgress();

      return finalResult;
    }
  }

  /**
   * Retorna estatísticas gerais do jogador
   */
  function getPlayerStats() {
    return {
      totalXP: state.totalXP,
      level: state.level,
      currentRound: state.currentRound,
      gamesPlayed: state.gamesPlayed,
      totalHits: state.totalHits,
      levelData: calculateLevelData(state.totalXP)
    };
  }

  /**
   * Reinicia progresso (utilitário para testes ou reset opcional)
   */
  function resetProgress() {
    state.totalXP = 0;
    state.level = 1;
    state.currentRound = 1;
    state.questionHistory = {};
    state.gamesPlayed = 0;
    state.totalHits = 0;
    saveProgress();
  }

  // Inicializa o engine ao carregar
  init();

  return {
    init,
    startNewRound,
    getCurrentQuestionData,
    startTimer,
    stopTimer,
    submitAnswer,
    handleTimeout,
    advance,
    getPlayerStats,
    calculateLevelData,
    resetProgress,
    SECONDS_PER_QUESTION,
    QUESTIONS_PER_ROUND
  };
})();
