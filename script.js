
/* =========================================================
   FIFA CHAMPIONSHIP
   Sistema completo de campeonatos
========================================================= */


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const WHATSAPP_GROUP_LINK = "";


/* =========================================================
   ESTADO
========================================================= */

let championship = {
    name: "",
    players: [],
    roundsCount: 5,
    rounds: [],
    finished: false,
    champion: null,
    lastPlace: null,
    createdAt: null
};

let playerCount = 3;


/* =========================================================
   ELEMENTOS
========================================================= */

const welcomeScreen = document.getElementById("welcomeScreen");
const enterButton = document.getElementById("enterButton");

const setupScreen = document.getElementById("setupScreen");
const appScreen = document.getElementById("appScreen");
const historyScreen = document.getElementById("historyScreen");

const playerCountElement = document.getElementById("playerCount");
const playersInputs = document.getElementById("playersInputs");

const roundsCountInput = document.getElementById("roundsCount");
const championshipNameInput =
    document.getElementById("championshipName");

const roundsContainer =
    document.getElementById("roundsContainer");

const standingsBody =
    document.getElementById("standingsBody");

const currentLeader =
    document.getElementById("currentLeader");

const roundProgress =
    document.getElementById("roundProgress");

const championModal =
    document.getElementById("championModal");


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setupEventListeners();

    updatePlayerInputs();

    loadCurrentChampionship();

});


/* =========================================================
   EVENTOS
========================================================= */

function setupEventListeners() {

    /* -------------------------
       ENTRAR
    ------------------------- */

    if (enterButton) {

        enterButton.addEventListener("click", () => {

            showScreen(setupScreen);

        });

    }


    /* -------------------------
       ADICIONAR JOGADOR
    ------------------------- */

    const addPlayer =
        document.getElementById("addPlayer");

    if (addPlayer) {

        addPlayer.addEventListener("click", () => {

            if (playerCount >= 20) {

                alert(
                    "Máximo de 20 jogadores."
                );

                return;
            }

            playerCount++;

            updatePlayerInputs();

        });

    }


    /* -------------------------
       REMOVER JOGADOR
    ------------------------- */

    const removePlayer =
        document.getElementById("removePlayer");

    if (removePlayer) {

        removePlayer.addEventListener("click", () => {

            if (playerCount <= 2) {

                alert(
                    "O campeonato precisa ter pelo menos 2 jogadores."
                );

                return;
            }

            playerCount--;

            updatePlayerInputs();

        });

    }


    /* -------------------------
       COMEÇAR CAMPEONATO
    ------------------------- */

    const startButton =
        document.getElementById("startChampionship");

    if (startButton) {

        startButton.addEventListener(
            "click",
            startChampionship
        );

    }


    /* -------------------------
       HISTÓRICO
    ------------------------- */

    const historyButton =
        document.getElementById("historyButton");

    if (historyButton) {

        historyButton.addEventListener(
            "click",
            showHistory
        );

    }


    /* -------------------------
       VOLTAR PARA CONFIGURAÇÃO
    ------------------------- */

    const backToSetup =
        document.getElementById("backToSetup");

    if (backToSetup) {

        backToSetup.addEventListener(
            "click",
            () => {

                showScreen(setupScreen);

            }
        );

    }


    /* -------------------------
       NOVO CAMPEONATO
    ------------------------- */

    const resetButton =
        document.getElementById("resetChampionship");

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetChampionship
        );

    }


    /* -------------------------
       FECHAR MODAL
    ------------------------- */

    const closeModal =
        document.getElementById("closeModal");

    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeChampionModal
        );

    }


    /* -------------------------
       WHATSAPP
    ------------------------- */

    const whatsappButton =
        document.getElementById("whatsappButton");

    if (whatsappButton) {

        whatsappButton.addEventListener(
            "click",
            sendWhatsAppResult
        );

    }


    /* -------------------------
       NAVEGAÇÃO
    ------------------------- */

    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const viewId =
                        button.dataset.view;

                    showView(viewId);

                }
            );

        });

}


