import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { usePlayerStore } from '@/store/playerStore';
import { useUiStore } from '@/store/uiStore';
import { consumeInteract } from '@/hooks/useKeyboard';

// Kompleks Olahraga: Lapangan Sepak Bola + Lapangan Basket Bersebelahan
// Posisi default: [75, 0, -35]

export default function SportsComplex() {
  return (
    <group position={[75, 0, -35]}>
      {/* ─── 1. Lapangan Sepak Bola ─── */}
      <FootballField position={[0, 0, 0]} />

      {/* ─── 2. Lapangan Basket (Bersebelahan) ─── */}
      <BasketballField position={[0, 0, 36]} />

      {/* Warung kecil pinggir lapangan */}
      <FieldWarung position={[-24, 0, 18]} />
    </group>
  );
}

// ─── LAPANGAN SEPAK BOLA (MINI-GAME) ─────────────────────────────
function FootballField({ position }: { position: [number, number, number] }) {
  const ballMeshRef = useRef<THREE.Mesh>(null);
  const ballPosRef = useRef(new THREE.Vector3(0, 0.25, 0));
  const ballVelRef = useRef(new THREE.Vector3(0, 0, 0));

  const [scoreRed, setScoreRed] = useState(0);
  const [scoreBlue, setScoreBlue] = useState(0);
  const [goalText, setGoalText] = useState<string | null>(null);
  const resetTimerRef = useRef(0);

  useFrame((_, delta) => {
    if (!ballMeshRef.current) return;

    // Timer reset setelah gol
    if (resetTimerRef.current > 0) {
      resetTimerRef.current -= delta;
      if (resetTimerRef.current <= 0) {
        setGoalText(null);
        ballPosRef.current.set(0, 0.25, 0);
        ballVelRef.current.set(0, 0, 0);
      }
    }

    const pos = ballPosRef.current;
    const vel = ballVelRef.current;

    // 1. Deteksi interaksi / tendangan pemain
    // Posisi dunia FootballField adalah [75, 0, -35]
    const { posX, posZ } = usePlayerStore.getState();
    const localPlayerX = posX - 75;
    const localPlayerZ = posZ - (-35);

    const dx = pos.x - localPlayerX;
    const dz = pos.z - localPlayerZ;
    const distPlayer = Math.sqrt(dx * dx + dz * dz);

    // Prompt tendang jika dekat bola
    const uiStore = useUiStore.getState();
    if (distPlayer < 2.0 && resetTimerRef.current <= 0) {
      if (uiStore.activePrompt?.id !== 'soccer-ball') {
        uiStore.setPrompt({
          id: 'soccer-ball',
          label: 'Tendang Kencang Bola Sepak (Tekan E)',
          type: 'action',
        });
      }

      if (consumeInteract()) {
        // Tendangan kuat melambung
        const dirX = distPlayer > 0.1 ? dx / distPlayer : 1;
        const dirZ = distPlayer > 0.1 ? dz / distPlayer : 0;
        vel.x = dirX * 18;
        vel.z = dirZ * 18;
        vel.y = 5.5;
      }
    } else {
      if (uiStore.activePrompt?.id === 'soccer-ball') {
        uiStore.setPrompt(null);
      }
    }

    // Tabrakan kontak fisik kaki pemain (dribble / sentuhan lembut)
    if (distPlayer < 0.85 && resetTimerRef.current <= 0) {
      const pushX = distPlayer > 0.05 ? dx / distPlayer : 1;
      const pushZ = distPlayer > 0.05 ? dz / distPlayer : 0;
      vel.x += pushX * 5.0;
      vel.z += pushZ * 5.0;
      vel.y = Math.max(vel.y, 1.2);
    }

    // 2. Fisika bola sederhana (gravitasi, pantulan tanah, hambatan gesekan rumput)
    vel.y -= 14 * delta; // Gravitasi
    pos.x += vel.x * delta;
    pos.y += vel.y * delta;
    pos.z += vel.z * delta;

    // Pantulan tanah
    if (pos.y <= 0.25) {
      pos.y = 0.25;
      if (Math.abs(vel.y) > 0.5) {
        vel.y = -vel.y * 0.55; // elastisitas pantulan
      } else {
        vel.y = 0;
      }
    }

    // Hambatan rumput
    const friction = Math.pow(0.92, delta * 60);
    vel.x *= friction;
    vel.z *= friction;

    // Batas garis samping lapangan (Z = -13 s.d. 13)
    if (Math.abs(pos.z) > 13) {
      pos.z = Math.sign(pos.z) * 13;
      vel.z = -vel.z * 0.6;
    }

    // 3. Deteksi Gol di Gawang Barat (-x) dan Gawang Timur (+x)
    if (resetTimerRef.current <= 0) {
      // Gawang Kiri Barat (-20) — Gol Tim Biru
      if (pos.x <= -19.5 && Math.abs(pos.z) <= 2.5 && pos.y <= 2.4) {
        setScoreBlue((s) => s + 1);
        setGoalText('⚽ GOOOOL! Tim Biru Mencetak Skor!');
        resetTimerRef.current = 2.5;
        vel.set(0, 0, 0);
      }
      // Gawang Kanan Timur (+20) — Gol Tim Merah
      else if (pos.x >= 19.5 && Math.abs(pos.z) <= 2.5 && pos.y <= 2.4) {
        setScoreRed((s) => s + 1);
        setGoalText('⚽ GOOOOL! Tim Merah Mencetak Skor!');
        resetTimerRef.current = 2.5;
        vel.set(0, 0, 0);
      }
      // Batas garis gawang luar
      else if (Math.abs(pos.x) > 21) {
        pos.x = Math.sign(pos.x) * 21;
        vel.x = -vel.x * 0.6;
      }
    }

    // Update mesh transform
    ballMeshRef.current.position.copy(pos);
    ballMeshRef.current.rotation.x += vel.z * delta * 2;
    ballMeshRef.current.rotation.z -= vel.x * delta * 2;
  });

  return (
    <group position={position}>
      {/* Papan Skor Sepak Bola 3D */}
      <Html position={[0, 4.5, 14.2]} center distanceFactor={20}>
        <div className="bg-[#2B1D14]/90 border-2 border-[#E8743B] px-3 py-1.5 rounded-lg shadow-xl text-center select-none backdrop-blur-sm">
          <div className="text-[10px] text-[#F2B632] font-body font-bold uppercase tracking-wider">
            Sepak Bola Senja
          </div>
          <div className="font-display font-black text-base text-white flex items-center gap-2">
            <span className="text-[#E74C3C]">Merah {scoreRed}</span>
            <span className="text-[#F5E9D3]">-</span>
            <span className="text-[#3498DB]">{scoreBlue} Biru</span>
          </div>
          {goalText && (
            <div className="mt-1 text-xs font-display font-bold text-[#F2B632] animate-bounce">
              {goalText}
            </div>
          )}
        </div>
      </Html>

      {/* Rumput Hijau Lapangan Bola (42x26 m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[42, 26]} />
        <meshLambertMaterial color="#3E8E41" />
      </mesh>

      {/* Garis Putih Lapangan */}
      <LineBox width={40} depth={24} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[0.2, 24]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[3.2, 3.4, 24]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <group position={[-16, 0, 0]}>
        <LineBox width={8} depth={12} />
      </group>
      <group position={[16, 0, 0]}>
        <LineBox width={8} depth={12} />
      </group>

      {/* 2 Gawang Bola Blocky */}
      <GoalPost position={[-20, 0, 0]} rotY={Math.PI / 2} />
      <GoalPost position={[20, 0, 0]} rotY={-Math.PI / 2} />

      {/* Bola Sepak Interaktif */}
      <mesh ref={ballMeshRef} position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.48, 0.48, 0.48]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>

      {/* NPC Pemain Sepak Bola (Merah vs Biru) */}
      <SoccerPlayer position={[-6, 0, 4]} shirtColor="#E74C3C" />
      <SoccerPlayer position={[-10, 0, -5]} shirtColor="#E74C3C" />
      <SoccerPlayer position={[8, 0, -3]} shirtColor="#2980B9" />
      <SoccerPlayer position={[12, 0, 6]} shirtColor="#2980B9" />
      <SoccerPlayer position={[-18.5, 0, 0]} shirtColor="#F39C12" />
      <SoccerPlayer position={[18.5, 0, 0]} shirtColor="#27AE60" />

      {/* Bangku Pinggir Lapangan */}
      <Bench position={[-8, 0, 14.5]} />
      <Bench position={[8, 0, 14.5]} />
    </group>
  );
}

