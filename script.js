// script.js

// --- Neige avec canvas, plus douce ---
const canvas = document.getElementById('snowCanvas');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

// Moins de flocons et plus doux
const maxFlakes = 150;
const flakes = [];

for (let i = 0; i < maxFlakes; i++) {
  flakes.push({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 1.5 + Math.random() * 2.5,      // flocons légèrement plus gros
    d: Math.random() * maxFlakes,
    speed: 0.3 + Math.random() * 1.2
  });
}

let angle = 0;

function drawSnow() {
  ctx.clearRect(0, 0, W, H);

  // Couleur plus transparente = effet plus léger
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.beginPath();

  for (let i = 0; i < maxFlakes; i++) {
    const f = flakes[i];
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
  }

  ctx.fill();
  updateSnow();
}

function updateSnow() {
  angle += 0.0008;

  for (let i = 0; i < maxFlakes; i++) {
    const f = flakes[i];

    f.y += f.speed + Math.cos(angle + f.d) * 0.2;
    f.x += Math.sin(angle) * 0.5;

    if (f.y > H + 5 || f.x < -10 || f.x > W + 10) {
      const rand = Math.random();
      if (rand > 0.33) {
        f.x = Math.random() * W;
        f.y = -10;
      } else if (Math.sin(angle) > 0) {
        f.x = -10;
        f.y = Math.random() * H;
      } else {
        f.x = W + 10;
        f.y = Math.random() * H;
      }
    }
  }
}

function animateSnow() {
  drawSnow();
  requestAnimationFrame(animateSnow);
}

animateSnow();

window.addEventListener('resize', () => {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
});

// --- Ouverture de l'enveloppe ---
const envelope = document.getElementById('envelope');
const envelopeSeal = document.getElementById('envelopeSeal');

envelopeSeal.addEventListener('click', () => {
  envelope.classList.add('open');

  // On peut aussi désactiver le sceau pour éviter plusieurs clics
  envelopeSeal.disabled = true;
});

// Simule la base de données en chargeant participants.json
let participants = [];

fetch('participants.json')
  .then((res) => res.json())
  .then((data) => {
    participants = data;
  })
  .catch((err) => {
    console.error('Erreur de chargement du fichier participants.json', err);
  });

// --- Formulaire et résultat ---
const loginForm = document.getElementById('loginForm');
const resultBox = document.getElementById('resultBox');
const resultText = document.getElementById('resultText');

const letterResult = document.getElementById('letterResult');
const letterResultText = document.getElementById('letterResultText');


// Gestion du formulaire
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const prenom = document.getElementById('prenom').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if (!prenom || !password) {
      alert('Merci de remplir ton prénom et ton mot de passe.');
      return;
    }

    const user = participants.find(
      (p) =>
        p.prenom.toLowerCase() === prenom &&
        p.password === password
    );

    if (!user) {
      const errorMessage =
        'Impossible de te trouver… Vérifie ton prénom et ton mot de passe, ou contacte l’organisateur.';

      // Option : montrer ce message dans la lettre
      if (letterResult && letterResultText) {
        // cacher le formulaire
        loginForm.classList.add('is-hidden');
        // afficher le bloc résultat
        letterResult.classList.remove('is-hidden');
        // mettre le texte (erreur ou succès)
        letterResultText.textContent = errorMessage;
        }

      return;
    }

    // Message de succès avec adresse
    const cible = participants.find(
    (p) => p.prenom.toLowerCase() === user.cible.toLowerCase()
    );

    // Par sécurité, si on ne trouve pas la cible, on affiche au moins son prénom
    const cibleNom = cible ? cible.prenom : user.cible;
    const cibleAdresse = cible && cible.adresse ? cible.adresse : "Adresse non disponible";

    // 1) Lettre : remplacer le formulaire par le message
    if (letterResult && letterResultText) {
    loginForm.classList.add('is-hidden');
    letterResult.classList.remove('is-hidden');

    letterResultText.innerHTML =
        'Tu as tiré <strong>' + cibleNom +
        '</strong> ! <br><br>' +
        '<span><u>Adresse postale :</u> <br> ' + cibleAdresse + '</span>' + 
        '<br><br> Joyeux Noël !🎄';
    }

  });
} else {
  console.error('Élément #loginForm introuvable');
}

