/**
 * QUIZ.JS — LÓGICA DO JOGO DE QUIZ EDUCACIONAL DE FÍSICA (MODO 2 EQUIPES)
 * Gerenciamento de Estado de Equipes, Seleção/Embaralhamento com Bloqueio de 3 Rodadas,
 * Temporizador de 20s, Validação de Gabarito, Pontuação por Equipe (+100/-100/0) e Botão Passar.
 */

const QuizEngine = (() => {
  // Constantes de Configuração
  const QUESTIONS_PER_ROUND = 10;
  const SECONDS_PER_QUESTION = 20;
  const POINTS_CORRECT = 100;
  const POINTS_INCORRECT = -100;
  const LOCKOUT_ROUNDS = 2; // Bloqueia nas 2 rodadas seguintes (reaparece a partir da rodada R + 3)

  // Chaves do LocalStorage (apenas para regra de repetição de questões entre rodadas)
  const STORAGE_KEYS = {
    CURRENT_ROUND: "quiz_fisica_round",
    QUESTION_HISTORY: "quiz_fisica_history"
  };

  // Estado do Quiz
  const state = {
    // Equipes
    teams: {
      team1: { name: "", score: 0, hits: 0, misses: 0 },
      team2: { name: "", score: 0, hits: 0, misses: 0 }
    },
    selectedTeam: null, // "team1" | "team2" | null

    // Controle de Rodadas e Histórico
    currentRound: 1,
    questionHistory: {}, // { [questionId]: lastRoundNumber }

    // Estado da rodada ativa
    activeRoundQuestions: [],
    currentQuestionIndex: 0,
    
    // Controle do timer
    timerSecondsLeft: SECONDS_PER_QUESTION,
    timerInterval: null,
    isAnswerLocked: false,
    
    // Callbacks de eventos
    onTimerTick: null,
    onTimerExpire: null
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
   * Inicializa o histórico de questões a partir do LocalStorage
   */
  function init() {
    try {
      const savedRound = localStorage.getItem(STORAGE_KEYS.CURRENT_ROUND);
      const savedHistory = localStorage.getItem(STORAGE_KEYS.QUESTION_HISTORY);

      state.currentRound = savedRound !== null ? parseInt(savedRound, 10) : 1;
      state.questionHistory = savedHistory ? JSON.parse(savedHistory) : {};
    } catch (e) {
      console.warn("Erro ao carregar histórico do localStorage:", e);
      state.currentRound = 1;
      state.questionHistory = {};
    }
  }

  /**
   * Salva histórico de repetição de questões
   */
  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROUND, state.currentRound.toString());
      localStorage.setItem(STORAGE_KEYS.QUESTION_HISTORY, JSON.stringify(state.questionHistory));
    } catch (e) {
      console.warn("Erro ao salvar histórico:", e);
    }
  }

  /**
   * Configura os nomes das duas equipes
   */
  function setTeams(team1Name, team2Name) {
    const name1 = (team1Name || "").trim();
    const name2 = (team2Name || "").trim();

    if (!name1 || !name2) {
      return { success: false, message: "Os nomes de ambas as equipes são obrigatórios." };
    }

    state.teams.team1.name = name1;
    state.teams.team1.score = 0;
    state.teams.team1.hits = 0;
    state.teams.team1.misses = 0;

    state.teams.team2.name = name2;
    state.teams.team2.score = 0;
    state.teams.team2.hits = 0;
    state.teams.team2.misses = 0;

    state.selectedTeam = null;
    return { success: true };
  }

  /**
   * Retorna os dados atuais das equipes
   */
  function getTeamsData() {
    return {
      team1: { ...state.teams.team1 },
      team2: { ...state.teams.team2 }
    };
  }

  /**
   * Seleciona a equipe responsável por responder a pergunta atual
   * @param {'team1' | 'team2'} teamKey
   */
  function selectTeam(teamKey) {
    if (state.isAnswerLocked) return false;
    if (teamKey === "team1" || teamKey === "team2") {
      state.selectedTeam = teamKey;
      return true;
    }
    return false;
  }

  /**
   * Retorna a equipe selecionada para a pergunta atual
   */
  function getSelectedTeam() {
    return state.selectedTeam;
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

    // Distribuição balanceada ideal: 3-4 fáceis, 3-4 médias, 2-3 difíceis
    let selected = [];

    const targetFacil = Math.min(faciles.length, (state.currentRound % 3 === 1) ? 4 : 3);
    selected.push(...faciles.slice(0, targetFacil));

    const targetMedio = Math.min(medios.length, (state.currentRound % 3 === 2) ? 4 : 3);
    selected.push(...medios.slice(0, targetMedio));

    const targetDificil = Math.min(dificeis.length, (state.currentRound % 3 === 0) ? 4 : 3);
    selected.push(...dificeis.slice(0, targetDificil));

    // Se ainda faltar para completar 10
    if (selected.length < QUESTIONS_PER_ROUND) {
      const selectedIds = new Set(selected.map(q => q.id));
      const remainingEligible = shuffleArray(eligible.filter(q => !selectedIds.has(q.id)));
      selected.push(...remainingEligible.slice(0, QUESTIONS_PER_ROUND - selected.length));
    }

    // Se ainda faltar (caso extremo)
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
   * Inicia uma nova rodada com 10 perguntas
   */
  function startNewRound() {
    stopTimer();

    const selectedQuestions = selectEligibleQuestions();
    state.activeRoundQuestions = selectedQuestions;
    state.currentQuestionIndex = 0;
    state.selectedTeam = null;
    state.isAnswerLocked = false;

    // Zera pontuações da nova partida
    state.teams.team1.score = 0;
    state.teams.team1.hits = 0;
    state.teams.team1.misses = 0;

    state.teams.team2.score = 0;
    state.teams.team2.hits = 0;
    state.teams.team2.misses = 0;

    // Registra no histórico que as questões entraram nesta rodada
    selectedQuestions.forEach(q => {
      state.questionHistory[q.id] = state.currentRound;
    });

    saveHistory();
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
      selectedTeam: state.selectedTeam,
      teams: getTeamsData()
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
    if (state.isAnswerLocked) return null;
    state.isAnswerLocked = true;

    const currentQ = state.activeRoundQuestions[state.currentQuestionIndex];

    const result = {
      isTimeout: true,
      isPass: false,
      isCorrect: false,
      selectedTeam: null,
      selectedOptionIndex: -1,
      correctOptionIndex: currentQ.correctAnswerIndex,
      pointsChanged: 0,
      teams: getTeamsData()
    };

    if (state.onTimerExpire) {
      state.onTimerExpire(result);
    }
    return result;
  }

  /**
   * Processa a ação de PASSAR a pergunta
   * Funciona mesmo sem equipe selecionada. Não altera pontos nem acertos/erros.
   */
  function passQuestion() {
    if (state.isAnswerLocked) return null;
    state.isAnswerLocked = true;
    stopTimer();

    const currentQ = state.activeRoundQuestions[state.currentQuestionIndex];

    return {
      isTimeout: false,
      isPass: true,
      isCorrect: false,
      selectedTeam: state.selectedTeam,
      selectedOptionIndex: -1,
      correctOptionIndex: currentQ.correctAnswerIndex,
      pointsChanged: 0,
      teams: getTeamsData()
    };
  }

  /**
   * Processa a seleção de uma alternativa pela equipe ativa
   * @param {number} optionIndex
   */
  function submitAnswer(optionIndex) {
    if (state.isAnswerLocked) return null;

    // Valida se há uma equipe selecionada
    if (!state.selectedTeam) {
      return {
        error: "NO_TEAM_SELECTED",
        message: "Selecione uma equipe primeiro."
      };
    }

    state.isAnswerLocked = true;
    stopTimer();

    const currentQ = state.activeRoundQuestions[state.currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctAnswerIndex;
    const teamKey = state.selectedTeam;

    let pointsChanged = 0;

    if (isCorrect) {
      pointsChanged = POINTS_CORRECT; // +100
      state.teams[teamKey].score += pointsChanged;
      state.teams[teamKey].hits += 1;
    } else {
      pointsChanged = POINTS_INCORRECT; // -100
      state.teams[teamKey].score += pointsChanged;
      state.teams[teamKey].misses += 1;
    }

    return {
      isTimeout: false,
      isPass: false,
      isCorrect,
      selectedTeam: teamKey,
      teamName: state.teams[teamKey].name,
      selectedOptionIndex: optionIndex,
      correctOptionIndex: currentQ.correctAnswerIndex,
      pointsChanged,
      teams: getTeamsData()
    };
  }

  /**
   * Avança para a próxima pergunta ou conclui a partida
   */
  function advance() {
    // Reseta a equipe selecionada para a próxima questão
    state.selectedTeam = null;

    if (state.currentQuestionIndex + 1 < QUESTIONS_PER_ROUND) {
      state.currentQuestionIndex++;
      state.isAnswerLocked = false;
      return {
        isRoundComplete: false,
        nextQuestion: getCurrentQuestionData()
      };
    } else {
      // Fim da rodada de 10 perguntas
      const team1 = state.teams.team1;
      const team2 = state.teams.team2;

      let winner = null;
      let isTie = false;

      if (team1.score > team2.score) {
        winner = "team1";
      } else if (team2.score > team1.score) {
        winner = "team2";
      } else {
        isTie = true;
      }

      const finalResult = {
        isRoundComplete: true,
        roundNumber: state.currentRound,
        teams: getTeamsData(),
        winner,
        isTie,
        winnerName: winner ? state.teams[winner].name : null,
        winnerScore: winner ? state.teams[winner].score : null
      };

      // Incrementa rodada para persistência do lockout
      state.currentRound++;
      saveHistory();

      return finalResult;
    }
  }

  /**
   * Reinicia completamente a partida (apaga nomes, equipes e pontuações)
   */
  function resetMatch() {
    stopTimer();
    state.teams = {
      team1: { name: "", score: 0, hits: 0, misses: 0 },
      team2: { name: "", score: 0, hits: 0, misses: 0 }
    };
    state.selectedTeam = null;
    state.activeRoundQuestions = [];
    state.currentQuestionIndex = 0;
    state.isAnswerLocked = false;
  }

  // Inicializa o engine ao carregar
  init();

  return {
    init,
    setTeams,
    getTeamsData,
    selectTeam,
    getSelectedTeam,
    startNewRound,
    getCurrentQuestionData,
    startTimer,
    stopTimer,
    submitAnswer,
    passQuestion,
    handleTimeout,
    advance,
    resetMatch,
    SECONDS_PER_QUESTION,
    QUESTIONS_PER_ROUND
  };
})();