// ─── LAPANGAN BASKET (MINI-GAME) ─────────────────────────────────
function BasketballField({ position }: { position: [number, number, number] }) {
  const ballMeshRef = useRef<THREE.Mesh>(null);
  const ballPosRef = useRef(new THREE.Vector3(2, 0.22, 1));
  const ballVelRef = useRef(new THREE.Vector3(0, 0, 0));
  const isHoldingRef = useRef(false);
  const isShootingRef = useRef(false);

  const [basketScore, setBasketScore] = useState(0);
  const [basketMessage, setBasketMessage] = useState<string | null>(null);

  useFrame((_, delta) => {
    if (!ballMeshRef.current) return;

    // Posisi dunia Lapangan Basket adalah [75, 0, -35 + 36] = [75, 0, 1]
    const { posX, posZ } = usePlayerStore.getState();
    const localPlayerX = posX - 75;
    const localPlayerZ = posZ - 1;

    const pos = ballPosRef.current;
    const vel = ballVelRef.current;
    const uiStore = useUiStore.getState();

    const dx = pos.x - localPlayerX;
    const dz = pos.z - localPlayerZ;
    const distToPlayer = Math.sqrt(dx * dx + dz * dz);

    if (isHoldingRef.current) {
      // 1. Bola sedang dipegang & didribble oleh pemain
      const t = Date.now() * 0.012;
      const dribbleY = Math.abs(Math.sin(t)) * 0.75 + 0.25;
      pos.set(localPlayerX + 0.6, dribbleY, localPlayerZ + 0.4);

      if (uiStore.activePrompt?.id !== 'basketball-shoot') {
        uiStore.setPrompt({
          id: 'basketball-shoot',
          label: 'Tembak Bola Basket ke Ring (Tekan E)',
          type: 'action',
        });
      }

      if (consumeInteract()) {
        // Tembak bola ke arah ring terdekat (x = -12.5 atau x = 12.5)
        isHoldingRef.current = false;
        isShootingRef.current = true;

        const targetX = localPlayerX < 0 ? -12.5 : 12.5;
        const targetZ = 0;
        const targetY = 3.05; // ketinggian ring basket

        const shootDx = targetX - pos.x;
        const shootDz = targetZ - pos.z;
        const flightTime = 1.0; // detik waktu terbang

        vel.x = shootDx / flightTime;
        vel.z = shootDz / flightTime;
        vel.y = (targetY - pos.y) / flightTime + 0.5 * 14 * flightTime; // rumus balistik
      }
    } else if (isShootingRef.current) {
      // 2. Bola sedang meluncur di udara menuju ring
      vel.y -= 14 * delta;
      pos.x += vel.x * delta;
      pos.y += vel.y * delta;
      pos.z += vel.z * delta;

      // Cek apakah mencapai ketinggian ring basket
      const targetRingX = vel.x < 0 ? -12.5 : 12.5;
      const distToHoop = Math.sqrt(
        Math.pow(pos.x - targetRingX, 2) + Math.pow(pos.z, 2) + Math.pow(pos.y - 3.05, 2)
      );

      if (distToHoop < 0.8) {
        // MASUK RING!
        setBasketScore((s) => s + 2);
        setBasketMessage('🏀 SWISH! MASUK (+2 POIN)!');
        setTimeout(() => setBasketMessage(null), 2500);

        // Pantulan jaring ke bawah
        vel.x *= 0.1;
        vel.z *= 0.1;
        vel.y = -2.0;
        isShootingRef.current = false;
      }

      // Bola mendarat di lantai
      if (pos.y <= 0.22) {
        pos.y = 0.22;
        vel.y = -vel.y * 0.5;
        if (Math.abs(vel.y) < 0.5) {
          isShootingRef.current = false;
        }
      }
    } else {
      // 3. Bola bebas di lantai lapangan
      vel.y -= 14 * delta;
      pos.x += vel.x * delta;
      pos.y += vel.y * delta;
      pos.z += vel.z * delta;

      if (pos.y <= 0.22) {
        pos.y = 0.22;
        vel.y = Math.abs(vel.y) > 0.4 ? -vel.y * 0.5 : 0;
      }
      vel.x *= 0.95;
      vel.z *= 0.95;

      // Prompt ambil bola jika pemain dekat
      if (distToPlayer < 1.8) {
        if (uiStore.activePrompt?.id !== 'basketball-pickup') {
          uiStore.setPrompt({
            id: 'basketball-pickup',
            label: 'Ambil & Dribble Bola Basket (Tekan E)',
            type: 'action',
          });
        }
        if (consumeInteract()) {
          isHoldingRef.current = true;
          vel.set(0, 0, 0);
        }
      } else {
        if (uiStore.activePrompt?.id === 'basketball-pickup' || uiStore.activePrompt?.id === 'basketball-shoot') {
          uiStore.setPrompt(null);
        }
      }
    }

    ballMeshRef.current.position.copy(pos);
  });

  return (
    <group position={position}>
      {/* Papan Skor Basket 3D */}
      <Html position={[0, 4.0, 9.0]} center distanceFactor={20}>
        <div className="bg-[#2B1D14]/90 border-2 border-[#E67E22] px-3 py-1.5 rounded-lg shadow-xl text-center select-none backdrop-blur-sm">
          <div className="text-[10px] text-[#F2B632] font-body font-bold uppercase tracking-wider">
            Lapangan Basket
          </div>
          <div className="font-display font-black text-base text-white">
            Skor: <span className="text-[#E67E22]">{basketScore} Poin</span>
          </div>
          {basketMessage && (
            <div className="mt-1 text-xs font-display font-bold text-[#2ECC71] animate-bounce">
              {basketMessage}
            </div>
          )}
        </div>
      </Html>

      {/* Lantai Semen Biru-Hijau Basket (28x16 m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[28, 16]} />
        <meshLambertMaterial color="#2E6B8E" />
      </mesh>

      {/* Garis Batas Lapangan Basket */}
      <LineBox width={26} depth={14} color="#F5E9D3" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[0.2, 14]} />
        <meshBasicMaterial color="#F5E9D3" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[2.0, 2.15, 20]} />
        <meshBasicMaterial color="#F5E9D3" />
      </mesh>

      {/* 2 Tiang & Ring Basket */}
      <HoopPost position={[-12.5, 0, 0]} rotY={Math.PI / 2} />
      <HoopPost position={[12.5, 0, 0]} rotY={-Math.PI / 2} />

      {/* Bola Basket Interaktif */}
      <mesh ref={ballMeshRef} position={[2, 0.22, 1]} castShadow>
        <boxGeometry args={[0.42, 0.42, 0.42]} />
        <meshLambertMaterial color="#E67E22" />
      </mesh>

      {/* NPC Remaja Main Basket */}
      <BasketballPlayer position={[-3, 0, 2]} />
      <BasketballPlayer position={[5, 0, -2]} />

      {/* Pagar Kawat Keliling */}
      <FenceWall position={[0, 1.5, 8]} width={28} />
      <FenceWall position={[0, 1.5, -8]} width={28} />
    </group>
  );
}

