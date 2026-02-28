const gears = [
  { name: 'Gear 1', basic: [8, 14], special: [14, 22], line: '¡Gomu Gomu no Pistol!' },
  { name: 'Gear 2', basic: [11, 18], special: [18, 28], line: '¡Jet Gatling!' },
  { name: 'Gear 3', basic: [13, 21], special: [22, 32], line: '¡Gigant Rifle!' },
  { name: 'Gear 4', basic: [16, 25], special: [27, 38], line: '¡Kong Gun!' },
  { name: 'Gear 5', basic: [20, 30], special: [34, 48], line: '¡Bajrang Gun!' }
];

const bosses = [
  { name: 'Rob Lucci', hp: 120, basic: [10, 16], special: [16, 24] },
  { name: 'Donquixote Doflamingo', hp: 145, basic: [12, 18], special: [18, 27] },
  { name: 'Charlotte Katakuri', hp: 170, basic: [14, 21], special: [21, 30] },
  { name: 'Kaido', hp: 210, basic: [16, 24], special: [25, 36] }
];

const playerName = document.getElementById('player-name');
const enemyName = document.getElementById('enemy-name');
const playerHealthText = document.getElementById('player-health');
const enemyHealthText = document.getElementById('enemy-health');
const playerBar = document.getElementById('player-healthbar');
const enemyBar = document.getElementById('enemy-healthbar');
const log = document.getElementById('battle-log');
const attackBtn = document.getElementById('attack-btn');
const specialBtn = document.getElementById('special-btn');
const resetBtn = document.getElementById('reset-btn');
const levelLabel = document.getElementById('level-label');
const gearLabel = document.getElementById('gear-label');
const nextUnlock = document.getElementById('next-unlock');

let state = {
  level: 0,
  gear: 0,
  playerHp: 100,
  enemyHp: bosses[0].hp,
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

function currentBoss() {
  return bosses[state.level];
}

function currentGear() {
  return gears[state.gear];
}

function updateUi() {
  const boss = currentBoss();
  const maxBossHp = boss.hp;
  const playerPct = Math.max(state.playerHp, 0);
  const enemyPct = Math.max((state.enemyHp / maxBossHp) * 100, 0);

  playerName.textContent = 'Monkey D. Luffy';
  enemyName.textContent = boss.name;
  playerHealthText.textContent = state.playerHp;
  enemyHealthText.textContent = state.enemyHp;
  playerBar.style.width = `${playerPct}%`;
  enemyBar.style.width = `${enemyPct}%`;

  levelLabel.textContent = `${state.level + 1} / ${bosses.length}`;
  gearLabel.textContent = currentGear().name;
  nextUnlock.textContent = state.gear < gears.length - 1
    ? `${gears[state.gear + 1].name} al vencer este nivel`
    : 'Máximo desbloqueado';
}

function setControlsEnabled(enabled) {
  attackBtn.disabled = !enabled;
  specialBtn.disabled = !enabled;
}

function startLevel() {
  state.playerHp = 100;
  state.enemyHp = currentBoss().hp;
  state.gameOver = false;
  setControlsEnabled(true);
  writeLog(`🔥 Nivel ${state.level + 1}: Luffy vs ${currentBoss().name}.`);
  updateUi();
}

function winCampaign() {
  state.gameOver = true;
  setControlsEnabled(false);
  writeLog('👑 ¡Has derrotado a todos! Luffy domina el Gear 5 y se acerca al One Piece.', 'win');
}

function loseBattle() {
  state.gameOver = true;
  setControlsEnabled(false);
  writeLog(`💥 ${currentBoss().name} te derrotó. Pulsa "Reiniciar campaña" para intentarlo otra vez.`, 'lose');
}

function unlockNextGearIfPossible() {
  if (state.gear < gears.length - 1) {
    state.gear += 1;
    writeLog(`✨ Desbloqueado: ${currentGear().name}.`, 'win');
  }
}

function handleVictory() {
  writeLog(`🏴‍☠️ ¡Venciste a ${currentBoss().name}!`, 'win');
  unlockNextGearIfPossible();

  if (state.level === bosses.length - 1) {
    winCampaign();
    updateUi();
    return;
  }

  state.level += 1;
  startLevel();
}

function enemyTurn() {
  if (state.gameOver) return;
  const boss = currentBoss();
  const useSpecial = Math.random() < 0.35;
  const [min, max] = useSpecial ? boss.special : boss.basic;
  const damage = randomInt(min, max);

  state.playerHp = Math.max(0, state.playerHp - damage);
  writeLog(`${boss.name} contraataca (${useSpecial ? 'especial' : 'básico'}) y te quita ${damage} de vida.`);
  updateUi();

  if (state.playerHp <= 0) {
    loseBattle();
  }
}

function playerTurn(kind) {
  if (state.gameOver) return;

  const gear = currentGear();
  const [min, max] = kind === 'special' ? gear.special : gear.basic;
  const damage = randomInt(min, max);

  state.enemyHp = Math.max(0, state.enemyHp - damage);
  writeLog(`${gear.line} Ataque ${kind === 'special' ? 'Gear' : 'básico'}: haces ${damage} de daño.`);
  updateUi();

  if (state.enemyHp <= 0) {
    handleVictory();
    return;
  }

  setTimeout(enemyTurn, 500);
}

function resetCampaign() {
  state = {
    level: 0,
    gear: 0,
    playerHp: 100,
    enemyHp: bosses[0].hp,
    gameOver: false
  };

  log.innerHTML = '';
  writeLog('🏁 Comienza la campaña. Derrota a cada jefe para evolucionar de Gear.');
  startLevel();
}

attackBtn.addEventListener('click', () => playerTurn('basic'));
specialBtn.addEventListener('click', () => playerTurn('special'));
resetBtn.addEventListener('click', resetCampaign);

resetCampaign();
