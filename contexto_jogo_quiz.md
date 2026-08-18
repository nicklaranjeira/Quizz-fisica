# CONTEXTO DO JOGO — QUIZ EDUCACIONAL

## 1. Visão geral

Este projeto é um jogo de quiz educacional desenvolvido exclusivamente com HTML, CSS e JavaScript puro.

O jogo funciona diretamente no navegador a partir do `index.html`, sem backend, banco de dados, Node.js, React, Vue, Angular ou APIs externas.

O objetivo é proporcionar uma experiência de aprendizagem gamificada, moderna, intuitiva e divertida, na qual o jogador responde perguntas sobre energia e sustentabilidade, acumula pontos, transforma pontos em XP e evolui de nível.

Todas as funcionalidades descritas neste documento são consideradas IMPLEMENTADAS E FUNCIONANDO.

---

## 2. Tema e conteúdo

O quiz aborda principalmente:

- Matrizes energéticas;
- Transformações de energia;
- Fontes renováveis e não renováveis;
- Sustentabilidade energética;
- Impactos ambientais;
- Impactos sociais;
- Eficiência energética;
- Transição energética;
- Escolhas energéticas.

O jogo possui um banco oficial de 30 perguntas:

- 10 fáceis;
- 10 médias;
- 10 difíceis.

As perguntas, alternativas, gabaritos e níveis vêm do arquivo oficial fornecido para o projeto e são considerados a fonte de verdade do conteúdo.

O sistema não altera nem inventa questões, alternativas, gabaritos ou níveis.

---

## 3. Fluxo do jogo

O fluxo principal é:

Tela Inicial
→ Iniciar
→ Nova Rodada
→ 10 perguntas
→ Resultado
→ Ganho de XP
→ Nova Rodada ou Voltar ao Início

O jogador pode consultar as regras antes de iniciar uma rodada.

---

## 4. Tela inicial

A tela inicial possui:

- Título do jogo;
- Breve descrição;
- Botão principal `INICIAR`;
- Botão secundário `REGRAS DO JOGO`.

O botão `INICIAR` começa uma nova rodada.

O botão `REGRAS DO JOGO` abre um modal responsivo com as regras do jogo.

---

## 5. Regras do jogo

O modal de regras explica, em tópicos:

- Cada rodada possui exatamente 10 perguntas;
- Cada pergunta possui 20 segundos;
- Cada pergunta possui 4 alternativas;
- Existe apenas uma tentativa por pergunta;
- Respostas corretas geram pontos;
- Respostas incorretas geram 0 pontos;
- Tempo esgotado conta como erro;
- As perguntas são embaralhadas a cada rodada;
- As alternativas também são embaralhadas;
- Uma pergunta só pode reaparecer depois de 3 rodadas;
- A pontuação é convertida em XP;
- O XP é acumulativo;
- O XP determina o nível;
- O progresso é salvo.

O modal pode ser fechado pelo botão `FECHAR` ou clicando fora dele.

Consultar as regras não altera o estado do jogo.

---

## 6. Rodadas

Cada rodada possui exatamente 10 perguntas.

O sistema seleciona as perguntas a partir do banco de 30 questões.

A cada nova rodada:

1. Identifica perguntas elegíveis;
2. Seleciona 10;
3. Embaralha a ordem;
4. Embaralha as alternativas de cada pergunta;
5. Mantém o gabarito correto após o embaralhamento;
6. Inicia a rodada.

A ordem das perguntas pode mudar entre rodadas.

A ordem das alternativas também pode mudar entre rodadas.

---

## 7. Regra de repetição

Uma pergunta utilizada em uma rodada fica indisponível nas duas rodadas seguintes.

Exemplo:

- Rodada 1: pergunta utilizada;
- Rodada 2: bloqueada;
- Rodada 3: bloqueada;
- Rodada 4: disponível novamente.

Assim, uma pergunta só reaparece depois de pelo menos 3 rodadas.

Como existem 30 perguntas e cada rodada utiliza 10:

- Rodada 1 utiliza um grupo;
- Rodada 2 utiliza outro grupo;
- Rodada 3 utiliza o grupo restante;
- Na Rodada 4, perguntas da Rodada 1 podem voltar.

O sistema mantém um histórico por ID da pergunta e número da rodada.

Uma pergunta só entra no histórico quando realmente participa da rodada.

---

## 8. Dificuldade

O banco possui 10 perguntas de cada dificuldade.

O sistema busca manter uma distribuição equilibrada por rodada, preferencialmente:

- 3–4 fáceis;
- 3–4 médias;
- 2–3 difíceis.

A distribuição pode variar entre rodadas.

---

## 9. Tela do quiz

Durante a partida são exibidos:

- Pergunta atual, no formato `Pergunta X de 10`;
- Pontuação;
- Acertos;
- Erros;
- Informações de XP e nível.

A pergunta aparece em um card central.

As quatro alternativas aparecem como botões interativos.

---

## 10. Temporizador

Cada pergunta possui 20 segundos.

O tempo é apresentado:

- Numericamente;
- Por um indicador visual, preferencialmente circular.

O visual do tempo muda conforme o tempo diminui:

Normal → Alerta → Esgotado.

Quando o tempo chega a zero:

1. As alternativas são bloqueadas;
2. A pergunta é registrada como erro;
3. É exibido `TEMPO ESGOTADO!`;
4. A resposta correta é destacada;
5. O jogo avança automaticamente após um breve intervalo.

