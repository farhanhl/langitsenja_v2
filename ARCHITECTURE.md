# ARCHITECTURE

## Stack
Next.js App Router · TypeScript strict · @react-three/fiber · @react-three/drei · @react-three/rapier · Zustand · Tailwind CSS + Flowbite (flowbite-react) · howler atau drei `PositionalAudio` untuk audio.

## Struktur Folder
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # menu utama (Flowbite)
│   └── play/page.tsx            # halaman game
├── components/
│   ├── world/                   # visual 3D (R3F)
│   │   ├── City.tsx  Roads.tsx  Buildings.tsx
│   │   ├── Fields/ (Football.tsx Basketball.tsx KiteField.tsx)
│   │   ├── Characters/ (Player.tsx Npc.tsx Kid.tsx Vendor.tsx)
│   │   ├── Vehicles/ (Motorcycle.tsx Car.tsx)
│   │   └── Sky.tsx  Lighting.tsx  Clouds.tsx
│   └── ui/                      # HUD & menu (Flowbite + Tailwind)
│       ├── Hud.tsx  DialogModal.tsx  VendorShop.tsx
│       ├── TouchControls.tsx  MissionPanel.tsx  EndScreen.tsx
├── game/                        # logika murni, tanpa React
│   ├── constants.ts  missions.ts  dialogues.ts  vendors.ts
│   ├── vehicleController.ts     # input -> gerak (arcade)
│   ├── npcPaths.ts  interaction.ts
├── store/
│   ├── gameStore.ts             # misi, timer, win/lose
│   ├── playerStore.ts           # posisi, mode (walk/drive), uang, buff
│   └── uiStore.ts               # dialog aktif, pause
├── hooks/  useKeyboard.ts  useTouchInput.ts  useInteractionTarget.ts
└── lib/    audio.ts  rng.ts
public/ (music/, sfx/)
```

## Game Loop & State
- Loop pakai `useFrame` per komponen. Hindari `setState` React tiap frame: simpan posisi/kecepatan di `useRef` atau mutable store (Zustand `subscribe`/`getState`).
- Zustand hanya untuk state "jarang berubah" (misi, uang, dialog, mode).
- Mode pemain: `walking | driving`. Saat `driving`, input diarahkan ke `vehicleController`.

## Input Terpadu
Satu abstraksi `InputState { moveX, moveY, sprint, jump, interact, enterExit }` yang diisi oleh keyboard/mouse **atau** joystick sentuh. Logika game hanya membaca `InputState`.

## Kendaraan (Arcade, Sederhana)
- Parameter: `maxSpeed`, `accel`, `brake`, `turnRate`, `friction`.
- Gerak: kecepatan maju diintegrasikan; belok proporsional kecepatan; berhenti pelan saat gas dilepas.
- Collision: collider rapier kinematic; kendaraan berhenti/memantul ringan saat menabrak.
- Pisahkan `vehicleController.ts` (logika) dari `Motorcycle.tsx`/`Car.tsx` (model blocky) supaya upgrade fisika nanti hanya mengganti controller.

## NPC & Pedagang
- NPC jalan di sidewalk lewat waypoint (`npcPaths.ts`). Pedagang punya rute loop dan berhenti sejenak di titik tertentu.
- Interaksi: `useInteractionTarget` mencari entitas interaktif terdekat dalam radius (±2.5 unit) → set `uiStore.activePrompt`.

## Performa
- `InstancedMesh` untuk rumah, pohon, pagar, tiang listrik, penonton.
- `flatShading`, material dibagi (shared), tanpa shadow map besar di mobile (turunkan resolusi/matikan sesuai `isMobile`).
- Deteksi perangkat → preset kualitas `low | medium | high`.
- Canvas dimuat `dynamic` dengan `ssr: false`.

## Aset
Musik dari repo lama (`music/`). Suara pedagang/kendaraan: file pendek mono, lisensi harus bebas pakai. Catat sumber di `public/sfx/CREDITS.md`.
