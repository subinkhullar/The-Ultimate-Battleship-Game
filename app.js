/**
 * THE ULTIMATE BATTLESHIP STRATEGY GAME
 * Author: Subin Khullar 😎
 * Year: 2026
 * Pure Vanilla JavaScript implementation with Web Audio synthesizer,
 * advanced AI heatmaps, canvas particles, and PWA capabilities.
 */

'use strict';

// ==========================================
// 1. SOUND & AUDIO SYNTHESIZER (WEB AUDIO API)
// ==========================================
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.7;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = parseFloat(val);
    if (this.masterGain && !this.muted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.muted;
  }

  playCannon() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;
    
    // Low frequency dive
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

    gain.gain.setValueAtTime(1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.35);

    // Blast noise
    this.playNoise(0.25, 400, 0.4);
  }

  playMissile() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.4);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  playTorpedo() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.linearRampToValueAtTime(120, t + 0.3);
    osc.frequency.linearRampToValueAtTime(40, t + 0.6);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  playRadarPing() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1250, t);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.8);
  }

  playExplosion() {
    if (this.muted) return;
    this.init();
    this.playNoise(0.6, 200, 1.2);

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.5);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  playSplash() {
    if (this.muted) return;
    this.init();
    this.playNoise(0.4, 900, 0.35);
  }

  playSinking() {
    if (this.muted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 1.2);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 1.2);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + (idx * 0.16);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  playDefeat() {
    if (this.muted) return;
    this.init();
    const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const t = this.ctx.currentTime + (idx * 0.22);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  playNoise(duration, filterFreq, gainVal) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(this.ctx.currentTime);
    noise.stop(this.ctx.currentTime + duration);
  }
}

// ==========================================
// 2. CANVAS PARTICLE & VISUAL FX SYSTEM
// ==========================================
class FXRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createExplosion(x, y, color = '#ef4444', count = 35) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.03 + 0.015,
        size: Math.random() * 5 + 2,
        color
      });
    }
  }

  createSplash(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI - Math.PI; // Upward spray
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: Math.random() * 0.04 + 0.02,
        size: Math.random() * 3 + 1.5,
        color: '#38bdf8'
      });
    }
  }

  createFireworks() {
    for (let f = 0; f < 5; f++) {
      setTimeout(() => {
        const x = Math.random() * (this.canvas.width * 0.8) + (this.canvas.width * 0.1);
        const y = Math.random() * (this.canvas.height * 0.5) + 50;
        const colors = ['#38bdf8', '#ef4444', '#10b981', '#f59e0b', '#a855f7'];
        const col = colors[Math.floor(Math.random() * colors.length)];
        this.createExplosion(x, y, col, 50);
      }, f * 250);
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.life;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    requestAnimationFrame(this.animate);
  }
}

// ==========================================
// 3. SHIP SPECIFICATIONS & FLEET CLASSES
// ==========================================
const FLEET_DEFINITIONS = [
  { id: 'carrier', name: 'Carrier', length: 6, icon: '🚢', desc: 'Floating fortress & flagship.' },
  { id: 'battleship', name: 'Battleship', length: 5, icon: '⚔️', desc: 'Heavy armor dreadnought.' },
  { id: 'cruiser', name: 'Cruiser', length: 4, icon: '🛡️', desc: 'Rapid assault cruiser.' },
  { id: 'submarine', name: 'Submarine', length: 3, icon: '🌊', desc: 'Silent abyssal predator.' },
  { id: 'destroyer', name: 'Destroyer', length: 3, icon: '💥', desc: 'Versatile escort vessel.' },
  { id: 'patrol', name: 'Patrol Boat', length: 2, icon: '⚡', desc: 'Agile scout interceptor.' }
];

// ==========================================
// 4. ADVANCED ARTIFICIAL INTELLIGENCE
// ==========================================
class NavalAI {
  constructor(difficulty = 'hard') {
    this.difficulty = difficulty;
    this.targetQueue = [];
    this.lastHit = null;
    this.potentialTargets = [];
    this.mode = 'hunt'; // 'hunt' or 'target'
  }

  reset() {
    this.targetQueue = [];
    this.lastHit = null;
    this.potentialTargets = [];
    this.mode = 'hunt';
  }

  calculateNextMove(playerGrid, unSunkShipLengths) {
    if (this.difficulty === 'easy') {
      return this.getRandomMove(playerGrid);
    } else if (this.difficulty === 'medium') {
      return this.getMediumMove(playerGrid);
    } else {
      return this.getHardProbabilityMove(playerGrid, unSunkShipLengths);
    }
  }