/* =========================================================
   CONTROLE DE TELAS
========================================================= */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(element => {

            element.classList.remove("active");

        });

    if (screen) {

        screen.classList.add("active");

    }

}


/* =========================================================
   CONTROLE DAS VIEWS
========================================================= */

function showView(viewId) {

    document
        .querySelectorAll(".view")
        .forEach(view => {

            view.classList.remove(
                "active-view"
            );

        });


    const selectedView =
        document.getElementById(viewId);

    if (selectedView) {

        selectedView.classList.add(
            "active-view"
        );

    }


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.remove("active");

            if (
                button.dataset.view === viewId
            ) {

                button.classList.add("active");

            }

        });

}


/* =========================================================
   QUANTIDADE DE JOGADORES
========================================================= */

function updatePlayerInputs() {

    if (!playerCountElement ||
        !playersInputs) {

        return;

    }


    playerCountElement.textContent =
        playerCount;


    /*
       Guardamos os nomes já digitados
       para não apagar quando o usuário
       aumentar ou diminuir a quantidade.
    */

    const oldInputs =
        [...document.querySelectorAll(
            ".player-name-input"
        )];


    const oldNames =
        oldInputs.map(
            input => input.value
        );


    playersInputs.innerHTML = "";


    for (
        let i = 0;
        i < playerCount;
        i++
    ) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "player-input";


        const oldName =
            oldNames[i] || "";


        wrapper.innerHTML = `

            <div class="player-number">
                ${String(i + 1).padStart(2, "0")}
            </div>

            <input
                type="text"
                class="player-name-input"
                placeholder="Nome do jogador ${i + 1}"
                maxlength="25"
                value="${escapeAttribute(oldName)}"
            >

        `;


        playersInputs.appendChild(
            wrapper
        );

    }

}


/* =========================================================
   INICIAR CAMPEONATO
========================================================= */

function startChampionship() {

    if (!championshipNameInput) {

        console.error(
            "Campo championshipName não encontrado."
        );

        return;

    }


    const name =
        championshipNameInput.value.trim();


    const rounds =
        parseInt(
            roundsCountInput.value,
            10
        );


    /* -------------------------
       VALIDAR NOME
    ------------------------- */

    if (!name) {

        alert(
            "Digite o nome do campeonato."
        );

        championshipNameInput.focus();

        return;

    }


    /* -------------------------
       VALIDAR RODADAS
    ------------------------- */

    if (
        isNaN(rounds) ||
        rounds < 1 ||
        rounds > 100
    ) {

        alert(
            "Escolha uma quantidade de rodadas entre 1 e 100."
        );

        roundsCountInput.focus();

        return;

    }


    /* -------------------------
       PEGAR JOGADORES
    ------------------------- */

    const playerInputs =
        document.querySelectorAll(
            ".player-name-input"
        );


    const players =
        [...playerInputs]
            .map(input =>
                input.value.trim()
            );


    /* -------------------------
       VALIDAR JOGADORES
    ------------------------- */

    if (
        players.length < 2
    ) {

        alert(
            "Adicione pelo menos 2 jogadores."
        );

        return;

    }


    if (
        players.some(
            player => !player
        )
    ) {

        alert(
            "Preencha o nome de todos os jogadores."
        );

        return;

    }


    /* -------------------------
       NOMES IGUAIS
    ------------------------- */

    const normalized =
        players.map(
            player =>
                player
                    .trim()
                    .toLowerCase()
            );

    const uniquePlayers =
        new Set(normalized);


    if (
        uniquePlayers.size !==
        normalized.length
    ) {

        alert(
            "Não pode haver jogadores com nomes iguais."
        );

        return;

    }


    /* -------------------------
       CRIAR CAMPEONATO
    ------------------------- */

    championship = {

        name: name,

        players: players,

        roundsCount: rounds,

        rounds:
            generateRounds(
                players,
                rounds
            ),

        finished: false,

        champion: null,

        lastPlace: null,

        createdAt:
            new Date().toISOString()

    };


    /* -------------------------
       SALVAR
    ------------------------- */

    saveCurrentChampionship();


    /* -------------------------
       ATUALIZAR CABEÇALHO
    ------------------------- */

    const headerName =
        document.getElementById(
            "headerChampionshipName"
        );


    if (headerName) {

        headerName.textContent =
            name;

    }


    /* -------------------------
       FECHAR MODAL SE ESTIVER ABERTO
    ------------------------- */

    closeChampionModal();


    /* -------------------------
       MOSTRAR APP
    ------------------------- */

    showScreen(appScreen);


    /* -------------------------
       MOSTRAR RODADAS
    ------------------------- */

    showView("roundsView");


    renderRounds();

    renderStandings();

    updateProgress();

}


