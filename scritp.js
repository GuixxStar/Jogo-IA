const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const p1ScoreEl = document.getElementById('p1Score');
const p2ScoreEl = document.getElementById('p2Score');

let p1Score = 0;
let p2Score = 0;

const player1 = {
  x: 30,
  y: 180,
  width: 20,
  height: 50,
  color: '#00e676',
  speed: 5
};

const player2 = {
  x: 750,
  y: 180,
  width: 20,
  height: 50,
  color: '#ff5252',
  speed: 5
};

const keys = {};
const bullets = [];

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  // Tiro do Jogador 1 (Barra de Espaço)
  if (e.key === ' ' || e.key === 'Spacebar') {
    bullets.push({
      x: player1.x + player1.width,
      y: player1.y + player1.height / 2 - 3,
      width: 16,
      height: 6,
      speedX: 9,
      color: '#00e676',
      owner: 1
    });
  }

  // Tiro do Jogador 2 (Tecla Enter)
  if (e.key === 'Enter') {
    bullets.push({
      x: player2.x - 16,
      y: player2.y + player2.height / 2 - 3,
      width: 16,
      height: 6,
      speedX: -9,
      color: '#ff5252',
      owner: 2
    });
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function update() {
  // Movimentação do Jogador 1 (W e S)
  if ((keys['w'] || keys['W']) && player1.y > 0) {
    player1.y -= player1.speed;
  }
  if ((keys['s'] || keys['S']) && player1.y + player1.height < canvas.height) {
    player1.y += player1.speed;
  }

  // Movimentação do Jogador 2 (Setas Cima e Baixo)
  if (keys['ArrowUp'] && player2.y > 0) {
    player2.y -= player2.speed;
  }
  if (keys['ArrowDown'] && player2.y + player2.height < canvas.height) {
    player2.y += player2.speed;
  }

  // Atualização dos projéteis
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.speedX;

    if (b.x < 0 || b.x > canvas.width) {
      bullets.splice(i, 1);
      continue;
    }

    if (
      b.owner === 1 &&
      b.x + b.width >= player2.x &&
      b.y + b.height >= player2.y &&
      b.y <= player2.y + player2.height
    ) {
      p1Score++;
      p1ScoreEl.textContent = p1Score;
      bullets.splice(i, 1);
    } else if (
      b.owner === 2 &&
      b.x <= player1.x + player1.width &&
      b.y + b.height >= player1.y &&
      b.y <= player1.y + player1.height
    ) {
      p2Score++;
      p2ScoreEl.textContent = p2Score;
      bullets.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

  ctx.fillStyle = player2.color;
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

  bullets.forEach((b) => {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();