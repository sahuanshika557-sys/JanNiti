/**
 * JanNiti AI Cinematic Film Engine (Director & Shot Controller)
 * 60 FPS Full-Viewport Canvas Cinema — Zero Slide Cards, Continuous Camera Movement,
 * Multi-layer Parallax Environments, Living Skeletal Character Rigging, and Match-Cut Visual Storytelling.
 */

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  targetX?: number;
  targetY?: number;
}

export interface RainDrop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export class CinematicFilmEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private time: number = 0;

  public camera: CameraState = {
    x: 600,
    y: 350,
    zoom: 1,
    targetX: 600,
    targetY: 350,
    targetZoom: 1
  };

  public currentAct: number = 1;
  public actProgress: number = 0; // 0 to 1
  public selectedSimVersion: 'A' | 'B' | 'C' = 'C';

  private particles: Particle[] = [];
  private rainDrops: RainDrop[] = [];
  private clusterParticles: Particle[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D rendering context');
    this.ctx = context;
    this.initRain();
    this.initClusterParticles();
  }

  public resize(width: number, height: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(dpr, dpr);
  }

  private initRain() {
    this.rainDrops = [];
    for (let i = 0; i < 240; i++) {
      this.rainDrops.push({
        x: Math.random() * 1400,
        y: Math.random() * 900,
        speed: 16 + Math.random() * 14,
        length: 20 + Math.random() * 25,
        opacity: 0.35 + Math.random() * 0.55
      });
    }
  }

  private initClusterParticles() {
    this.clusterParticles = [];
    const colors = ['#38bdf8', '#818cf8', '#fbbf24', '#34d399', '#f43f5e', '#a855f7', '#22d3ee', '#f97316'];
    for (let i = 0; i < 127; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 250 + Math.random() * 300;
      this.clusterParticles.push({
        x: 600 + Math.cos(angle) * radius,
        y: 350 + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        color: colors[i % colors.length],
        size: 3.5 + Math.random() * 3.5,
        life: 1,
        maxLife: 1,
        targetX: 600 + (Math.random() - 0.5) * 45,
        targetY: 350 + (Math.random() - 0.5) * 45
      });
    }
  }

  public start() {
    if (this.animFrameId) return;
    const loop = () => {
      this.update();
      this.render();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public setActState(act: number, progress: number) {
    this.currentAct = act;
    this.actProgress = progress;
    this.updateCameraDirector(act, progress);
  }

  public setSimulationOption(opt: 'A' | 'B' | 'C') {
    this.selectedSimVersion = opt;
  }

  private updateCameraDirector(act: number, p: number) {
    switch (act) {
      case 1: // Act 1: Phone Notification in Dark Void (Dolly In)
        this.camera.targetX = 600;
        this.camera.targetY = 350;
        this.camera.targetZoom = 1.3 + p * 0.5;
        break;
      case 2: // Act 2: Wide Shot of Living Village (Pull back, track character)
        this.camera.targetX = 480 + p * 120;
        this.camera.targetY = 330;
        this.camera.targetZoom = 1.2;
        break;
      case 3: // Act 3: POV of Damaged Road & Rain accumulation (Dolly close to road)
        this.camera.targetX = 540;
        this.camera.targetY = 370;
        this.camera.targetZoom = 1.35;
        break;
      case 4: // Act 4: Voice Ribbon Physical Ejection & Street Flight (Tracking shot)
        this.camera.targetX = 520 + p * 320;
        this.camera.targetY = 310 - p * 40;
        this.camera.targetZoom = 1.15;
        break;
      case 5: // Act 5: Passing Other Citizens (Wide tracking shot)
        this.camera.targetX = 600;
        this.camera.targetY = 320;
        this.camera.targetZoom = 0.95;
        break;
      case 6: // Act 6: Ascent to India Constellation (Aerial flight)
        this.camera.targetX = 600;
        this.camera.targetY = 350;
        this.camera.targetZoom = 0.78 + (1 - p) * 0.22;
        break;
      case 7: // Act 7: 127 Particle Fusion into Cluster (Orbital push)
        this.camera.targetX = 600;
        this.camera.targetY = 350;
        this.camera.targetZoom = 1.05 + p * 0.3;
        break;
      case 8: // Act 8: Plunge inside Data Intelligence Space (3D dive)
        this.camera.targetX = 600 + Math.sin(p * Math.PI * 2) * 40;
        this.camera.targetY = 340 + Math.cos(p * Math.PI * 2) * 25;
        this.camera.targetZoom = 1.4;
        break;
      case 9: // Act 9: Multilingual Harmony Streams
        this.camera.targetX = 600;
        this.camera.targetY = 330;
        this.camera.targetZoom = 1.15;
        break;
      case 10: // Act 10: Layered Geographic Intelligence & Hotspot Surge
        this.camera.targetX = 590 + p * 20;
        this.camera.targetY = 335;
        this.camera.targetZoom = 1.1 + p * 0.15;
        break;
      case 11: // Act 11: Hidden India / Equity Subterranean Sonar Scan (Sub-surface dive)
        this.camera.targetX = 640;
        this.camera.targetY = 380;
        this.camera.targetZoom = 1.45;
        break;
      case 12: // Act 12: Policymaker Office Workspace & Human Approval
        this.camera.targetX = 600;
        this.camera.targetY = 330;
        this.camera.targetZoom = 1.18;
        break;
      case 13: // Act 13: Miniature What-If Simulation World
        this.camera.targetX = 600 + (this.selectedSimVersion === 'A' ? -70 : 70);
        this.camera.targetY = 310;
        this.camera.targetZoom = 1.15;
        break;
      case 14: // Act 14: Return to the Exact Same Citizen on Dry Rebuilt Road
        this.camera.targetX = 460 - p * 40;
        this.camera.targetY = 310;
        this.camera.targetZoom = 1.25;
        break;
      case 15: // Act 15: Closed Loop & Infinite India Constellation (Final Reveal)
      default:
        this.camera.targetX = 600;
        this.camera.targetY = 350;
        this.camera.targetZoom = 0.85 + (1 - p) * 0.15;
        break;
    }
  }

  private update() {
    this.time += 0.016;

    // Inertial Smooth Camera Damping
    this.camera.x += (this.camera.targetX - this.camera.x) * 0.085;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.085;
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * 0.085;

    // Rain Simulation
    if (this.currentAct >= 2 && this.currentAct <= 4) {
      for (const drop of this.rainDrops) {
        drop.y += drop.speed;
        drop.x -= 2.8;
        if (drop.y > 800) {
          drop.y = -30;
          drop.x = Math.random() * 1400;
        }
      }
    }

    // Cluster Particle Fusion
    if (this.currentAct === 7) {
      const clusterP = this.actProgress;
      for (const p of this.clusterParticles) {
        if (p.targetX !== undefined && p.targetY !== undefined) {
          p.x += (p.targetX - p.x) * (0.045 + clusterP * 0.085);
          p.y += (p.targetY - p.y) * (0.045 + clusterP * 0.085);
        }
      }
    }
  }

  private render() {
    const width = parseFloat(this.canvas.style.width) || 1200;
    const height = parseFloat(this.canvas.style.height) || 700;

    this.ctx.save();
    this.ctx.clearRect(0, 0, width, height);

    // Apply Cinematic Camera Matrix
    const cx = width / 2;
    const cy = height / 2;
    this.ctx.translate(cx, cy);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // Draw Continuous Film Narrative
    this.drawLivingFilmWorld(width, height);

    this.ctx.restore();
  }

  private drawLivingFilmWorld(width: number, height: number) {
    const t = this.time;
    const p = this.actProgress;
    const act = this.currentAct;

    // ==========================================
    // 🌟 SHOT 1: THE PHONE LIGHT IN DARKNESS
    // ==========================================
    if (act === 1) {
      this.ctx.fillStyle = '#020617';
      this.ctx.fillRect(0, 0, 1200, 700);

      // Warm radial glow expanding from phone screen
      const lightRadius = 18 + p * 95;
      const grad = this.ctx.createRadialGradient(600, 350, 0, 600, 350, lightRadius * 2.2);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.95)');
      grad.addColorStop(0.35, 'rgba(99, 102, 241, 0.45)');
      grad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(600, 350, lightRadius * 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      // Hand Holding Smartphone in 3D Space
      this.ctx.fillStyle = '#0f172a';
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 3.5;
      this.ctx.strokeRect(515, 230, 170, 240);
      this.ctx.fillRect(515, 230, 170, 240);

      // Notification Prompt
      this.ctx.fillStyle = '#94a3b8';
      this.ctx.font = 'bold 11px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('JanNiti AI • Citizen Voice', 600, 260);

      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = 'bold 12px Inter, sans-serif';
      this.ctx.fillText('Tell us what happened in your area', 600, 290);

      // Mic Button Pulsing
      const micPulse = Math.sin(t * 8) * 5;
      this.ctx.fillStyle = '#0284c7';
      this.ctx.beginPath();
      this.ctx.arc(600, 360, 30 + micPulse, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 20px Inter, sans-serif';
      this.ctx.fillText('🎙', 600, 368);

      // Golden light ribbon physically ejecting from phone
      if (p > 0.35) {
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 4;
        this.ctx.shadowColor = '#0284c7';
        this.ctx.shadowBlur = 16;
        this.ctx.beginPath();
        for (let x = 600; x <= 860; x += 10) {
          const waveY = 360 + Math.sin(t * 10 + x * 0.08) * (20 * (p - 0.35) * 2);
          if (x === 600) this.ctx.moveTo(x, waveY);
          else this.ctx.lineTo(x, waveY);
        }
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      }
      return;
    }

    // ==========================================
    // 🌟 FULLSCREEN 3-LAYER PARALLAX VILLAGE ENVIRONMENT (Acts 2 to 5, 13 to 15)
    // ==========================================
    if (act <= 5 || act >= 13) {
      // 1. SKY GRADIENT (Dawn -> Monsoon -> Bright Clear Sky)
      const skyGrad = this.ctx.createLinearGradient(0, 0, 0, 440);
      if (act >= 2 && act <= 4) {
        skyGrad.addColorStop(0, '#020617'); // Monsoon storm sky
        skyGrad.addColorStop(0.7, '#1e293b');
        skyGrad.addColorStop(1, '#334155');
      } else if (act >= 14) {
        skyGrad.addColorStop(0, '#0284c7'); // Clear bright sunny sky
        skyGrad.addColorStop(0.7, '#38bdf8');
        skyGrad.addColorStop(1, '#fef08a'); // Warm golden horizon
      } else {
        skyGrad.addColorStop(0, '#0f172a'); // Dawn twilight
        skyGrad.addColorStop(0.7, '#312e81');
        skyGrad.addColorStop(1, '#ea580c');
      }
      this.ctx.fillStyle = skyGrad;
      this.ctx.fillRect(0, 0, 1200, 440);

      // Parallax Distant Hills Layer
      this.ctx.fillStyle = '#0f172a';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 330);
      this.ctx.bezierCurveTo(200, 295, 400, 320, 600, 305);
      this.ctx.bezierCurveTo(800, 285, 1000, 325, 1200, 305);
      this.ctx.lineTo(1200, 520);
      this.ctx.lineTo(0, 520);
      this.ctx.fill();

      // Living Peepal Trees (Swaying in wind)
      this.drawSwayingTree(140, 320, t);
      this.drawSwayingTree(890, 315, t + 1);

      // Village Huts & Shops
      this.drawVillageHut(240, 330);
      this.drawVillageHut(790, 325);

      // Telegraph Poles with Sagging Electrical Lines
      this.drawTelegraphPole(360, 330);
      this.drawTelegraphPole(700, 325);

      // Full-Width Road Asphalt
      const roadGrad = this.ctx.createLinearGradient(0, 340, 0, 580);
      roadGrad.addColorStop(0, '#334155');
      roadGrad.addColorStop(1, '#0f172a');
      this.ctx.fillStyle = roadGrad;
      this.ctx.fillRect(0, 340, 1200, 240);

      // Road dividing stripes
      this.ctx.strokeStyle = '#94a3b8';
      this.ctx.setLineDash([22, 16]);
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 435);
      this.ctx.lineTo(1200, 435);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // ==========================================
    // 🌟 ACT 2, 3 & 4: PRIMARY CITIZEN, DAMAGED ROAD & VOICE TRAVEL
    // ==========================================
    if (act >= 2 && act <= 4) {
      // Severe Pothole with Accumulating Muddy Rainwater
      this.ctx.fillStyle = '#090d16';
      this.ctx.beginPath();
      this.ctx.ellipse(540, 405, 82, 32, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Expanding Water Ripple
      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.ellipse(540, 405, 70 + Math.sin(t * 3) * 8, 25 + Math.cos(t * 3) * 4, 0, 0, Math.PI * 2);
      this.ctx.stroke();

      // Passing Auto-Rickshaw Slowing Down & Splashing
      const vehicleX = 750 - Math.min(220, p * 300);
      this.drawAutoRickshaw(vehicleX, 410, t);

      // Primary Citizen (Ramesh in blue kurta) Walking & Gesturing
      const citizenX = 410 + (act === 2 ? p * 40 : 40);
      this.drawCitizenCharacter(citizenX, 385, t, true, false, act === 3);

      // Physical Flowing Voice Ribbon Traveling Through Street
      if (act >= 3) {
        this.drawVoiceWaveformStream(citizenX + 16, 350, t, act, p);
      }

      // Monsoon Rain Particles
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 1.5;
      for (const drop of this.rainDrops) {
        this.ctx.globalAlpha = drop.opacity;
        this.ctx.beginPath();
        this.ctx.moveTo(drop.x, drop.y);
        this.ctx.lineTo(drop.x - 4, drop.y + drop.length);
        this.ctx.stroke();
      }
      this.ctx.globalAlpha = 1.0;
    }

    // ==========================================
    // 🌟 ACT 5: MULTI-CITIZEN INTERTWINED VOICE TRAILS
    // ==========================================
    if (act === 5) {
      const citizens = [
        { x: 180, color: '#34d399', label: 'Farmer' },
        { x: 350, color: '#818cf8', label: 'Student' },
        { x: 520, color: '#fbbf24', label: 'Elderly' },
        { x: 690, color: '#f43f5e', label: 'Shopkeeper' },
        { x: 860, color: '#38bdf8', label: 'Worker' }
      ];

      for (let i = 0; i < citizens.length; i++) {
        const c = citizens[i];
        this.drawCitizenCharacter(c.x, 385, t + i, true);

        // Multi-colored Luminous Voice Ribbons Weaving Together into Sky
        this.ctx.strokeStyle = c.color;
        this.ctx.lineWidth = 3.5;
        this.ctx.shadowColor = c.color;
        this.ctx.shadowBlur = 12;
        this.ctx.beginPath();
        this.ctx.moveTo(c.x + 10, 350);
        this.ctx.bezierCurveTo(
          c.x + 40 + Math.sin(t * 3 + i) * 30,
          260 - i * 20,
          600 + Math.cos(t * 2 + i) * 60,
          170 - p * 40,
          600,
          70
        );
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
      }
    }

    // ==========================================
    // 🌟 ACT 6 & 7: INDIA MAP CONSTELLATION & 127 FUSION
    // ==========================================
    if (act === 6 || act === 7) {
      this.ctx.fillStyle = '#030712';
      this.ctx.fillRect(0, 0, 1200, 700);

      this.drawIndiaMapNetwork(600, 350, t, act === 7 ? 0.3 : 1.0);

      if (act === 7) {
        for (const pt of this.clusterParticles) {
          this.ctx.fillStyle = pt.color;
          this.ctx.beginPath();
          this.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Central Radiant Cluster Core
        const coreSize = 34 + p * 40;
        const radGrad = this.ctx.createRadialGradient(600, 350, 0, 600, 350, coreSize * 2);
        radGrad.addColorStop(0, '#ffffff');
        radGrad.addColorStop(0.3, '#38bdf8');
        radGrad.addColorStop(0.7, '#6366f1');
        radGrad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = radGrad;
        this.ctx.beginPath();
        this.ctx.arc(600, 350, coreSize * 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CLUSTER CL-1042: 127 VOICES FUSED', 600, 355);
      }
    }

    // ==========================================
    // 🌟 ACT 8 & 9: DEEP INSIDE AI INTELLIGENCE & MULTILINGUAL RESONANCE
    // ==========================================
    if (act === 8 || act === 9) {
      this.ctx.fillStyle = '#020617';
      this.ctx.fillRect(0, 0, 1200, 700);

      this.drawFloatingDataMatrix(600, 340, t, p, act);
    }

    // ==========================================
    // 🌟 ACT 10 & 11: LAYERED MAP & HIDDEN NEED SONAR SCAN
    // ==========================================
    if (act === 10 || act === 11) {
      this.ctx.fillStyle = '#050b14';
      this.ctx.fillRect(0, 0, 1200, 700);

      this.drawLayeredMapStack(600, 340, t, p, act);

      if (act === 11) {
        // Subterranean Sonar Beam scanning silent 50,000 citizens
        const sonarPulse = (t * 2) % 4;
        this.ctx.strokeStyle = `rgba(251, 191, 36, ${Math.max(0, 1 - sonarPulse / 4)})`;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(640, 370, sonarPulse * 65, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = 'bold 12px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⚡ 50,000 POPULATION • LOW DIGITAL PARTICIPATION IDENTIFIED', 640, 435);
      }
    }

    // ==========================================
    // 🌟 ACT 12: POLICYMAKER WORKSPACE & HUMAN SANCTION
    // ==========================================
    if (act === 12) {
      this.ctx.fillStyle = '#090d16';
      this.ctx.fillRect(0, 0, 1200, 700);

      this.drawPolicymakerInterface(600, 330, t, p);
    }

    // ==========================================
    // 🌟 ACT 13: MINIATURE WHAT-IF SIMULATION WORLD
    // ==========================================
    if (act === 13) {
      this.ctx.fillStyle = '#030712';
      this.ctx.fillRect(0, 0, 1200, 700);

      this.drawWhatIfSimulationDualRoad(600, 320, t, p);
    }

    // ==========================================
    // 🌟 ACT 14: RETURN TO EXACT SAME CITIZEN ON DRY REBUILT ROAD
    // ==========================================
    if (act === 14) {
      // Reconstructed Asphalt
      this.ctx.fillStyle = '#10b981';
      this.ctx.beginPath();
      this.ctx.arc(540, 405, 8, 0, Math.PI * 2);
      this.ctx.fill();

      // Original Smiling Citizen Walking Smoothly
      const citizenX = 410 + p * 80;
      this.drawCitizenCharacter(citizenX, 385, t, false, true);

      // Smiling Green Feedback Aura Trail
      this.ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
      this.ctx.lineWidth = 3.5;
      this.ctx.beginPath();
      this.ctx.arc(citizenX + 16, 350, 16 + Math.sin(t * 4) * 4, 0, Math.PI * 2);
      this.ctx.stroke();
    }

    // ==========================================
    // 🌟 ACT 15: FINAL CLOSED FEEDBACK LOOP & NATIONWIDE NETWORK
    // ==========================================
    if (act === 15) {
      this.ctx.fillStyle = '#020617';
      this.ctx.fillRect(0, 0, 1200, 700);

      this.drawIndiaMapNetwork(600, 350, t, 1.0);
      this.drawClosedFeedbackLoop(600, 350, t, p);
    }

    // ==========================================
    // 🌟 FOREGROUND SILHOUETTE (Cinematic Parallax)
    // ==========================================
    if (act <= 5 || act >= 13) {
      this.drawForegroundFoliage(0, 0, t);
    }
  }

  // --- SUB-RENDERERS ---

  private drawForegroundFoliage(x: number, y: number, time: number) {
    const sway = Math.sin(time * 1.5) * 8;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(80 + sway, 40, 160 + sway, 80, 240 + sway, 60);
    this.ctx.bezierCurveTo(180 + sway, 120, 100 + sway, 140, 0, 160);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawSwayingTree(x: number, y: number, time: number) {
    const sway = Math.sin(time * 2) * 6;
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(x - 4, y - 50, 8, 50);

    this.ctx.fillStyle = '#065f46';
    this.ctx.beginPath();
    this.ctx.arc(x + sway, y - 65, 32, 0, Math.PI * 2);
    this.ctx.arc(x - 20 + sway * 0.8, y - 55, 24, 0, Math.PI * 2);
    this.ctx.arc(x + 20 + sway * 1.2, y - 55, 24, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawVillageHut(x: number, y: number) {
    this.ctx.fillStyle = '#78350f';
    this.ctx.fillRect(x, y - 35, 60, 35);

    this.ctx.fillStyle = '#b45309';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 10, y - 35);
    this.ctx.lineTo(x + 30, y - 60);
    this.ctx.lineTo(x + 70, y - 35);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawTelegraphPole(x: number, y: number) {
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y - 90);
    this.ctx.moveTo(x - 20, y - 75);
    this.ctx.lineTo(x + 20, y - 75);
    this.ctx.stroke();
  }

  private drawAutoRickshaw(x: number, y: number, time: number) {
    const bounce = Math.sin(time * 12) * 2;
    this.ctx.fillStyle = '#eab308';
    this.ctx.fillRect(x, y - 35 + bounce, 55, 20);

    this.ctx.fillStyle = '#065f46';
    this.ctx.fillRect(x, y - 18 + bounce, 55, 18);

    // Wheels
    this.ctx.fillStyle = '#0f172a';
    this.ctx.beginPath();
    this.ctx.arc(x + 12, y + bounce, 8, 0, Math.PI * 2);
    this.ctx.arc(x + 44, y + bounce, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // Headlight Beam
    const beamGrad = this.ctx.createLinearGradient(x, y - 10, x - 90, y);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.6)');
    beamGrad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = beamGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - 12 + bounce);
    this.ctx.lineTo(x - 80, y - 25 + bounce);
    this.ctx.lineTo(x - 80, y + 10 + bounce);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawCitizenCharacter(x: number, y: number, time: number, isSpeaking: boolean, isHappy: boolean = false, isLookingDown: boolean = false) {
    const walkLeg = Math.sin(time * 6) * 12;
    const breathe = Math.sin(time * 3) * 2;

    // Legs
    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(x + 6, y - 15);
    this.ctx.lineTo(x + 6 + walkLeg, y);
    this.ctx.moveTo(x + 14, y - 15);
    this.ctx.lineTo(x + 14 - walkLeg, y);
    this.ctx.stroke();

    // Torso (Kurta)
    this.ctx.fillStyle = isHappy ? '#059669' : '#3b82f6';
    this.ctx.fillRect(x, y - 48 + breathe, 20, 34);

    // Head
    this.ctx.fillStyle = '#fde047';
    this.ctx.beginPath();
    const headTiltY = isLookingDown ? y - 52 : y - 56;
    this.ctx.arc(x + 10, headTiltY + breathe, 9, 0, Math.PI * 2);
    this.ctx.fill();

    // Phone in Hand
    if (isSpeaking) {
      this.ctx.fillStyle = '#0284c7';
      this.ctx.fillRect(x + 16, y - 52 + breathe, 5, 10);
    }
  }

  private drawVoiceWaveformStream(x: number, y: number, time: number, act: number, p: number) {
    this.ctx.save();
    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 3.5;
    this.ctx.shadowColor = '#0284c7';
    this.ctx.shadowBlur = 14;

    this.ctx.beginPath();
    const endX = act === 4 ? x + 240 + p * 340 : x + 180;
    for (let curX = x; curX <= endX; curX += 10) {
      const offset = Math.sin(time * 8 + curX * 0.05) * (15 + Math.sin(curX * 0.1) * 8);
      if (curX === x) this.ctx.moveTo(curX, y + offset);
      else this.ctx.lineTo(curX, y + offset);
    }
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
    this.ctx.restore();
  }

  private drawIndiaMapNetwork(cx: number, cy: number, time: number, alpha: number) {
    this.ctx.save();
    this.ctx.globalAlpha = alpha;

    const nodes = [
      { id: 'DEL', x: cx - 20, y: cy - 90, label: 'Delhi' },
      { id: 'LKO', x: cx + 40, y: cy - 60, label: 'Lucknow' },
      { id: 'PAT', x: cx + 110, y: cy - 40, label: 'Patna' },
      { id: 'KOL', x: cx + 140, y: cy + 10, label: 'Kolkata' },
      { id: 'MUM', x: cx - 90, y: cy + 30, label: 'Mumbai' },
      { id: 'HYD', x: cx - 10, y: cy + 60, label: 'Hyderabad' },
      { id: 'BLR', x: cx - 30, y: cy + 110, label: 'Bengaluru' },
      { id: 'CHE', x: cx + 30, y: cy + 110, label: 'Chennai' },
      { id: 'GHY', x: cx + 200, y: cy - 60, label: 'Guwahati' }
    ];

    this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.45)';
    this.ctx.lineWidth = 1.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        this.ctx.beginPath();
        this.ctx.moveTo(nodes[i].x, nodes[i].y);
        this.ctx.lineTo(nodes[j].x, nodes[j].y);
        this.ctx.stroke();
      }
    }

    for (const node of nodes) {
      const pulse = Math.sin(time * 3 + node.x) * 4;
      this.ctx.fillStyle = '#38bdf8';
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 5 + pulse, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#94a3b8';
      this.ctx.font = '10px Inter, sans-serif';
      this.ctx.fillText(node.label, node.x + 8, node.y + 3);
    }

    this.ctx.restore();
  }

  private drawFloatingDataMatrix(cx: number, cy: number, time: number, p: number, act: number) {
    const layers = [
      { text: 'CITIZEN VOICE', color: '#38bdf8', y: cy - 80 },
      { text: 'POPULATION DENSITY', color: '#818cf8', y: cy - 30 },
      { text: 'GATISHAKTI GAP', color: '#f59e0b', y: cy + 20 },
      { text: 'MONSOON SURGE', color: '#f43f5e', y: cy + 70 }
    ];

    for (let i = 0; i < layers.length; i++) {
      const l = layers[i];
      const floatX = Math.sin(time * 2 + i) * 20;

      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      this.ctx.strokeStyle = l.color;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(cx - 140 + floatX, l.y, 280, 36);
      this.ctx.fillRect(cx - 140 + floatX, l.y, 280, 36);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 13px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(l.text, cx + floatX, l.y + 23);
    }
  }

  private drawLayeredMapStack(cx: number, cy: number, time: number, p: number, act: number) {
    const stackNames = ['Forecast Risk', 'Citizen Demand', 'Infrastructure Deficit', 'Demographic Base'];
    for (let i = 0; i < stackNames.length; i++) {
      const layerY = cy - 60 + i * 36;
      this.ctx.fillStyle = `rgba(30, 41, 59, ${0.45 + i * 0.15})`;
      this.ctx.strokeStyle = i === 1 ? '#38bdf8' : '#64748b';
      this.ctx.lineWidth = 1.5;

      this.ctx.beginPath();
      this.ctx.moveTo(cx - 180, layerY + 20);
      this.ctx.lineTo(cx, layerY - 30);
      this.ctx.lineTo(cx + 180, layerY + 20);
      this.ctx.lineTo(cx, layerY + 70);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#e2e8f0';
      this.ctx.font = '11px Inter, sans-serif';
      this.ctx.fillText(stackNames[i], cx - 120, layerY + 10);
    }
  }

  private drawPolicymakerInterface(cx: number, cy: number, time: number, p: number) {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(cx - 240, cy - 120, 480, 240);
    this.ctx.fillRect(cx - 240, cy - 120, 480, 240);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 16px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('RECOMMENDATION: Integrated Road + Drainage', cx - 220, cy - 80);

    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillText('Cluster CL-1042 • Catchment: 18,400 Citizens • Priority: 91/100', cx - 220, cy - 55);

    const btnColor = p > 0.5 ? '#10b981' : '#6366f1';
    this.ctx.fillStyle = btnColor;
    this.ctx.fillRect(cx - 220, cy + 30, 160, 40);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 13px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(p > 0.5 ? '✓ SANCTIONED' : 'Review Evidence', cx - 140, cy + 55);

    const cursorX = cx - 140 + Math.sin(time * 3) * 10;
    const cursorY = cy + 50 + Math.cos(time * 3) * 6;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.moveTo(cursorX, cursorY);
    this.ctx.lineTo(cursorX + 12, cursorY + 12);
    this.ctx.lineTo(cursorX + 4, cursorY + 14);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawWhatIfSimulationDualRoad(cx: number, cy: number, time: number, p: number) {
    // Option A (Patch Only)
    this.ctx.fillStyle = this.selectedSimVersion === 'A' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.7)';
    this.ctx.strokeStyle = this.selectedSimVersion === 'A' ? '#f43f5e' : '#475569';
    this.ctx.lineWidth = this.selectedSimVersion === 'A' ? 3 : 1;
    this.ctx.strokeRect(cx - 240, cy - 80, 220, 160);
    this.ctx.fillRect(cx - 240, cy - 80, 220, 160);

    this.ctx.fillStyle = '#f43f5e';
    this.ctx.font = 'bold 13px Inter, sans-serif';
    this.ctx.fillText('OPTION A: PATCH ONLY', cx - 220, cy - 50);
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.fillText('Waterlogging stays (-28% relief)', cx - 220, cy - 25);

    // Option C (Integrated)
    this.ctx.fillStyle = this.selectedSimVersion === 'C' ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.7)';
    this.ctx.strokeStyle = this.selectedSimVersion === 'C' ? '#10b981' : '#475569';
    this.ctx.lineWidth = this.selectedSimVersion === 'C' ? 3 : 1;
    this.ctx.strokeRect(cx + 20, cy - 80, 220, 160);
    this.ctx.fillRect(cx + 20, cy - 80, 220, 160);

    this.ctx.fillStyle = '#10b981';
    this.ctx.font = 'bold 13px Inter, sans-serif';
    this.ctx.fillText('OPTION C: INTEGRATED', cx + 40, cy - 50);
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.fillText('Drainage + Road (-82% relief)', cx + 40, cy - 25);
  }

  private drawClosedFeedbackLoop(cx: number, cy: number, time: number, p: number) {
    const radius = 110;
    const stages = ['VOICE', 'AI UNDERSTANDING', 'EVIDENCE', 'DECISION', 'ACTION', 'IMPACT', 'FEEDBACK'];

    for (let i = 0; i < stages.length; i++) {
      const angle = (i / stages.length) * Math.PI * 2 + time * 0.4;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      this.ctx.fillStyle = '#38bdf8';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 6, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 10px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(stages[i], x, y + 16);
    }
  }
}