  getRandomMove(grid) {
    const available = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!grid[r][c].attacked) {
          available.push({ r, c });
        }
      }
    }
    return available[Math.floor(Math.random() * available.length)];
  }

  getMediumMove(grid) {
    // If we have targeted coordinates in queue
    while (this.targetQueue.length > 0) {
      const candidate = this.targetQueue.shift();
      if (!grid[candidate.r][candidate.c].attacked) {
        return candidate;
      }
    }
    // Otherwise random search
    return this.getRandomMove(grid);
  }

  getHardProbabilityMove(grid, remainingShipLengths) {
    // If target queue has elements, prioritize target tracking
    while (this.targetQueue.length > 0) {
      const candidate = this.targetQueue.shift();
      if (!grid[candidate.r][candidate.c].attacked) {
        return candidate;
      }
    }

    // Probability Density Heatmap Matrix (10x10)
    const heatmap = Array.from({ length: 10 }, () => Array(10).fill(0));

    // Calculate probability density for every surviving ship
    remainingShipLengths.forEach((length) => {
      // Horizontal placements
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c <= 10 - length; c++) {
          let valid = true;
          let hitsContained = 0;
          for (let i = 0; i < length; i++) {
            const cell = grid[r][c + i];
            if (cell.attacked && !cell.hasShip) {
              valid = false;
              break;
            }
            if (cell.attacked && cell.hasShip && cell.sunk) {
              valid = false;
              break;
            }
            if (cell.attacked && cell.hasShip) {
              hitsContained++;
            }
          }
          if (valid) {
            const weight = 1 + (hitsContained * 15);
            for (let i = 0; i < length; i++) {
              if (!grid[r][c + i].attacked) {
                // Parity checker bonus (checkerboard sampling)
                const parityBonus = ((r + c + i) % 2 === 0) ? 2 : 1;
                heatmap[r][c + i] += weight * parityBonus;
              }
            }
          }
        }
      }

      // Vertical placements
      for (let r = 0; r <= 10 - length; r++) {
        for (let c = 0; c < 10; c++) {
          let valid = true;
          let hitsContained = 0;
          for (let i = 0; i < length; i++) {
            const cell = grid[r + i][c];
            if (cell.attacked && !cell.hasShip) {
              valid = false;
              break;
            }
            if (cell.attacked && cell.hasShip && cell.sunk) {
              valid = false;
              break;
            }
            if (cell.attacked && cell.hasShip) {
              hitsContained++;
            }
          }
          if (valid) {
            const weight = 1 + (hitsContained * 15);
            for (let i = 0; i < length; i++) {
              if (!grid[r + i][c].attacked) {
                const parityBonus = ((r + i + c) % 2 === 0) ? 2 : 1;
                heatmap[r + i][c] += weight * parityBonus;
              }
            }
          }
        }
      }
    });

    // Find highest cell on heatmap
    let maxVal = -1;
    let bestMoves = [];

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (!grid[r][c].attacked) {
          if (heatmap[r][c] > maxVal) {
            maxVal = heatmap[r][c];
            bestMoves = [{ r, c }];
          } else if (heatmap[r][c] === maxVal) {
            bestMoves.push({ r, c });
          }
        }
      }
    }

    if (bestMoves.length > 0) {
      return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }
    return this.getRandomMove(grid);
  }

  registerAttackResult(r, c, hit, sunk, grid) {
    if (hit && !sunk) {
      const neighbors = [
        { r: r - 1, c },
        { r: r + 1, c },
        { r, c: c - 1 },
        { r, c: c + 1 }
      ];
      neighbors.forEach((n) => {
        if (n.r >= 0 && n.r < 10 && n.c >= 0 && n.c < 10 && !grid[n.r][n.c].attacked) {
          this.targetQueue.push(n);
        }
      });
    }
    if (sunk) {
      this.targetQueue = this.targetQueue.filter((pos) => !grid[pos.r][pos.c].attacked);
    }
  }
}

// ==========================================
// 5. STORAGE & STATISTICS MANAGER
// ==========================================
class NavalArchive {
  constructor() {
    this.keyStats = 'subin_battleship_stats';
    this.keySettings = 'subin_battleship_settings';
    this.keyAchievements = 'subin_battleship_medals';
    this.keyLeaderboard = 'subin_battleship_ranks';

    this.stats = this.load(this.keyStats, {
      played: 0,
      won: 0,
      lost: 0,
      shotsFired: 0,
      hits: 0,
      misses: 0,
      shipsDestroyed: 0,
      weaponsUsed: { cannon: 0, torpedo: 0, depth: 0, missile: 0, radar: 0 },
      aiRecord: { easy: { won: 0, lost: 0 }, medium: { won: 0, lost: 0 }, hard: { won: 0, lost: 0 } }
    });

    this.settings = this.load(this.keySettings, {
      commanderName: 'Subin Khullar',
      enemyName: 'Admiral Megatron',
      theme: 'naval-blue',
      volume: 0.7
    });

    this.achievements = this.load(this.keyAchievements, {
      firstVictory: { id: 'firstVictory', title: 'First Blood', desc: 'Secure your first naval victory', unlocked: false },
      marksman: { id: 'marksman', title: 'Flawless Gunner', desc: 'Achieve > 65% accuracy in a match', unlocked: false },
      torpedoAce: { id: 'torpedoAce', title: 'Torpedo Master', desc: 'Strike multiple hulls with a single Torpedo', unlocked: false },
      hardenedAdmiral: { id: 'hardenedAdmiral', title: 'Master Strategist', desc: 'Defeat the Hard AI Threat Level', unlocked: false },
      streak: { id: 'streak', title: 'Naval Supremacy', desc: 'Win 3 campaigns in a row', unlocked: false },
      depthVessel: { id: 'depthVessel', title: 'Abyssal Depth', desc: 'Sunk a vessel using Depth Charges', unlocked: false }
    });

    this.leaderboard = this.load(this.keyLeaderboard, [
      { commander: 'Fleet Adm. Subin', score: 12500, accuracy: '78%', duration: '2m 14s' },
      { commander: 'Capt. Nemo', score: 9800, accuracy: '62%', duration: '3m 45s' },
      { commander: 'Lt. Commander Star', score: 7200, accuracy: '54%', duration: '4m 10s' }
    ]);
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  saveAll() {
    localStorage.setItem(this.keyStats, JSON.stringify(this.stats));
    localStorage.setItem(this.keySettings, JSON.stringify(this.settings));
    localStorage.setItem(this.keyAchievements, JSON.stringify(this.achievements));
    localStorage.setItem(this.keyLeaderboard, JSON.stringify(this.leaderboard));
  }

  recordMatch(won, mode, difficulty, shots, hits, sinks, weaponUsedMap, durationStr, score) {
    this.stats.played++;
    if (won) this.stats.won++;
    else this.stats.lost++;

    this.stats.shotsFired += shots;
    this.stats.hits += hits;
    this.stats.misses += (shots - hits);
    this.stats.shipsDestroyed += sinks;

    for (let w in weaponUsedMap) {
      if (this.stats.weaponsUsed[w] !== undefined) {
        this.stats.weaponsUsed[w] += weaponUsedMap[w];
      }
    }

    if (this.stats.aiRecord[difficulty]) {
      if (won) this.stats.aiRecord[difficulty].won++;
      else this.stats.aiRecord[difficulty].lost++;
    }

    // Achievements Check
    if (won && !this.achievements.firstVictory.unlocked) {
      this.unlockAchievement('firstVictory');
    }
    const acc = shots > 0 ? (hits / shots) * 100 : 0;
    if (won && acc >= 65 && !this.achievements.marksman.unlocked) {
      this.unlockAchievement('marksman');
    }
    if (won && difficulty === 'hard' && !this.achievements.hardenedAdmiral.unlocked) {
      this.unlockAchievement('hardenedAdmiral');
    }

    // Record Leaderboard
    if (won) {
      this.leaderboard.push({
        commander: this.settings.commanderName,
        score,
        accuracy: `${Math.round(acc)}%`,
        duration: durationStr
      });
      this.leaderboard.sort((a, b) => b.score - a.score);
      this.leaderboard = this.leaderboard.slice(0, 10);
    }

    this.saveAll();
  }

  unlockAchievement(id) {
    if (this.achievements[id] && !this.achievements[id].unlocked) {
      this.achievements[id].unlocked = true;
      this.saveAll();
      showToast(`🎖️ DISTINCTION UNLOCKED: ${this.achievements[id].title}!`);
    }
  }

  resetStats() {
    this.stats = {
      played: 0,
      won: 0,
      lost: 0,
      shotsFired: 0,
      hits: 0,
      misses: 0,
      shipsDestroyed: 0,
      weaponsUsed: { cannon: 0, torpedo: 0, depth: 0, missile: 0, radar: 0 },
      aiRecord: { easy: { won: 0, lost: 0 }, medium: { won: 0, lost: 0 }, hard: { won: 0, lost: 0 } }
    };
    this.saveAll();
  }
}

// ==========================================
// 6. MAIN GAME ENGINE CONTROLLER
// ==========================================
class BattleshipGame {
  constructor() {
    this.sound = new SoundSynthesizer();
    this.archive = new NavalArchive();
    this.ai = new NavalAI('medium');

    this.canvas = document.getElementById('fx-canvas');
    this.fx = new FXRenderer(this.canvas);

    // Boards state
    this.playerGrid = this.createEmptyGrid();
    this.enemyGrid = this.createEmptyGrid();
    this.playerShips = [];
    this.enemyShips = [];

    // Phase & Game Config
    this.phase = 'deploy'; // 'deploy', 'battle', 'gameover'
    this.mode = 'advanced'; // 'classic', 'advanced', 'timed', 'survival'
    this.difficulty = 'medium';
    this.selectedShipToDeploy = null;
    this.deployOrientation = 'horizontal'; // or 'vertical'
    this.activeWeapon = 'cannon';

    // Ammo depot
    this.ammo = {
      cannon: Infinity,
      torpedo: 2,
      depth: 2,
      missile: 1,
      radar: 2
    };

    // Tracking for current battle report
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.weaponsUsedCount = { cannon: 0, torpedo: 0, depth: 0, missile: 0, radar: 0 };
    this.startTime = null;
    this.currentScore = 0;
    this.turnTimerInterval = null;
    this.turnSecondsRemaining = 15;

    this.initUI();
    this.applySettings();
    this.setupNewDeployment();
  }