O jogador não pode responder após o tempo acabar.

---

## 11. Respostas

Ao selecionar uma alternativa:

1. As demais alternativas são bloqueadas;
2. O cronômetro para;
3. A resposta é validada;
4. Acertos ou erros são atualizados;
5. A pontuação é atualizada;
6. O feedback visual é exibido;
7. A próxima pergunta é carregada após um breve intervalo.

### Resposta correta

- Alternativa escolhida fica verde;
- Exibe `✓ CORRETO!`;
- Soma 100 pontos;
- Soma 1 acerto.

### Resposta incorreta

- Alternativa escolhida fica vermelha;
- Alternativa correta fica verde;
- Exibe `✕ INCORRETO!`;
- Soma 1 erro;
- Não adiciona pontos.

Não existe segunda tentativa.

---

## 12. Pontuação

Sistema padrão:

- Acerto: +100 pontos;
- Erro: 0 pontos;
- Tempo esgotado: 0 pontos.

Uma rodada possui 10 perguntas, portanto a pontuação máxima básica é 1000 pontos.

Não existe bônus por velocidade.

---

## 13. XP

A conversão é:

`100 pontos = 10 XP`

Exemplo:

`700 pontos = 70 XP`

O XP ganho em cada rodada é adicionado ao XP total.

O XP nunca é zerado ao iniciar uma nova rodada.

---

## 14. Níveis

O jogador começa no Nível 1.

O jogo possui:

- XP total;
- Nível atual;
- Barra de progresso de XP;
- Feedback visual quando ocorre evolução de nível.

Ao atingir o limite necessário, o jogador sobe de nível e recebe feedback visual.

O sistema foi estruturado para permitir futuras expansões do sistema de níveis.

---

## 15. Resultado da rodada

Após responder a décima pergunta, o jogo exibe a tela de resultado.

Ela apresenta:

- Pontuação final;
- Número de acertos;
- Número de erros;
- XP ganho na rodada;
- XP total;
- Nível atual.

A tela possui:

- `JOGAR NOVAMENTE`;
- `VOLTAR AO INÍCIO`.

### Jogar novamente

Inicia outra rodada com:

- 10 perguntas;
- Novo embaralhamento;
- Regra de repetição respeitada;
- XP preservado;
- Nível preservado;
- Histórico preservado.

### Voltar ao início

Retorna à tela inicial sem apagar o progresso.

---

## 16. Persistência

O jogo utiliza `localStorage`.

São persistidos:

- XP;
- Nível;
- Rodada atual;
- Histórico das perguntas.

Ao recarregar a página, o jogo recupera essas informações.

O jogador não perde seu progresso simplesmente por atualizar o navegador.

---

## 17. Interface visual

A identidade visual é de um quiz educacional moderno.

O branco é a cor predominante.

A paleta complementar é harmoniosa e pode utilizar:

- Azul;
- Roxo;
- Laranja;
- Cinza;
- Verde para acertos;
- Vermelho para erros.

O botão `INICIAR` utiliza vermelho como cor de destaque.

A interface utiliza:

- Cards;
- Bordas arredondadas;
- Sombras suaves;
- Tipografia moderna;
- Ícones;
- Hover;
- Microanimações;
- Transições;
- Barras de progresso;
- Cronômetro circular.

A estética combina:

Educação + Tecnologia + Diversão.

A interface evita excesso de cores, poluição visual e animações que prejudiquem a jogabilidade.

---

## 18. Responsividade

O jogo funciona em:

- Desktop;
- Notebook;
- Tablet;
- Celular.

Os elementos se adaptam ao tamanho da tela.

As alternativas são grandes o suficiente para interação por toque.

O modal de regras também é responsivo.

---

## 19. Estrutura técnica

Estrutura do projeto:

```text
quiz/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── quiz.js
│   └── questions.js
└── assets/
```

### index.html
Estrutura da aplicação.

### style.css
Estilização e responsividade.

### main.js
Inicialização, navegação, tela inicial e regras.

### quiz.js
Estado do jogo, seleção e embaralhamento, histórico, temporizador, respostas, pontuação, XP, níveis e resultado.

### questions.js
Banco das 30 perguntas oficiais.

O JavaScript é modular, organizado e evita duplicação desnecessária.

---

## 20. Execução

O jogo funciona diretamente abrindo:

`index.html`

Não depende de servidor ou backend.

As tecnologias principais são:

- HTML;
- CSS;
- JavaScript.

---

## 21. Estado atual do projeto

Considere que TODAS as funcionalidades descritas neste documento já foram implementadas e testadas.

Não trate nenhuma dessas funcionalidades como pendência.

O comportamento esperado do sistema é exatamente o descrito aqui.

Ao analisar, explicar, modificar ou expandir o jogo, preserve:

- A lógica de 10 perguntas por rodada;
- A regra de repetição após 3 rodadas;
- O embaralhamento das perguntas;
- O embaralhamento das alternativas com gabarito preservado;
- O cronômetro de 20 segundos;
- A pontuação;
- O XP acumulativo;
- O sistema de níveis;
- O histórico;
- A persistência em `localStorage`;
- A tela de regras;
- A tela de resultado;
- A identidade visual;
- A execução local pelo `index.html`.

Este documento representa o contexto funcional consolidado do jogo.