/* =========================================================
   GERAR RODADAS
========================================================= */

function generateRounds(
    players,
    roundsCount
) {

    const rounds = [];


    for (
        let roundIndex = 0;
        roundIndex < roundsCount;
        roundIndex++
    ) {

        const matches = [];


        /*
           Cada jogador enfrenta
           todos os outros jogadores.
        */

        for (
            let i = 0;
            i < players.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < players.length;
                j++
            ) {

                matches.push({

                    player1:
                        players[i],

                    player2:
                        players[j],

                    score1:
                        null,

                    score2:
                        null

                });

            }

        }


        rounds.push({

            number:
                roundIndex + 1,

            matches:
                matches

        });

    }


    return rounds;

}


/* =========================================================
   RENDERIZAR RODADAS
========================================================= */

function renderRounds() {

    if (!roundsContainer) {

        return;

    }


    roundsContainer.innerHTML = "";


    championship.rounds.forEach(
        (round, roundIndex) => {

            const card =
                document.createElement("div");


            card.className =
                "round-card";


            const completed =
                roundIsComplete(
                    roundIndex
                );


            const previousComplete =
                roundIndex === 0 ||
                roundIsComplete(
                    roundIndex - 1
                );


            const canEdit =
                previousComplete &&
                !championship.finished;


            card.innerHTML = `

                <div class="round-header">

                    <div class="round-title">
                        Rodada ${round.number}
                    </div>

                    <div class="
                        round-status
                        ${completed ? "completed" : ""}
                    ">

                        ${
                            completed
                                ? "✓ Concluída"
                                : canEdit
                                    ? "Em andamento"
                                    : "🔒 Bloqueada"
                        }

                    </div>

                </div>

                <div class="matches"></div>

            `;


            const matchesContainer =
                card.querySelector(
                    ".matches"
                );


            round.matches.forEach(
                (match, matchIndex) => {

                    const matchElement =
                        document.createElement(
                            "div"
                        );


                    matchElement.className =
                        "match";


                    if (!canEdit) {

                        matchElement.classList.add(
                            "locked"
                        );

                    }


                    matchElement.innerHTML = `

                        <div class="team">
                            ${escapeHTML(
                                match.player1
                            )}
                        </div>

                        <div class="score-area">

                            <input
                                type="number"
                                class="score-input"
                                min="0"
                                max="99"
                                inputmode="numeric"
                                value="${
                                    match.score1 !== null
                                        ? match.score1
                                        : ""
                                }"
                                ${
                                    !canEdit
                                        ? "disabled"
                                        : ""
                                }
                                data-round="${roundIndex}"
                                data-match="${matchIndex}"
                                data-player="1"
                            >

                            <span class="score-x">
                                X
                            </span>

                            <input
                                type="number"
                                class="score-input"
                                min="0"
                                max="99"
                                inputmode="numeric"
                                value="${
                                    match.score2 !== null
                                        ? match.score2
                                        : ""
                                }"
                                ${
                                    !canEdit
                                        ? "disabled"
                                        : ""
                                }
                                data-round="${roundIndex}"
                                data-match="${matchIndex}"
                                data-player="2"
                            >

                        </div>

                        <div class="team">
                            ${escapeHTML(
                                match.player2
                            )}
                        </div>

                    `;


                    matchesContainer.appendChild(
                        matchElement
                    );

                }
            );


            roundsContainer.appendChild(
                card
            );

        }
    );


    document
        .querySelectorAll(".score-input")
        .forEach(input => {

            input.addEventListener(
                "input",
                handleScoreInput
            );

        });


    updateProgress();

}