// ─── HELPER MESH & DETAIL ────────────────────────────────────────

function LineBox({ width, depth, color = '#FFFFFF' }: { width: number; depth: number; color?: string }) {
  const lineMat = useMemo(() => new THREE.MeshBasicMaterial({ color }), [color]);
  const halfW = width / 2;
  const halfD = depth / 2;
  const t = 0.15; // tebal garis

  return (
    <group position={[0, 0.03, 0]}>
      {/* Atas & Bawah */}
      <mesh position={[0, 0, -halfD]} rotation={[-Math.PI / 2, 0, 0]} material={lineMat}>
        <planeGeometry args={[width, t]} />
      </mesh>
      <mesh position={[0, 0, halfD]} rotation={[-Math.PI / 2, 0, 0]} material={lineMat}>
        <planeGeometry args={[width, t]} />
      </mesh>
      {/* Kiri & Kanan */}
      <mesh position={[-halfW, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={lineMat}>
        <planeGeometry args={[t, depth]} />
      </mesh>
      <mesh position={[halfW, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={lineMat}>
        <planeGeometry args={[t, depth]} />
      </mesh>
    </group>
  );
}

// Gawang Sepak Bola Blocky
function GoalPost({ position, rotY }: { position: [number, number, number]; rotY: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Tiang Kiri & Kanan */}
      <mesh position={[-2.5, 1.2, 0]} castShadow>
        <boxGeometry args={[0.15, 2.4, 0.15]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[2.5, 1.2, 0]} castShadow>
        <boxGeometry args={[0.15, 2.4, 0.15]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      {/* Mistar Atas */}
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[5.15, 0.15, 0.15]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      {/* Jaring Belakang (Transparan) */}
      <mesh position={[0, 1.2, -0.6]}>
        <boxGeometry args={[5.0, 2.3, 1.1]} />
        <meshLambertMaterial color="#FFFFFF" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
}

// Tiang & Ring Basket
function HoopPost({ position, rotY }: { position: [number, number, number]; rotY: number }) {
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Tiang Utama */}
      <mesh position={[0, 2.0, -0.6]} castShadow>
        <boxGeometry args={[0.2, 4.0, 0.2]} />
        <meshLambertMaterial color="#7F8C8D" />
      </mesh>
      {/* Papan Pantul */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[1.8, 1.2, 0.08]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      {/* Kotak Merah di Papan */}
      <mesh position={[0, 3.05, 0.05]}>
        <boxGeometry args={[0.7, 0.5, 0.02]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
      {/* Ring Oranye */}
      <mesh position={[0, 2.8, 0.45]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.3, 0.04, 6, 12]} />
        <meshLambertMaterial color="#E67E22" />
      </mesh>
    </group>
  );
}

// Pagar Kawat Basket
function FenceWall({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <mesh position={position}>
      <planeGeometry args={[width, 3]} />
      <meshLambertMaterial color="#BDC3C7" transparent opacity={0.35} wireframe />
    </mesh>
  );
}

// NPC Pemain Bola Blocky
function SoccerPlayer({ position, shirtColor }: { position: [number, number, number]; shirtColor: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshLambertMaterial color="#FFD1A4" />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.25]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// NPC Pemain Basket Blocky
function BasketballPlayer({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshLambertMaterial color="#FFD1A4" />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.3]} />
        <meshLambertMaterial color="#9B59B6" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.25]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
    </group>
  );
}

// Warung Pinggir Lapangan
function FieldWarung({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <group>
        {/* Tembok Warung */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 3, 4]} />
          <meshLambertMaterial color="#F2B632" />
        </mesh>
        {/* Atap Seng */}
        <mesh position={[0, 3.2, 0]} castShadow>
          <boxGeometry args={[5.8, 0.3, 4.8]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        {/* Spanduk Minuman */}
        <mesh position={[0, 2.5, 2.02]}>
          <boxGeometry args={[3.8, 0.7, 0.05]} />
          <meshLambertMaterial color="#E74C3C" />
        </mesh>
      </group>
    </RigidBody>
  );
}

// Bangku Kayu
function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[3.0, 0.1, 0.6]} />
        <meshLambertMaterial color="#8B5A2B" />
      </mesh>
      <mesh position={[-1.2, 0.22, 0]}>
        <boxGeometry args={[0.12, 0.45, 0.5]} />
        <meshLambertMaterial color="#5A3A1B" />
      </mesh>
      <mesh position={[1.2, 0.22, 0]}>
        <boxGeometry args={[0.12, 0.45, 0.5]} />
        <meshLambertMaterial color="#5A3A1B" />
      </mesh>
    </group>
  );
}
