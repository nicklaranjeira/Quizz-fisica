/**
 * BANCO OFICIAL DE QUESTÕES — QUIZ EDUCACIONAL DE FÍSICA
 * Matrizes Energéticas, Transformações de Energia e Sustentabilidade
 * 
 * Total: 30 questões (10 fáceis, 10 médias, 10 difíceis)
 * Cada questão possui ID único, dificuldade, enunciado, 4 alternativas e índice da resposta correta (0 = a, 1 = b, 2 = c, 3 = d).
 */

const QUESTIONS_DATABASE = [
  // ==========================================
  // NÍVEL FÁCIL (1-10)
  // ==========================================
  {
    id: 1,
    difficulty: "facil",
    question: "O conjunto das diferentes fontes de energia utilizadas por um país para gerar eletricidade e movimentar sua economia é chamado de:",
    options: [
      "Ciclo hidrológico",
      "Matriz energética",
      "Cadeia alimentar",
      "Efeito estufa"
    ],
    correctAnswerIndex: 1 // b) Matriz energética
  },
  {
    id: 2,
    difficulty: "facil",
    question: "Em uma usina termelétrica a carvão, a energia química do combustível é transformada, em sequência, em:",
    options: [
      "Elétrica → térmica → mecânica",
      "Térmica → mecânica → elétrica",
      "Mecânica → elétrica → luminosa",
      "Luminosa → química → elétrica"
    ],
    correctAnswerIndex: 1 // b) Térmica → mecânica → elétrica
  },
  {
    id: 3,
    difficulty: "facil",
    question: "É uma fonte de energia renovável e limpa (baixa emissão de poluentes na geração):",
    options: [
      "Petróleo",
      "Carvão mineral",
      "Energia solar",
      "Gás natural"
    ],
    correctAnswerIndex: 2 // c) Energia solar
  },
  {
    id: 4,
    difficulty: "facil",
    question: "O principal impacto ambiental associado à queima de combustíveis fósseis é:",
    options: [
      "Redução da camada de gelo apenas nos polos",
      "Emissão de gases de efeito estufa, contribuindo para o aquecimento global",
      "Aumento da biodiversidade local",
      "Purificação do ar atmosférico"
    ],
    correctAnswerIndex: 1 // b) Emissão de gases de efeito estufa, contribuindo para o aquecimento global
  },
  {
    id: 5,
    difficulty: "facil",
    question: "Escolher usar uma bicicleta em vez de um carro para trajetos curtos é um exemplo de escolha que:",
    options: [
      "Aumenta o consumo de combustíveis fósseis",
      "Reduz o consumo de energia não renovável e as emissões de poluentes",
      "Não tem relação com matriz energética",
      "Depende exclusivamente de energia nuclear"
    ],
    correctAnswerIndex: 1 // b) Reduz o consumo de energia não renovável e as emissões de poluentes
  },
  {
    id: 6,
    difficulty: "facil",
    question: "A energia eólica transforma a energia cinética do vento em:",
    options: [
      "Energia química",
      "Energia nuclear",
      "Energia elétrica",
      "Energia luminosa direta"
    ],
    correctAnswerIndex: 2 // c) Energia elétrica
  },
  {
    id: 7,
    difficulty: "facil",
    question: "Um exemplo de fonte de energia não renovável é:",
    options: [
      "Biomassa",
      "Energia solar",
      "Petróleo",
      "Energia eólica"
    ],
    correctAnswerIndex: 2 // c) Petróleo
  },
  {
    id: 8,
    difficulty: "facil",
    question: "A sustentabilidade energética está relacionada a:",
    options: [
      "Usar apenas uma única fonte de energia em todo o mundo",
      "Atender às necessidades energéticas atuais sem comprometer os recursos das futuras gerações",
      "Aumentar ao máximo o uso de combustíveis fósseis",
      "Eliminar totalmente o uso de eletricidade"
    ],
    correctAnswerIndex: 1 // b) Atender às necessidades energéticas atuais sem comprometer os recursos das futuras gerações
  },
  {
    id: 9,
    difficulty: "facil",
    question: "Apagar luzes de cômodos vazios e desligar aparelhos em stand-by são atitudes que contribuem para:",
    options: [
      "O aumento do desperdício de energia",
      "A eficiência energética e a redução do consumo desnecessário",
      "O esgotamento mais rápido de fontes renováveis",
      "Nenhum impacto ambiental"
    ],
    correctAnswerIndex: 1 // b) A eficiência energética e a redução do consumo desnecessário
  },
  {
    id: 10,
    difficulty: "facil",
    question: "A energia armazenada em uma barragem de hidrelétrica, antes de a água descer pelas turbinas, é do tipo:",
    options: [
      "Térmica",
      "Potencial gravitacional",
      "Sonora",
      "Nuclear"
    ],
    correctAnswerIndex: 1 // b) Potencial gravitacional
  },

  // ==========================================
  // NÍVEL MÉDIO (11-20)
  // ==========================================
  {
    id: 11,
    difficulty: "medio",
    question: "A matriz energética brasileira é considerada mais \"limpa\" que a de muitos outros países principalmente porque:",
    options: [
      "Não utiliza nenhuma fonte fóssil",
      "Tem grande participação de fontes renováveis, sobretudo hidrelétricas",
      "Depende exclusivamente de energia nuclear",
      "Importa toda sua eletricidade de outros países"
    ],
    correctAnswerIndex: 1 // b) Tem grande participação de fontes renováveis, sobretudo hidrelétricas
  },
  {
    id: 12,
    difficulty: "medio",
    question: "Um dos dilemas das grandes hidrelétricas (como Belo Monte e Itaipu) é que, apesar de renováveis, elas podem causar:",
    options: [
      "Aumento imediato da qualidade da água nos rios",
      "Alagamento de áreas extensas, deslocamento de comunidades e impactos na biodiversidade",
      "Emissão elevada de CO₂ durante toda a operação, superior ao carvão",
      "Nenhum tipo de impacto social ou ambiental"
    ],
    correctAnswerIndex: 1 // b) Alagamento de áreas extensas, deslocamento de comunidades e impactos na biodiversidade
  },
  {
    id: 13,
    difficulty: "medio",
    question: "Sobre a transformação de energia em uma usina eólica, é correto afirmar que:",
    options: [
      "O vento é convertido diretamente em energia térmica nas pás",
      "A energia cinética do vento gira as pás, que acionam um gerador, produzindo energia elétrica",
      "A energia solar é convertida diretamente em energia elétrica",
      "Não há nenhuma transformação de energia envolvida"
    ],
    correctAnswerIndex: 1 // b) A energia cinética do vento gira as pás, que acionam um gerador, produzindo energia elétrica
  },
  {
    id: 14,
    difficulty: "medio",
    question: "Um argumento frequentemente usado a favor da diversificação da matriz energética (usar várias fontes, e não apenas uma) é:",
    options: [
      "Reduzir a vulnerabilidade do sistema a fatores climáticos e aumentar a segurança energética",
      "Aumentar a dependência de um único tipo de fonte",
      "Elevar os custos sem nenhum benefício",
      "Eliminar a necessidade de qualquer planejamento energético"
    ],
    correctAnswerIndex: 0 // a) Reduzir a vulnerabilidade do sistema a fatores climáticos e aumentar a segurança energética
  },
  {
    id: 15,
    difficulty: "medio",
    question: "A escolha por painéis solares em residências, mesmo com custo inicial mais alto, pode ser justificada por:",
    options: [
      "Redução de longo prazo na conta de energia e menor impacto ambiental comparado a fontes fósseis",
      "Ausência total de qualquer custo de manutenção",
      "Impossibilidade de gerar energia em dias nublados",
      "Substituição completa da rede elétrica em qualquer situação"
    ],
    correctAnswerIndex: 0 // a) Redução de longo prazo na conta de energia e menor impacto ambiental comparado a fontes fósseis
  },
  {
    id: 16,
    difficulty: "medio",
    question: "Em relação ao uso de biomassa (como bagaço de cana) para geração de energia, é correto dizer que:",
    options: [
      "É totalmente livre de qualquer emissão de gases",
      "É renovável, mas seu uso em larga escala pode gerar debates sobre uso do solo e monoculturas",
      "É uma fonte fóssil não renovável",
      "Não pode ser utilizada para gerar eletricidade"
    ],
    correctAnswerIndex: 1 // b) É renovável, mas seu uso em larga escala pode gerar debates sobre uso do solo e monoculturas
  },
  {
    id: 17,
    difficulty: "medio",
    question: "Um país que depende quase exclusivamente de importação de petróleo para sua matriz energética enfrenta como principal risco:",
    options: [
      "Total independência energética",
      "Vulnerabilidade econômica e geopolítica a variações de preço e fornecimento internacional",
      "Redução automática de emissões de poluentes",
      "Nenhum tipo de impacto na economia interna"
    ],
    correctAnswerIndex: 1 // b) Vulnerabilidade econômica e geopolítica a variações de preço e fornecimento internacional
  },
  {
    id: 18,
    difficulty: "medio",
    question: "A transformação de energia química em energia elétrica ocorre, por exemplo, em:",
    options: [
      "Painéis solares fotovoltaicos",
      "Usinas hidrelétricas",
      "Baterias e pilhas",
      "Turbinas eólicas"
    ],
    correctAnswerIndex: 2 // c) Baterias e pilhas
  },
  {
    id: 19,
    difficulty: "medio",
    question: "Um dos principais desafios das fontes renováveis intermitentes (solar e eólica) para sua adoção em larga escala é:",
    options: [
      "A ausência de qualquer tecnologia de geração",
      "A necessidade de sistemas de armazenamento (como baterias) ou de complementação com outras fontes",
      "O fato de não gerarem eletricidade em nenhuma condição",
      "A impossibilidade técnica de conectá-las à rede elétrica"
    ],
    correctAnswerIndex: 1 // b) A necessidade de sistemas de armazenamento (como baterias) ou de complementação com outras fontes
  },
  {
    id: 20,
    difficulty: "medio",
    question: "Ao comparar o gás natural com o carvão mineral como fontes de energia, pode-se afirmar que:",
    options: [
      "Ambos são renováveis e não emitem poluentes",
      "O gás natural, apesar de fóssil, geralmente emite menos poluentes e CO₂ na queima que o carvão",
      "O carvão é mais limpo que o gás natural",
      "Nenhum dos dois é utilizado para geração de eletricidade"
    ],
    correctAnswerIndex: 1 // b) O gás natural, apesar de fóssil, geralmente emite menos poluentes e CO₂ na queima que o carvão
  },

  // ==========================================
  // NÍVEL DIFÍCIL (21-30)
  // ==========================================
  {
    id: 21,
    difficulty: "dificil",
    question: "Analisando criticamente a matriz energética brasileira, um risco associado à forte dependência de hidrelétricas é:",
    options: [
      "A total imunidade a mudanças climáticas",
      "Crises hídricas e períodos de estiagem prolongada, que reduzem a capacidade de geração e exigem acionamento de termelétricas mais poluentes",
      "A impossibilidade de gerar qualquer excedente de energia",
      "A eliminação da necessidade de planejamento energético de longo prazo"
    ],
    correctAnswerIndex: 1 // b) Crises hídricas e períodos de estiagem prolongada...
  },
  {
    id: 22,
    difficulty: "dificil",
    question: "Sobre a chamada \"transição energética\" discutida globalmente, é correto afirmar que:",
    options: [
      "Consiste em substituir imediatamente e por completo todas as fontes fósseis, sem custos ou desafios técnicos",
      "Envolve o processo gradual de substituição de combustíveis fósseis por fontes renováveis, enfrentando desafios técnicos, econômicos e políticos",
      "É um processo já concluído em todos os países do mundo",
      "Não tem relação com políticas públicas ou investimentos em infraestrutura"
    ],
    correctAnswerIndex: 1 // b) Envolve o processo gradual de substituição de combustíveis fósseis por fontes renováveis...
  },
  {
    id: 23,
    difficulty: "dificil",
    question: "Ao avaliar a energia nuclear em um debate sobre sustentabilidade, um argumento técnico relevante é que:",
    options: [
      "Ela emite grandes quantidades de CO₂ durante a geração, tal qual o carvão",
      "Embora não emita gases de efeito estufa na geração, gera rejeitos radioativos que exigem armazenamento seguro por milhares de anos",
      "É uma fonte totalmente livre de qualquer risco ou controvérsia",
      "Não pode gerar energia em larga escala"
    ],
    correctAnswerIndex: 1 // b) Embora não emita gases de efeito estufa na geração, gera rejeitos radioativos...
  },
  {
    id: 24,
    difficulty: "dificil",
    question: "Um princípio da Segunda Lei da Termodinâmica, aplicado às transformações energéticas em usinas, indica que:",
    options: [
      "Toda energia transformada é convertida com 100% de eficiência",
      "Sempre há perda de parte da energia útil na forma de calor dissipado, o que limita a eficiência de qualquer conversão",
      "A entropia do sistema diminui espontaneamente durante a geração de energia",
      "Não existe perda de energia em nenhum processo real"
    ],
    correctAnswerIndex: 1 // b) Sempre há perda de parte da energia útil na forma de calor dissipado...
  },
  {
    id: 25,
    difficulty: "dificil",
    question: "Em uma análise de custo-benefício ambiental, a construção de grandes parques eólicos offshore (no mar) apresenta como principal vantagem em relação aos onshore (em terra):",
    options: [
      "Eliminação total de qualquer impacto ambiental",
      "Ventos mais constantes e menor impacto visual/sonoro sobre populações, embora com custo de instalação mais elevado",
      "Ausência de qualquer necessidade de manutenção",
      "Menor eficiência de geração em qualquer condição"
    ],
    correctAnswerIndex: 1 // b) Ventos mais constantes e menor impacto visual/sonoro sobre populações...
  },
  {
    id: 26,
    difficulty: "dificil",
    question: "Ao comparar a pegada de carbono do ciclo de vida completo (produção, instalação, operação e descarte) de diferentes fontes de energia, é correto afirmar que:",
    options: [
      "Todas as fontes, renováveis ou não, têm exatamente a mesma pegada de carbono total",
      "Fontes renováveis geralmente apresentam pegada de carbono total significativamente menor que fósseis, mas não são \"zero impacto\", devido à fabricação de equipamentos e uso de materiais",
      "Somente fontes fósseis possuem impacto ambiental em seu ciclo de vida",
      "O descarte de equipamentos nunca gera impacto ambiental"
    ],
    correctAnswerIndex: 1 // b) Fontes renováveis geralmente apresentam pegada de carbono total significativamente menor...
  },
  {
    id: 27,
    difficulty: "dificil",
    question: "Um argumento frequentemente levantado sobre a justiça energética e social é que:",
    options: [
      "O acesso à energia elétrica é igualitário entre todas as populações do mundo, independentemente da renda",
      "Populações de baixa renda e regiões menos desenvolvidas frequentemente têm menor acesso a energia limpa e confiável, aprofundando desigualdades",
      "A pobreza energética não está relacionada a escolhas de matriz energética",
      "Todos os países investem igualmente em infraestrutura energética"
    ],
    correctAnswerIndex: 1 // b) Populações de baixa renda e regiões menos desenvolvidas...
  },
  {
    id: 28,
    difficulty: "dificil",
    question: "Sobre o conceito de \"descarbonização\" da matriz energética, pode-se afirmar que:",
    options: [
      "Significa eliminar totalmente o uso de eletricidade",
      "Refere-se à redução da participação de fontes emissoras de carbono (fósseis) em favor de fontes renováveis e de baixo carbono",
      "É sinônimo de aumentar o uso de carvão mineral",
      "Não tem relação com políticas climáticas internacionais"
    ],
    correctAnswerIndex: 1 // b) Refere-se à redução da participação de fontes emissoras de carbono...
  },
  {
    id: 29,
    difficulty: "dificil",
    question: "Um argumento técnico a favor de sistemas híbridos de energia (combinando, por exemplo, solar, eólica e hidrelétrica) é que:",
    options: [
      "Aumentam a dependência de uma única fonte",
      "Podem compensar a intermitência de fontes como solar e eólica, aumentando a estabilidade e confiabilidade do fornecimento",
      "Eliminam totalmente a necessidade de rede de transmissão",
      "Reduzem a eficiência geral do sistema elétrico"
    ],
    correctAnswerIndex: 1 // b) Podem compensar a intermitência de fontes como solar e eólica...
  },
  {
    id: 30,
    difficulty: "dificil",
    question: "Refletindo sobre escolhas energéticas individuais e coletivas, pode-se afirmar que:",
    options: [
      "Decisões de consumo individual não têm nenhuma relação com a demanda por determinadas fontes de energia",
      "Tanto políticas públicas quanto hábitos de consumo (como eficiência energética e escolha de fontes) influenciam a configuração da matriz energética e seus impactos ambientais",
      "Apenas governos podem influenciar a matriz energética, sem qualquer papel do consumidor",
      "O impacto ambiental da energia depende exclusivamente de fatores naturais, sem relação com escolhas humanas"
    ],
    correctAnswerIndex: 1 // b) Tanto políticas públicas quanto hábitos de consumo...
  }
];

// Congela o banco de perguntas para evitar mutações acidentais
if (typeof Object.freeze === "function") {
  QUESTIONS_DATABASE.forEach(q => Object.freeze(q.options));
  Object.freeze(QUESTIONS_DATABASE);
}