/* =========================================================
   DIGITAÇÃO DOS PLACARES
========================================================= */

function handleScoreInput(event) {

    const input =
        event.target;


    let value =
        input.value;


    if (value === "") {

        setScore(
            input,
            null
        );

        return;

    }


    let numericValue =
        parseInt(
            value,
            10
        );


    if (isNaN(numericValue)) {

        numericValue = 0;

    }


    numericValue =
        Math.max(
            0,
            Math.min(
                99,
                numericValue
            )
        );


    input.value =
        numericValue;


    setScore(
        input,
        numericValue
    );

}


/* =========================================================
   SALVAR PLACAR
========================================================= */

function setScore(
    input,
    value
) {

    const roundIndex =
        parseInt(
            input.dataset.round,
            10
        );


    const matchIndex =
        parseInt(
            input.dataset.match,
            10
        );


    const player =
        input.dataset.player;


    if (
        !championship.rounds[roundIndex] ||
        !championship
            .rounds[roundIndex]
            .matches[matchIndex]
    ) {

        return;

    }


    const match =
        championship
            .rounds[roundIndex]
            .matches[matchIndex];


    if (player === "1") {

        match.score1 =
            value;

    } else {

        match.score2 =
            value;

    }


    saveCurrentChampionship();

    renderStandings();

    updateProgress();


    /*
       Só renderiza novamente
       quando a rodada acabou.
    */

    if (
        roundIsComplete(
            roundIndex
        )
    ) {

        renderRounds();

        renderStandings();


        if (
            allRoundsComplete()
        ) {

            finishChampionship();

        }

    }

}


/* =========================================================
   VERIFICAR RODADA
========================================================= */

function roundIsComplete(
    roundIndex
) {

    if (
        !championship.rounds[roundIndex]
    ) {

        return false;

    }


    const matches =
        championship
            .rounds[roundIndex]
            .matches;


    return matches.length > 0 &&
        matches.every(
            match =>
                match.score1 !== null &&
                match.score2 !== null
        );

}


/* =========================================================
   VERIFICAR CAMPEONATO
========================================================= */

function allRoundsComplete() {

    if (
        !championship.rounds.length
    ) {

        return false;

    }


    return championship.rounds.every(
        (round, index) =>
            roundIsComplete(index)
    );

}


/* =========================================================
   CLASSIFICAÇÃO
========================================================= */

function calculateStandings() {

    const stats = {};


    championship.players.forEach(
        player => {

            stats[player] = {

                name:
                    player,

                games:
                    0,

                wins:
                    0,

                draws:
                    0,

                losses:
                    0,

                goalsFor:
                    0,

                goalsAgainst:
                    0,

                goalDifference:
                    0,

                points:
                    0

            };

        }
    );


    championship.rounds.forEach(
        round => {

            round.matches.forEach(
                match => {

                    if (
                        match.score1 === null ||
                        match.score2 === null
                    ) {

                        return;

                    }


                    const p1 =
                        stats[match.player1];

                    const p2 =
                        stats[match.player2];


                    if (!p1 || !p2) {

                        return;

                    }


                    const s1 =
                        Number(match.score1);

                    const s2 =
                        Number(match.score2);


                    p1.games++;
                    p2.games++;


                    p1.goalsFor += s1;
                    p1.goalsAgainst += s2;

                    p2.goalsFor += s2;
                    p2.goalsAgainst += s1;


                    if (s1 > s2) {

                        p1.wins++;
                        p2.losses++;

                        p1.points += 3;

                    } else if (s2 > s1) {

                        p2.wins++;
                        p1.losses++;

                        p2.points += 3;

                    } else {

                        p1.draws++;
                        p2.draws++;

                        p1.points++;
                        p2.points++;

                    }

                }
            );

        }
    );


    Object.values(stats)
        .forEach(player => {

            player.goalDifference =
                player.goalsFor -
                player.goalsAgainst;

        });


    return Object.values(stats)
        .sort((a, b) => {

            if (
                b.points !==
                a.points
            ) {

                return b.points -
                    a.points;

            }


            if (
                b.goalDifference !==
                a.goalDifference
            ) {

                return b.goalDifference -
                    a.goalDifference;

            }


            if (
                b.goalsFor !==
                a.goalsFor
            ) {

                return b.goalsFor -
                    a.goalsFor;

            }


            return a.name.localeCompare(
                b.name,
                "pt-BR",
                {
                    sensitivity:
                        "base"
                }
            );

        });

}


