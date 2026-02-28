const fighters = {
  luffy: { name: 'Monkey D. Luffy', basic: [8, 16], special: [15, 28], line: '¡Gomu Gomu no...!' },
  zoro: { name: 'Roronoa Zoro', basic: [9, 17], special: [14, 30], line: '¡Santoryu en acción!' },
  sanji: { name: 'Vinsmoke Sanji', basic: [7, 18], special: [16, 27], line: '¡Diable Jambe!' },
  ace: { name: 'Portgas D. Ace', basic: [8, 15], special: [17, 29], line: '¡Hiken!' }
};

const playerName = document.getElementById('player-name');
const enemyName = document.getElementById('enemy-name');
const playerHealthText = document.getElementById('player-health');
const enemyHealthText = document.getElementById('enemy-health');
const playerBar = document.getElementById('player-healthbar');
const enemyBar = document.getElementById('enemy-healthbar');
const log = document.getElementById('battle-log');
const select = document.getElementById('character-select');
const attackBtn = document.getElementById('attack-btn');
const specialBtn = document.getElementById('special-btn');
const resetBtn = document.getElementById('reset-btn');

let state = {
  playerKey: 'luffy',
  enemyKey: 'zoro',
  playerHp: 100,
  enemyHp: 100,
  gameOver: false
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function writeLog(message, cssClass = '') {
  const item = document.createElement('li');
  item.textContent = message;
  if (cssClass) item.classList.add(cssClass);
  log.prepend(item);
}

function updateUi() {
  const playerPct = Math.max(state.playerHp, 0);
  const enemyPct = Math.max(state.enemyHp, 0);

  playerName.textContent = fighters[state.playerKey].name;
  enemyName.textContent = fighters[state.enemyKey].name;
  playerHealthText.textContent = state.playerHp;
  enemyHealthText.textContent = state.enemyHp;
  playerBar.style.width = `${playerPct}%`;
  enemyBar.style.width = `${enemyPct}%`;
}

function pickEnemy() {
  const keys = Object.keys(fighters).filter((key) => key !== state.playerKey);
  state.enemyKey = keys[randomInt(0, keys.length - 1)];
}

function endGame(playerWon) {
  state.gameOver = true;
  attackBtn.disabled = true;
  specialBtn.disabled = true;
  if (playerWon) {
    writeLog(`🏴‍☠️ ${fighters[state.playerKey].name} gana el combate. ¡Te conviertes en Rey de los Piratas!`, 'win');
  } else {
    writeLog(`💥 ${fighters[state.enemyKey].name} te derrotó. Entrena y vuelve al Grand Line.`, 'lose');
  }
}

function enemyTurn() {
  if (state.gameOver) return;
  const enemy = fighters[state.enemyKey];
  const useSpecial = Math.random() < 0.35;
  const [min, max] = useSpecial ? enemy.special : enemy.basic;
  const damage = randomInt(min, max);
  state.playerHp = Math.max(0, state.playerHp - damage);
  writeLog(`${enemy.name} contraataca (${useSpecial ? 'especial' : 'básico'}) y te quita ${damage} de vida.`);
  updateUi();

  if (state.playerHp <= 0) {
    endGame(false);
  }
}

function playerTurn(kind) {
  if (state.gameOver) return;

  const player = fighters[state.playerKey];
  const [min, max] = kind === 'special' ? player.special : player.basic;
  const damage = randomInt(min, max);

  state.enemyHp = Math.max(0, state.enemyHp - damage);
  writeLog(`${player.line} Ataque ${kind === 'special' ? 'especial' : 'básico'}: haces ${damage} de daño.`);
  updateUi();

  if (state.enemyHp <= 0) {
    endGame(true);
    return;
  }

  setTimeout(enemyTurn, 550);
}

function resetGame() {
  state = {
    playerKey: select.value,
    enemyKey: 'zoro',
    playerHp: 100,
    enemyHp: 100,
    gameOver: false
  };
  pickEnemy();
  attackBtn.disabled = false;
  specialBtn.disabled = false;
  log.innerHTML = '';
  writeLog(`Nuevo duelo: ${fighters[state.playerKey].name} vs ${fighters[state.enemyKey].name}.`);
  updateUi();
}

attackBtn.addEventListener('click', () => playerTurn('basic'));
specialBtn.addEventListener('click', () => playerTurn('special'));
resetBtn.addEventListener('click', resetGame);
select.addEventListener('change', resetGame);

resetGame();