  createEmptyGrid() {
    const grid = [];
    for (let r = 0; r < 10; r++) {
      const row = [];
      for (let c = 0; c < 10; c++) {
        row.push({
          r,
          c,
          hasShip: false,
          shipId: null,
          attacked: false,
          sunk: false,
          scanned: false
        });
      }
      grid.push(row);
    }
    return grid;
  }

  initUI() {
    this.buildGridDOM('player-grid', (r, c) => this.onPlayerCellClick(r, c));
    this.buildGridDOM('enemy-grid', (r, c) => this.onEnemyCellClick(r, c));
    this.bindEvents();
    this.renderArsenal();
  }

  buildGridDOM(elementId, clickCallback) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.addEventListener('click', () => clickCallback(r, c));
        cell.addEventListener('mouseenter', () => this.onCellHover(elementId, r, c));
        cell.addEventListener('mouseleave', () => this.clearCellHover());
        container.appendChild(cell);
      }
    }
  }

  bindEvents() {
    // Header controls
    document.getElementById('btn-new-game').onclick = () => openModal('modal-new-game');
    document.getElementById('btn-stats').onclick = () => {
      this.updateStatsModal();
      openModal('modal-stats');
    };
    document.getElementById('btn-achievements').onclick = () => {
      this.renderAchievementsModal();
      openModal('modal-achievements');
    };
    document.getElementById('btn-leaderboard').onclick = () => {
      this.renderLeaderboardModal();
      openModal('modal-leaderboard');
    };
    document.getElementById('btn-settings').onclick = () => openModal('modal-settings');
    document.getElementById('btn-audio-toggle').onclick = (e) => {
      const muted = this.sound.toggleMute();
      e.target.innerText = muted ? '🔇 Muted' : '🔊 Audio';
    };

    // Close buttons for modals
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('active'));
      };
    });

    // Deployment controls
    document.getElementById('btn-rotate-ship').onclick = () => this.toggleRotation();
    document.getElementById('btn-auto-deploy').onclick = () => this.autoDeployPlayerFleet();
    document.getElementById('btn-reset-fleet').onclick = () => this.resetDeployment();
    document.getElementById('btn-start-battle').onclick = () => this.startBattlePhase();

    // Keydown for rotation (R)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        this.toggleRotation();
      }
    });

    // Settings actions
    document.getElementById('setting-theme').onchange = (e) => {
      this.setTheme(e.target.value);
    };
    document.getElementById('setting-volume').oninput = (e) => {
      this.sound.setVolume(e.target.value);
      this.archive.settings.volume = e.target.value;
      this.archive.saveAll();
    };
    document.getElementById('btn-test-sound').onclick = () => {
      this.sound.playCannon();
      setTimeout(() => this.sound.playExplosion(), 250);
    };

    // Weapon Deck
    document.querySelectorAll('.weapon-btn').forEach((btn) => {
      btn.onclick = () => {
        const weapon = btn.dataset.weapon;
        this.selectWeapon(weapon);
      };
    });

    // New Game Confirmation
    document.getElementById('btn-confirm-new-game').onclick = () => {
      this.mode = document.getElementById('config-game-mode').value;
      this.difficulty = document.getElementById('config-difficulty').value;
      this.ai = new NavalAI(this.difficulty);
      document.getElementById('hud-mode').innerText = `${this.mode.toUpperCase()} • ${this.difficulty.toUpperCase()}`;
      closeAllModals();
      this.setupNewDeployment();
      this.log(`Campaign initialized. Ruleset: ${this.mode.toUpperCase()}, Difficulty: ${this.difficulty.toUpperCase()}`, 'special');
    };

    // Battle Report Actions
    document.getElementById('btn-export-json').onclick = () => this.exportDebriefJSON();
    document.getElementById('btn-print-report').onclick = () => window.print();
    document.getElementById('btn-report-continue').onclick = () => {
      closeAllModals();
      this.setupNewDeployment();
    };

    // Reset stats
    document.getElementById('btn-reset-stats').onclick = () => {
      if (confirm('Are you sure you want to reset all intelligence statistics?')) {
        this.archive.resetStats();
        this.updateStatsModal();
      }
    };
  }

  applySettings() {
    this.setTheme(this.archive.settings.theme);
    document.getElementById('setting-theme').value = this.archive.settings.theme;
    document.getElementById('setting-commander-name').value = this.archive.settings.commanderName;
    document.getElementById('setting-enemy-name').value = this.archive.settings.enemyName;
    document.getElementById('setting-volume').value = this.archive.settings.volume;
    this.sound.setVolume(this.archive.settings.volume);
    this.updateHUDHeader();
  }

  setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    this.archive.settings.theme = themeName;
    this.archive.saveAll();
  }

  updateHUDHeader() {
    document.getElementById('hud-commander-name').innerText = this.archive.settings.commanderName;
    document.getElementById('enemy-panel-title').innerText = `🎯 ${this.archive.settings.enemyName}'s Waters`;
  }

  // ==========================================
  // 7. DEPLOYMENT PHASE LOGIC
  // ==========================================
  setupNewDeployment() {
    this.phase = 'deploy';
    this.playerGrid = this.createEmptyGrid();
    this.enemyGrid = this.createEmptyGrid();
    this.playerShips = [];
    this.enemyShips = [];
    this.selectedShipToDeploy = null;
    this.deployOrientation = 'horizontal';

    // Reset Ammo based on mode
    this.ammo = {
      cannon: Infinity,
      torpedo: this.mode === 'classic' ? 0 : 2,
      depth: this.mode === 'classic' ? 0 : 2,
      missile: this.mode === 'classic' ? 0 : 1,
      radar: this.mode === 'classic' ? 0 : 2
    };

    document.getElementById('dock-panel').style.display = 'block';
    document.getElementById('btn-start-battle').disabled = true;
    document.getElementById('hud-turn-status').innerText = 'Deploy Fleet';
    document.getElementById('ai-status-module').style.visibility = 'hidden';
    document.getElementById('timer-module').style.display = 'none';

    this.renderGrid('player-grid', this.playerGrid, true);
    this.renderGrid('enemy-grid', this.enemyGrid, false);
    this.renderShipDock();
    this.renderArsenal();
    this.updateHealthBars();
  }

  renderShipDock() {
    const tray = document.getElementById('ships-tray');
    tray.innerHTML = '';
    FLEET_DEFINITIONS.forEach((def) => {
      const isPlaced = this.playerShips.some((s) => s.id === def.id);
      const item = document.createElement('div');
      item.className = `ship-dock-item ${isPlaced ? 'placed' : ''} ${this.selectedShipToDeploy?.id === def.id ? 'selected' : ''}`;
      item.innerHTML = `
        <span>${def.icon} <b>${def.name}</b> (${def.length})</span>
        <div class="ship-segments">
          ${'<div class="segment-box"></div>'.repeat(def.length)}
        </div>
      `;
      if (!isPlaced) {
        item.onclick = () => {
          this.selectedShipToDeploy = def;
          this.renderShipDock();
        };
      }
      tray.appendChild(item);
    });

    // Auto-select first non-placed ship
    if (!this.selectedShipToDeploy || this.playerShips.some((s) => s.id === this.selectedShipToDeploy.id)) {
      this.selectedShipToDeploy = FLEET_DEFINITIONS.find((def) => !this.playerShips.some((s) => s.id === def.id)) || null;
    }
  }

  toggleRotation() {
    this.deployOrientation = this.deployOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    document.getElementById('rotation-status').innerText = `Axis: ${this.deployOrientation.toUpperCase()} (Press [R] to Rotate)`;
    this.sound.playRadarPing();
  }

  onPlayerCellClick(r, c) {
    if (this.phase !== 'deploy') return;
    if (!this.selectedShipToDeploy) return;

    const shipDef = this.selectedShipToDeploy;
    if (this.canPlaceShip(this.playerGrid, r, c, shipDef.length, this.deployOrientation)) {
      this.placeShip(this.playerGrid, this.playerShips, shipDef, r, c, this.deployOrientation);
      this.sound.playTorpedo();
      this.renderGrid('player-grid', this.playerGrid, true);
      this.renderShipDock();

      if (this.playerShips.length === FLEET_DEFINITIONS.length) {
        document.getElementById('btn-start-battle').disabled = false;
        showToast('All fleet units deployed! Press "Engage Battle" to launch attack.');
      }
    } else {
      this.sound.playSplash();
      showToast('⚠️ Invalid coordinate! Ship cannot overlap or breach naval boundaries.');
    }
  }

  canPlaceShip(grid, r, c, length, orientation) {
    if (orientation === 'horizontal') {
      if (c + length > 10) return false;
      for (let i = 0; i < length; i++) {
        if (grid[r][c + i].hasShip) return false;
      }
    } else {
      if (r + length > 10) return false;
      for (let i = 0; i < length; i++) {
        if (grid[r + i][c].hasShip) return false;
      }
    }
    return true;
  }

  placeShip(grid, shipsArray, shipDef, r, c, orientation) {
    const coords = [];
    for (let i = 0; i < lengthOrDef(shipDef); i++) {
      const cr = orientation === 'horizontal' ? r : r + i;
      const cc = orientation === 'horizontal' ? c + i : c;
      grid[cr][cc].hasShip = true;
      grid[cr][cc].shipId = shipDef.id;
      coords.push({ r: cr, c: cc });
    }
    shipsArray.push({
      id: shipDef.id,
      name: shipDef.name,
      length: lengthOrDef(shipDef),
      orientation,
      coords,
      hits: 0,
      sunk: false
    });
  }

  autoDeployPlayerFleet() {
    this.resetDeployment();
    FLEET_DEFINITIONS.forEach((def) => {
      this.deployRandomly(this.playerGrid, this.playerShips, def);
    });
    this.renderGrid('player-grid', this.playerGrid, true);
    this.renderShipDock();
    document.getElementById('btn-start-battle').disabled = false;
    this.sound.playTorpedo();
  }

  resetDeployment() {
    this.playerGrid = this.createEmptyGrid();
    this.playerShips = [];
    this.selectedShipToDeploy = FLEET_DEFINITIONS[0];
    document.getElementById('btn-start-battle').disabled = true;
    this.renderGrid('player-grid', this.playerGrid, true);
    this.renderShipDock();
  }

  deployRandomly(grid, shipsArray, shipDef) {
    let placed = false;
    while (!placed) {
      const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
      const r = Math.floor(Math.random() * 10);
      const c = Math.floor(Math.random() * 10);
      if (this.canPlaceShip(grid, r, c, shipDef.length, orientation)) {
        this.placeShip(grid, shipsArray, shipDef, r, c, orientation);
        placed = true;
      }
    }
  }

  // ==========================================
  // 8. BATTLE PHASE & ARSENAL COMBAT
  // ==========================================
  startBattlePhase() {
    this.phase = 'battle';
    document.getElementById('dock-panel').style.display = 'none';
    document.getElementById('hud-turn-status').innerText = 'Allied Commander Turn';

    // Auto-deploy Enemy Fleet
    this.enemyGrid = this.createEmptyGrid();
    this.enemyShips = [];
    FLEET_DEFINITIONS.forEach((def) => {
      this.deployRandomly(this.enemyGrid, this.enemyShips, def);
    });
    this.renderGrid('enemy-grid', this.enemyGrid, false);

    this.shotsFired = 0;
    this.shotsHit = 0;
    this.weaponsUsedCount = { cannon: 0, torpedo: 0, depth: 0, missile: 0, radar: 0 };
    this.startTime = Date.now();
    this.currentScore = 0;

    this.sound.playRadarPing();
    this.log('Warfare initiated! Select a weapon and click coordinates in Hostile Waters.', 'special');

    if (this.mode === 'timed') {
      document.getElementById('timer-module').style.display = 'flex';
      this.startTurnClock();
    }
  }

  selectWeapon(weaponType) {
    if (this.phase !== 'battle') return;
    if (this.ammo[weaponType] <= 0) {
      showToast('⚠️ No ammunition left for this armament!');
      return;
    }
    this.activeWeapon = weaponType;
    document.querySelectorAll('.weapon-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.weapon === weaponType);
    });
    this.sound.playRadarPing();
  }

  renderArsenal() {
    document.getElementById('ammo-torpedo').innerText = `Ammo: ${this.ammo.torpedo}`;
    document.getElementById('ammo-depth').innerText = `Ammo: ${this.ammo.depth}`;
    document.getElementById('ammo-missile').innerText = `Ammo: ${this.ammo.missile}`;
    document.getElementById('ammo-radar').innerText = `Ammo: ${this.ammo.radar}`;

    document.querySelectorAll('.weapon-btn').forEach((btn) => {
      const w = btn.dataset.weapon;
      if (w !== 'cannon' && this.ammo[w] <= 0) {
        btn.disabled = true;
      } else {
        btn.disabled = false;
      }
    });
  }

  onEnemyCellClick(r, c) {
    if (this.phase !== 'battle') return;
    if (this.enemyGrid[r][c].attacked && this.activeWeapon === 'cannon') {
      showToast('Sector already bombarded! Target unattacked coordinates.');
      return;
    }

    this.executePlayerAttack(r, c);
  }

  executePlayerAttack(r, c) {
    if (this.turnTimerInterval) clearInterval(this.turnTimerInterval);

    // Consume Ammo
    if (this.activeWeapon !== 'cannon') {
      this.ammo[this.activeWeapon]--;
      this.renderArsenal();
    }
    this.weaponsUsedCount[this.activeWeapon]++;

    // Execute pattern based on weapon
    if (this.activeWeapon === 'cannon') {
      this.sound.playCannon();
      this.resolveSingleTarget(this.enemyGrid, this.enemyShips, r, c, 'Allied Fleet');
    } else if (this.activeWeapon === 'torpedo') {
      this.sound.playTorpedo();
      let hitCount = 0;
      for (let col = 0; col < 10; col++) {
        if (!this.enemyGrid[r][col].attacked) {
          const hit = this.resolveSingleTarget(this.enemyGrid, this.enemyShips, r, col, 'Allied Fleet', true);
          if (hit) hitCount++;
        }
      }
      if (hitCount >= 2) this.archive.unlockAchievement('torpedoAce');
    } else if (this.activeWeapon === 'depth-charge') {
      this.sound.playExplosion();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10 && !this.enemyGrid[nr][nc].attacked) {
            this.resolveSingleTarget(this.enemyGrid, this.enemyShips, nr, nc, 'Allied Fleet', true);
          }
        }
      }
    } else if (this.activeWeapon === 'missile') {
      this.sound.playMissile();
      const cross = [{ r, c }, { r: r - 1, c }, { r: r + 1, c }, { r, c: c - 1 }, { r, c: c + 1 }];
      cross.forEach((pos) => {
        if (pos.r >= 0 && pos.r < 10 && pos.c >= 0 && pos.c < 10 && !this.enemyGrid[pos.r][pos.c].attacked) {
          this.resolveSingleTarget(this.enemyGrid, this.enemyShips, pos.r, pos.c, 'Allied Fleet', true);
        }
      });
    } else if (this.activeWeapon === 'radar') {
      this.sound.playRadarPing();
      this.executeRadarScan(this.enemyGrid, r, c);
      this.log(`Radar scan deployed at [${toCoords(r, c)}].`, 'special');
      this.checkBattleStatus();
      if (this.phase === 'battle') this.triggerAITurn();
      return;
    }

    // Default back to cannon if special weapon ran out
    if (this.activeWeapon !== 'cannon' && this.ammo[this.activeWeapon] <= 0) {
      this.selectWeapon('cannon');
    }

    this.renderGrid('enemy-grid', this.enemyGrid, false);
    this.updateHealthBars();
    this.checkBattleStatus();

    if (this.phase === 'battle') {
      this.triggerAITurn();
    }
  }

  resolveSingleTarget(grid, ships, r, c, attackerName, isAoE = false) {
    const cell = grid[r][c];
    if (cell.attacked) return false;

    cell.attacked = true;
    this.shotsFired++;

    const rect = this.getCellCoordinatesDOM(grid === this.playerGrid ? 'player-grid' : 'enemy-grid', r, c);

    if (cell.hasShip) {
      cell.hit = true;
      this.shotsHit++;
      this.currentScore += 100 * this.getScoreMultiplier();
      document.getElementById('hud-score').innerText = this.currentScore;

      this.fx.createExplosion(rect.x, rect.y, '#ef4444');
      this.sound.playExplosion();

      const ship = ships.find((s) => s.id === cell.shipId);
      if (ship) {
        ship.hits++;
        if (ship.hits >= ship.length) {
          ship.sunk = true;
          this.markShipAsSunk(grid, ship);
          this.sound.playSinking();
          this.currentScore += 500 * this.getScoreMultiplier();
          document.getElementById('hud-score').innerText = this.currentScore;
          this.log(`🔥 ${attackerName} DESTROYED the hostile ${ship.name}!`, 'player-hit');
          showToast(`Direct Sunk! Enemy ${ship.name} eliminated!`);
        } else {
          this.log(`💥 ${attackerName} scored a direct strike at [${toCoords(r, c)}]!`, 'player-hit');
        }
      }
      return true;
    } else {
      this.fx.createSplash(rect.x, rect.y);
      this.sound.playSplash();
      this.log(`🌊 ${attackerName} fired into empty water at [${toCoords(r, c)}].`, 'player-miss');
      return false;
    }
  }

  executeRadarScan(grid, r, c) {
    let shipDetected = false;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
          grid[nr][nc].scanned = true;
          if (grid[nr][nc].hasShip) shipDetected = true;
        }
      }
    }
    this.renderGrid('enemy-grid', this.enemyGrid, false);
    if (shipDetected) {
      showToast('📡 RADAR CONFIRMED: Hostile hull detected in scanned quadrant!');
      this.log('Radar Ping: Positive thermal contact confirmed.', 'special');
    } else {
      showToast('📡 RADAR SCAN: No enemy vessels in 3x3 radius.');
      this.log('Radar Ping: Sector clear of thermal signatures.', 'special');
    }
  }

  markShipAsSunk(grid, ship) {
    ship.coords.forEach((pos) => {
      grid[pos.r][pos.c].sunk = true;
    });
  }

  triggerAITurn() {
    this.phase = 'ai-turn';
    document.getElementById('hud-turn-status').innerText = 'Enemy Inbound Attack';
    document.getElementById('ai-status-module').style.visibility = 'visible';

    // AI "thinking" delay
    const delay = Math.random() * 600 + 400;
    setTimeout(() => {
      this.executeAIMove();
      document.getElementById('ai-status-module').style.visibility = 'hidden';
      this.checkBattleStatus();

      if (this.phase !== 'gameover') {
        this.phase = 'battle';
        document.getElementById('hud-turn-status').innerText = 'Allied Commander Turn';
        if (this.mode === 'timed') {
          this.startTurnClock();
        }
      }
    }, delay);
  }

  executeAIMove() {
    // Collect un-sunk player ship lengths for probability density
    const unSunkLengths = this.playerShips.filter((s) => !s.sunk).map((s) => s.length);
    const move = this.ai.calculateNextMove(this.playerGrid, unSunkLengths);
    const cell = this.playerGrid[move.r][move.c];

    cell.attacked = true;
    const rect = this.getCellCoordinatesDOM('player-grid', move.r, move.c);

    if (cell.hasShip) {
      cell.hit = true;
      this.fx.createExplosion(rect.x, rect.y, '#ef4444');
      this.sound.playExplosion();

      const ship = this.playerShips.find((s) => s.id === cell.shipId);
      if (ship) {
        ship.hits++;
        if (ship.hits >= ship.length) {
          ship.sunk = true;
          this.markShipAsSunk(this.playerGrid, ship);
          this.ai.registerAttackResult(move.r, move.c, true, true, this.playerGrid);
          this.sound.playSinking();
          this.log(`⚠️ ALERT: Allied ${ship.name} was SUNK by hostile bombardment!`, 'ai-hit');
          showToast(`Emergency! Your ${ship.name} has been destroyed!`);
        } else {
          this.ai.registerAttackResult(move.r, move.c, true, false, this.playerGrid);
          this.log(`⚠️ Hostile fire struck Allied ship at [${toCoords(move.r, move.c)}]!`, 'ai-hit');
        }
      }
    } else {
      this.ai.registerAttackResult(move.r, move.c, false, false, this.playerGrid);
      this.fx.createSplash(rect.x, rect.y);
      this.sound.playSplash();
      this.log(`Hostile shell splashed into water at [${toCoords(move.r, move.c)}].`, 'ai-miss');
    }

    this.renderGrid('player-grid', this.playerGrid, true);
    this.updateHealthBars();
  }

  startTurnClock() {
    if (this.turnTimerInterval) clearInterval(this.turnTimerInterval);
    this.turnSecondsRemaining = 15;
    document.getElementById('hud-turn-timer').innerText = `${this.turnSecondsRemaining}s`;

    this.turnTimerInterval = setInterval(() => {
      this.turnSecondsRemaining--;
      document.getElementById('hud-turn-timer').innerText = `${this.turnSecondsRemaining}s`;
      if (this.turnSecondsRemaining <= 0) {
        clearInterval(this.turnTimerInterval);
        showToast('⏰ Time expired! Turn forfeited to enemy fleet.');
        this.log('Turn clock ran out! Enemy forces seize initiative.', 'special');
        this.triggerAITurn();
      }
    }, 1000);
  }

  // ==========================================
  // 9. VICTORY, DEFEAT & DEBRIEF REPORTS
  // ==========================================
  checkBattleStatus() {
    const enemyAllSunk = this.enemyShips.every((s) => s.sunk);
    const playerAllSunk = this.playerShips.every((s) => s.sunk);

    if (enemyAllSunk) {
      this.handleGameOver(true);
    } else if (playerAllSunk) {
      this.handleGameOver(false);
    }
  }

  handleGameOver(playerWon) {
    this.phase = 'gameover';
    if (this.turnTimerInterval) clearInterval(this.turnTimerInterval);

    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const durationStr = `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;

    if (playerWon) {
      this.currentScore += 3000 * this.getScoreMultiplier();
      this.sound.playVictory();
      this.fx.createFireworks();
      showToast('🎉 NAVAL VICTORY! All hostile combatants eliminated!');
      this.log('COMMAND OVERVIEW: DECISIVE ALLIED VICTORY.', 'special');
    } else {
      this.sound.playDefeat();
      showToast('💀 DEFEAT: Allied fleet destroyed in naval combat.');
      this.log('COMMAND OVERVIEW: FLEET WIPED OUT IN ENGAGEMENT.', 'ai-hit');
    }

    document.getElementById('hud-score').innerText = this.currentScore;

    // Record stats
    this.archive.recordMatch(
      playerWon,
      this.mode,
      this.difficulty,
      this.shotsFired,
      this.shotsHit,
      playerWon ? 6 : this.enemyShips.filter((s) => s.sunk).length,
      this.weaponsUsedCount,
      durationStr,
      this.currentScore
    );

    // Show debrief modal after short delay
    setTimeout(() => {
      this.showBattleReport(playerWon, durationStr);
    }, 1500);
  }

  showBattleReport(won, durationStr) {
    const modal = document.getElementById('modal-battle-report');
    const title = document.getElementById('report-title');
    const content = document.getElementById('report-content');

    title.innerText = won ? '🏆 Decisive Tactical Victory' : '💀 Naval Defeat Debrief';
    title.style.color = won ? '#22c55e' : '#ef4444';

    const accuracy = this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 0;
    
    // Find MVP Weapon
    let mvpWeapon = 'Standard Cannon';
    let maxUsage = -1;
    for (let w in this.weaponsUsedCount) {
      if (this.weaponsUsedCount[w] > maxUsage) {
        maxUsage = this.weaponsUsedCount[w];
        mvpWeapon = w.toUpperCase();
      }
    }

    content.innerHTML = `
      <div style="border-bottom: 1px solid var(--border-tactical); padding-bottom: 12px; margin-bottom: 12px;">
        <div><b>Commander:</b> ${this.archive.settings.commanderName}</div>
        <div><b>Opponent:</b> ${this.archive.settings.enemyName} (${this.difficulty.toUpperCase()} AI)</div>
        <div><b>Sortie Duration:</b> ${durationStr}</div>
        <div><b>Warfare Protocol:</b> ${this.mode.toUpperCase()}</div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        <div>🎯 Shots Fired: <b>${this.shotsFired}</b></div>
        <div>💥 Target Hits: <b>${this.shotsHit}</b></div>
        <div>📊 Accuracy: <b>${accuracy}%</b></div>
        <div>🚢 Ships Sunk: <b>${this.enemyShips.filter((s) => s.sunk).length} / 6</b></div>
        <div>🎖️ Final Score: <b>${this.currentScore}</b></div>
        <div>⚔️ MVP Armament: <b>${mvpWeapon}</b></div>
      </div>
    `;

    openModal('modal-battle-report');
  }

  exportDebriefJSON() {
    const reportData = {
      commander: this.archive.settings.commanderName,
      enemy: this.archive.settings.enemyName,
      date: new Date().toISOString(),
      score: this.currentScore,
      shotsFired: this.shotsFired,
      shotsHit: this.shotsHit,
      accuracy: `${this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 0}%`,
      weaponsUsed: this.weaponsUsedCount
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Battleship_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getScoreMultiplier() {
    if (this.difficulty === 'hard') return 2.0;
    if (this.difficulty === 'medium') return 1.5;
    return 1.0;
  }

  // ==========================================
  // 10. RENDERING & STATS CHARTS
  // ==========================================
  renderGrid(elementId, gridData, showShips = false) {
    const container = document.getElementById(elementId);
    const cells = container.children;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const idx = r * 10 + c;
        const cellDOM = cells[idx];
        const cell = gridData[r][c];

        cellDOM.className = 'cell';

        if (cell.attacked) {
          if (cell.hit) {
            cellDOM.classList.add(cell.sunk ? 'sunk' : 'hit');
          } else {
            cellDOM.classList.add('miss');
          }
        } else if (showShips && cell.hasShip) {
          cellDOM.classList.add('ship-present');
        } else if (cell.scanned) {
          cellDOM.classList.add('scanned');
        }
      }
    }
  }

  updateHealthBars() {
    const calcHealth = (ships) => {
      const totalLen = ships.reduce((acc, s) => acc + s.length, 0);
      const hits = ships.reduce((acc, s) => acc + s.hits, 0);
      if (totalLen === 0) return 100;
      return Math.max(0, Math.round(((totalLen - hits) / totalLen) * 100));
    };

    const playerHealth = calcHealth(this.playerShips);
    const enemyHealth = calcHealth(this.enemyShips);

    document.getElementById('player-health-fill').style.width = `${playerHealth}%`;
    document.getElementById('enemy-health-fill').style.width = `${enemyHealth}%`;
  }

  getCellCoordinatesDOM(elementId, r, c) {
    const container = document.getElementById(elementId);
    const cellDOM = container.children[r * 10 + c];
    const rect = cellDOM.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  onCellHover(elementId, r, c) {
    if (elementId === 'player-grid' && this.phase === 'deploy' && this.selectedShipToDeploy) {
      const len = this.selectedShipToDeploy.length;
      const valid = this.canPlaceShip(this.playerGrid, r, c, len, this.deployOrientation);
      const container = document.getElementById(elementId);

      for (let i = 0; i < len; i++) {
        const cr = this.deployOrientation === 'horizontal' ? r : r + i;
        const cc = this.deployOrientation === 'horizontal' ? c + i : c;
        if (cr < 10 && cc < 10) {
          const domIdx = cr * 10 + cc;
          container.children[domIdx].style.backgroundColor = valid ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.4)';
        }
      }
    }
  }

  clearCellHover() {
    const container = document.getElementById('player-grid');
    for (let i = 0; i < container.children.length; i++) {
      container.children[i].style.backgroundColor = '';
    }
  }

  log(msg, type = 'player-miss') {
    const logBox = document.getElementById('tactical-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString().split(' ')[0];
    entry.innerText = `[${timestamp}] ${msg}`;
    logBox.prepend(entry);
  }

  updateStatsModal() {
    const s = this.archive.stats;
    document.getElementById('stat-played').innerText = s.played;
    document.getElementById('stat-won').innerText = s.won;
    const winRate = s.played > 0 ? Math.round((s.won / s.played) * 100) : 0;
    document.getElementById('stat-win-rate').innerText = `${winRate}%`;
    const acc = s.shotsFired > 0 ? Math.round((s.hits / s.shotsFired) * 100) : 0;
    document.getElementById('stat-accuracy').innerText = `${acc}%`;

    // Weapon breakdown
    const wb = document.getElementById('stats-weapon-breakdown');
    wb.innerHTML = `
      <div>Standard Cannon: ${s.weaponsUsed.cannon} fired</div>
      <div>Torpedo Salvo: ${s.weaponsUsed.torpedo} fired</div>
      <div>Depth Charges: ${s.weaponsUsed.depth} deployed</div>
      <div>Cruise Missiles: ${s.weaponsUsed.missile} launched</div>
      <div>Radar Scans: ${s.weaponsUsed.radar} pinged</div>
    `;

    // AI record breakdown
    const ab = document.getElementById('stats-ai-breakdown');
    ab.innerHTML = `
      <div>vs Cadet (Easy): ${s.aiRecord.easy.won}W - ${s.aiRecord.easy.lost}L</div>
      <div>vs Commander (Medium): ${s.aiRecord.medium.won}W - ${s.aiRecord.medium.lost}L</div>
      <div>vs Admiral (Hard): ${s.aiRecord.hard.won}W - ${s.aiRecord.hard.lost}L</div>
    `;

    this.renderCanvasHistogram();
  }

  renderCanvasHistogram() {
    const canvas = document.getElementById('stats-chart');
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const s = this.archive.stats;
    const data = [
      { label: 'Sorties', val: s.played, color: '#38bdf8' },
      { label: 'Won', val: s.won, color: '#22c55e' },
      { label: 'Lost', val: s.lost, color: '#ef4444' },
      { label: 'Sunk', val: s.shipsDestroyed, color: '#f59e0b' }
    ];

    const maxVal = Math.max(...data.map((d) => d.val), 5);
    const barWidth = 45;
    const spacing = 25;
    const startX = 35;

    data.forEach((item, idx) => {
      const barH = (item.val / maxVal) * (h - 45);
      const x = startX + idx * (barWidth + spacing);
      const y = h - barH - 25;

      ctx.fillStyle = item.color;
      ctx.fillRect(x, y, barWidth, barH);

      ctx.fillStyle = '#fff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(item.val, x + barWidth / 2, y - 5);
      ctx.fillText(item.label, x + barWidth / 2, h - 8);
    });
  }

  renderAchievementsModal() {
    const container = document.getElementById('achievements-container');
    container.innerHTML = '';
    const medals = this.archive.achievements;
    for (let key in medals) {
      const m = medals[key];
      const div = document.createElement('div');
      div.className = 'dock-wrapper';
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.gap = '12px';
      div.style.opacity = m.unlocked ? '1' : '0.4';
      div.innerHTML = `
        <div style="font-size: 2rem;">${m.unlocked ? '🎖️' : '🔒'}</div>
        <div>
          <div style="font-weight: 700; color: ${m.unlocked ? 'var(--accent-cyan)' : 'var(--text-muted)'}; font-family: var(--font-mono);">
            ${m.title} ${m.unlocked ? '(UNLOCKED)' : '(LOCKED)'}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${m.desc}</div>
        </div>
      `;
      container.appendChild(div);
    }
  }

  renderLeaderboardModal() {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    this.archive.leaderboard.forEach((entry, idx) => {
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      row.innerHTML = `
        <td style="padding: 8px;">#${idx + 1}</td>
        <td style="padding: 8px; font-weight: 700;">${entry.commander}</td>
        <td style="padding: 8px; color: var(--accent-cyan);">${entry.score}</td>
        <td style="padding: 8px;">${entry.accuracy}</td>
        <td style="padding: 8px;">${entry.duration}</td>
      `;
      tbody.appendChild(row);
    });
  }
}

// ==========================================
// 11. UTILITY FUNCTIONS & PWA REGISTRATION
// ==========================================
function lengthOrDef(shipDef) {
  return typeof shipDef.length === 'number' ? shipDef.length : shipDef;
}

function toCoords(r, c) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  return `${letters[c]}${r + 1}`;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('active'));
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Register PWA Service Worker for full offline capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((reg) => console.log('Service Worker Registered Successfully:', reg.scope))
      .catch((err) => console.warn('Service Worker registration skipped:', err));
  });
}

// Bootstrap Game Instance
window.addEventListener('DOMContentLoaded', () => {
  window.battleshipGameInstance = new BattleshipGame();
});