/* =========================================================
   RENDERIZAR CLASSIFICAÇÃO
========================================================= */

function renderStandings() {

    if (!standingsBody) {

        return;

    }


    const standings =
        calculateStandings();


    standingsBody.innerHTML = "";


    standings.forEach(
        (player, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(
                        player.name
                    )}
                </td>

                <td>
                    ${player.games}
                </td>

                <td>
                    ${player.wins}
                </td>

                <td>
                    ${player.draws}
                </td>

                <td>
                    ${player.losses}
                </td>

                <td>
                    ${
                        player.goalDifference > 0
                            ? "+" + player.goalDifference
                            : player.goalDifference
                    }
                </td>

                <td>
                    <strong>
                        ${player.points}
                    </strong>
                </td>

            `;


            standingsBody.appendChild(
                row
            );

        }
    );


    if (
        currentLeader
    ) {

        if (
            standings.length > 0
        ) {

            currentLeader.textContent =
                standings[0].name;

        } else {

            currentLeader.textContent =
                "-";

        }

    }

}


/* =========================================================
   PROGRESSO
========================================================= */

function updateProgress() {

    if (!roundProgress) {

        return;

    }


    if (
        !championship.rounds.length
    ) {

        roundProgress.textContent =
            "0/0";

        return;

    }


    let completed = 0;


    championship.rounds.forEach(
        (round, index) => {

            if (
                roundIsComplete(index)
            ) {

                completed++;

            }

        }
    );


    roundProgress.textContent =
        `${completed}/${championship.rounds.length}`;

}


/* =========================================================
   FINALIZAR CAMPEONATO
========================================================= */

function finishChampionship() {

    if (championship.finished) {
        return;
    }

    const standings =
        calculateStandings();

    if (
        !standings ||
        standings.length === 0
    ) {
        console.error(
            "Não foi possível calcular a classificação."
        );
        return;
    }


    /* =========================================
       DEFINIR CAMPEÃO
    ========================================= */

    championship.finished = true;

    championship.champion =
        standings[0].name;

    championship.lastPlace =
        standings[standings.length - 1].name;


    console.log(
        "================================="
    );

    console.log(
        "🏆 CAMPEONATO ENCERRADO"
    );

    console.log(
        "Campeão:",
        championship.champion
    );

    console.log(
        "Último colocado:",
        championship.lastPlace
    );

    console.log(
        "================================="
    );


    /* =========================================
       SALVAR
    ========================================= */

    saveCurrentChampionship();

    addToHistory();


    /* =========================================
       ATUALIZAR TELA
    ========================================= */

    renderRounds();

    renderStandings();

    updateProgress();


    /* =========================================
       MOSTRAR CAMPEÃO
    ========================================= */

    setTimeout(() => {

        showChampionModal();

    }, 100);

}


/* =========================================================
   MODAL DO CAMPEÃO
========================================================= */

function showChampionModal() {

    if (!championModal) {
        console.error("Modal do campeão não encontrado.");
        alert(
            "🏆 CAMPEONATO ENCERRADO!\n\n" +
            "Campeão: " +
            (championship.champion || "-")
        );
        return;
    }

    const championName =
        document.getElementById("championName");

    const championshipFinishedName =
        document.getElementById("championshipFinishedName");

    const modalChampion =
        document.getElementById("modalChampion");

    const modalLast =
        document.getElementById("modalLast");


    if (championName) {
        championName.textContent =
            championship.champion || "-";
    }

    if (championshipFinishedName) {
        championshipFinishedName.textContent =
            championship.name || "-";
    }

    if (modalChampion) {
        modalChampion.textContent =
            championship.champion || "-";
    }

    if (modalLast) {
        modalLast.textContent =
            championship.lastPlace || "-";
    }


    /* =========================================
       ABRIR MODAL
    ========================================= */

    championModal.classList.add("active");

    /*
       Força a exibição caso o CSS esteja
       escondendo o modal.
    */

    championModal.style.display = "flex";

    championModal.style.visibility = "visible";

    championModal.style.opacity = "1";


    console.log(
        "🏆 CAMPEONATO FINALIZADO!"
    );

    console.log(
        "Campeão:",
        championship.champion
    );

}


function closeChampionModal() {

    if (!championModal) {
        return;
    }

    championModal.classList.remove("active");

    championModal.style.display = "none";

}


/* =========================================================
   HISTÓRICO
========================================================= */

function getHistory() {

    try {

        const saved =
            localStorage.getItem(
                "fifaChampionshipHistory"
            );


        if (!saved) {

            return [];

        }


        const parsed =
            JSON.parse(saved);


        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "Erro ao carregar histórico:",
            error
        );

        return [];

    }

}


function addToHistory() {

    const history =
        getHistory();


    /*
       Evita salvar o mesmo campeonato
       várias vezes.
    */

    const alreadyExists =
        history.some(
            item =>
                item.createdAt ===
                championship.createdAt
        );


    if (
        alreadyExists
    ) {

        return;

    }


    history.unshift({

        name:
            championship.name,

        players:
            [...championship.players],

        roundsCount:
            championship.roundsCount,

        champion:
            championship.champion,

        lastPlace:
            championship.lastPlace,

        createdAt:
            championship.createdAt

    });


    /*
       Mantém os últimos 50 campeonatos.
    */

    const limitedHistory =
        history.slice(0, 50);


    try {

        localStorage.setItem(
            "fifaChampionshipHistory",
            JSON.stringify(
                limitedHistory
            )
        );

    } catch (error) {

        console.error(
            "Erro ao salvar histórico:",
            error
        );

    }

}


function showHistory() {

    renderHistory();

    showScreen(historyScreen);

}


function renderHistory() {

    const container =
        document.getElementById(
            "historyContainer"
        );


    if (!container) {

        return;

    }


    const history =
        getHistory();


    container.innerHTML = "";


    if (
        history.length === 0
    ) {

        container.innerHTML = `

            <div class="history-empty">

                <strong>
                    Nenhum campeonato ainda
                </strong>

                <p>
                    Seus campeonatos finalizados
                    aparecerão aqui.
                </p>

            </div>

        `;

        return;

    }


    history.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "history-card";


            const date =
                item.createdAt
                    ? formatDate(
                        item.createdAt
                    )
                    : "";


            card.innerHTML = `

                <div class="history-card-header">

                    <div>

                        <span>
                            CAMPEONATO
                        </span>

                        <h3>
                            ${escapeHTML(
                                item.name
                            )}
                        </h3>

                    </div>

                    <div class="history-date">
                        ${date}
                    </div>

                </div>

                <div class="history-info">

                    <div>
                        <span>Jogadores</span>
                        <strong>
                            ${item.players.length}
                        </strong>
                    </div>

                    <div>
                        <span>Rodadas</span>
                        <strong>
                            ${item.roundsCount}
                        </strong>
                    </div>

                    <div>
                        <span>Campeão</span>
                        <strong>
                            ${escapeHTML(
                                item.champion || "-"
                            )}
                        </strong>
                    </div>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   NOVO CAMPEONATO
========================================================= */

function resetChampionship() {

    const confirmReset =
        confirm(
            "Deseja realmente começar um novo campeonato?"
        );


    if (!confirmReset) {

        return;

    }


    championship = {

        name: "",

        players: [],

        roundsCount: 5,

        rounds: [],

        finished: false,

        champion: null,

        lastPlace: null,

        createdAt: null

    };


    try {

        localStorage.removeItem(
            "fifaCurrentChampionship"
        );

    } catch (error) {

        console.error(
            "Erro ao limpar campeonato:",
            error
        );

    }


    championshipNameInput.value =
        "";


    roundsCountInput.value =
        "5";


    playerCount =
        3;


    updatePlayerInputs();


    closeChampionModal();


    showScreen(setupScreen);

}


/* =========================================================
   SALVAR CAMPEONATO ATUAL
========================================================= */

function saveCurrentChampionship() {

    try {

        localStorage.setItem(
            "fifaCurrentChampionship",
            JSON.stringify(
                championship
            )
        );

    } catch (error) {

        console.error(
            "Erro ao salvar campeonato:",
            error
        );

    }

}


/* =========================================================
   CARREGAR CAMPEONATO
========================================================= */

function loadCurrentChampionship() {

    try {

        const saved =
            localStorage.getItem(
                "fifaCurrentChampionship"
            );


        if (!saved) {

            /*
               Garante que a tela inicial
               seja a tela de boas-vindas.
            */

            showScreen(welcomeScreen);

            return;

        }


        const parsed =
            JSON.parse(saved);


        if (
            !parsed ||
            !parsed.name ||
            !Array.isArray(
                parsed.players
            ) ||
            !Array.isArray(
                parsed.rounds
            )
        ) {

            showScreen(welcomeScreen);

            return;

        }


        championship =
            parsed;


        playerCount =
            championship.players.length;


        const headerName =
            document.getElementById(
                "headerChampionshipName"
            );


        if (headerName) {

            headerName.textContent =
                championship.name;

        }


        /*
           Se existe campeonato salvo,
           abre diretamente o campeonato.
        */

        showScreen(appScreen);

        showView("roundsView");

        renderRounds();

        renderStandings();

        updateProgress();


        if (
            championship.finished
        ) {

            showChampionModal();

        }

    } catch (error) {

        console.error(
            "Erro ao carregar campeonato:",
            error
        );


        showScreen(welcomeScreen);

    }

}


/* =========================================================
   WHATSAPP
========================================================= */

function sendWhatsAppResult() {

    const standings = calculateStandings();

    if (!standings || standings.length === 0) {
        return;
    }

    const champion =
        championship.champion ||
        standings[0].name;

    const championStats =
        standings.find(
            player => player.name === champion
        ) || standings[0];


    const jogos = championStats.games;

    const vitorias = championStats.wins;

    const empates = championStats.draws;

    const derrotas = championStats.losses;

    const golsMarcados = championStats.goalsFor;


    const mediaGols =
        jogos > 0
            ? (golsMarcados / jogos).toFixed(2)
            : "0.00";


    const aproveitamento =
        jogos > 0
            ? (
                (championStats.points /
                (jogos * 3)) * 100
            ).toFixed(1)
            : "0.0";


    const message =
`FIFA CHAMPIONSHIP

Campeonato: ${championship.name}

CAMPEÃO
${champion}

ESTATÍSTICAS DO CAMPEÃO

Jogos: ${jogos}
Vitórias: ${vitorias}
Empates: ${empates}
Derrotas: ${derrotas}
Gols marcados: ${golsMarcados}
Média de gols por jogo: ${mediaGols}
Aproveitamento: ${aproveitamento}%

CLASSIFICAÇÃO

${standings
    .map(
        (player, index) =>
            `${index + 1}º ${player.name} — ${player.points} pts`
    )
    .join("\n")}

FIFA Championship`;


    const encoded =
        encodeURIComponent(message);


    if (WHATSAPP_GROUP_LINK) {

        window.open(
            WHATSAPP_GROUP_LINK,
            "_blank"
        );

        return;
    }


    window.open(
        "https://wa.me/?text=" + encoded,
        "_blank"
    );

}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(value) {

    return escapeHTML(value);

}


function formatDate(
    dateString
) {

    try {

        const date =
            new Date(dateString);


        return date.toLocaleDateString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    } catch (error) {

        return "";

    }

}

