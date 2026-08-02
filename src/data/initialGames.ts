import { GameProject } from '../types';

export const INITIAL_GAMES: GameProject[] = [
  {
    id: 'aether-rift',
    title: 'Aether Rift: Cybernetic Shift',
    tagline: 'Fast-paced sci-fi FPS built in Unity 6 featuring real-time ray-traced lighting & volumetric fog.',
    description: 'Battle through crumbling orbital stations in zero-G high-speed cybernetic combat. Custom HLSL shader pipeline with dynamic grapple mechanics.',
    detailedOverview: `Aether Rift is an intense sci-fi first-person shooter developed over 8 months in Unity 6 (6000.0). Built to showcase high-end graphics performance using the High Definition Render Pipeline (HDRP), the game incorporates full hardware ray tracing, DLSS 3 support, dynamic volumetric atmospheres, and a reactive enemy AI system driven by custom Behavior Trees.

### Key Innovations & Architecture
* **Custom Kinematic Grapple Engine:** Built using C# Jobs and Burst compiler for 60+ FPS physics interactions with zero garbage collection allocations.
* **HDRP Custom Shaders:** Written in HLSL featuring dynamic shield dissolve, hologram UI projection, and metallic subsurface scattering.
* **FMOD Audio Integration:** Spatialized 3D audio design with adaptive music tracks synced to player health and enemy tension levels.
* **Procedural Level Modules:** Tileable orbital station hallway generators crafted in Blender and assembled via Unity Prefab Variants.`,
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    unityVersion: 'Unity 6 (6000.0.1f1)',
    renderPipeline: 'HDRP',
    genre: ['Sci-Fi', 'FPS', 'Action', 'Physics'],
    status: 'Released',
    releaseDate: '2026-04-15',
    featured: true,
    developerNotes: 'Unity 6 HDRP showcase project. Requires DirectX 12 compatible graphics card for ray tracing.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder trailer or embed
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80'
    ],
    builds: [
      {
        id: 'build-ar-win',
        platform: 'windows',
        title: 'Windows Standalone (x64)',
        fileName: 'AetherRift_v1.3.0_Win64.zip',
        fileUrl: '/uploads/builds/AetherRift_v1.3.0_Win64.zip',
        fileSize: '68.5 MB',
        version: '1.3.0',
        releaseDate: '2026-06-01',
        downloadCount: 1420
      },
      {
        id: 'build-ar-mac',
        platform: 'mac',
        title: 'macOS Universal Build (Apple Silicon / Intel)',
        fileName: 'AetherRift_v1.3.0_macOS.zip',
        fileUrl: '/uploads/builds/AetherRift_v1.3.0_macOS.zip',
        fileSize: '72.1 MB',
        version: '1.3.0',
        releaseDate: '2026-06-01',
        downloadCount: 680
      },
      {
        id: 'build-ar-linux',
        platform: 'linux',
        title: 'Linux AppImage x86_64',
        fileName: 'AetherRift_v1.3.0_Linux.AppImage',
        fileUrl: '/uploads/builds/AetherRift_v1.3.0_Linux.AppImage',
        fileSize: '65.8 MB',
        version: '1.3.0',
        releaseDate: '2026-06-01',
        downloadCount: 310
      }
    ],
    technicalHighlights: [
      'Unity 6 HDRP Ray Tracing & DLSS Integration',
      'Burst-Compiled Kinematic Movement System',
      'Custom HLSL Shield & Holographic Shader Graph',
      'FMOD Interactive Spatial Audio Architecture',
      'NavMesh Agent Flocking with Jobs System'
    ],
    minRequirements: {
      os: 'Windows 10 64-bit',
      processor: 'Intel Core i5-8400 or AMD Ryzen 5 2600',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GeForce GTX 1060 (6GB) or AMD Radeon RX 580',
      directX: 'Version 12',
      storage: '1 GB available space'
    },
    recRequirements: {
      os: 'Windows 11 64-bit',
      processor: 'Intel Core i7-12700K or AMD Ryzen 7 5800X',
      memory: '16 GB RAM',
      graphics: 'NVIDIA GeForce RTX 3070 or AMD Radeon RX 6800',
      directX: 'Version 12',
      storage: '1 GB SSD space'
    },
    devlogs: [
      {
        id: 'dev-ar-1',
        date: '2026-06-01',
        version: '1.3.0',
        title: 'Performance & Ray Tracing Patch',
        content: 'Migrated project core to Unity 6 LTS. Improved GPU frame budget by 28% using occlusion culling layers and Burst-compiled enemy pathfinding.',
        changes: ['Updated to Unity 6 (6000.0)', 'Optimized VRAM allocation for 4K textures', 'Added DLSS 3 Frame Generation support']
      },
      {
        id: 'dev-ar-2',
        date: '2026-04-15',
        version: '1.0.0',
        title: 'Official v1.0 Release',
        content: 'Launched full playable 3-level campaign with 4 weapons, dynamic grapple hook mechanics, and soundtrack.',
        changes: ['Initial release build', 'Added grappling hook mechanics', 'FMOD audio engine implementation']
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'IndieGameReviewer',
        rating: 5,
        date: '2026-05-10',
        comment: 'Unbelievable graphics for an indie project! The grapple mechanics feel extremely slick and responsive.'
      },
      {
        id: 'rev-2',
        author: 'UnityDevGuy',
        rating: 5,
        date: '2026-05-18',
        comment: 'Very impressive C# Burst optimization. Runs at a smooth 144 FPS on my rig.'
      }
    ],
    downloadsCount: 2410,
    likesCount: 342
  },
  {
    id: 'chronicles-of-eldoria',
    title: 'Chronicles of Eldoria',
    tagline: 'Third-person Fantasy Action RPG featuring fluid combo combat & custom URP shader pipeline.',
    description: 'Explore ancient ruins, master elemental spells, and conquer mythical titans in a stylized fantasy world built with Unity URP.',
    detailedOverview: `Chronicles of Eldoria is an action RPG built with Unity 2022.3 LTS using the Universal Render Pipeline (URP). It showcases a robust third-person action camera framework, state-machine combat combos, inverse kinematics (IK) foot placement, and dynamic day/night weather cycles.

### Core Features
* **State Machine Combat Engine:** Smooth animator transitions, hitstop feedback, poise meters, and hit-box collisions.
* **Custom Stylized Shaders:** Stylized anime toon shading with rim lighting, custom water surface displacement, and interactive foliage bending.
* **Inventory & Quest Architecture:** ScriptableObject driven item databases, quest trees, and save/load serialization.`,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    unityVersion: '2022.3.20 LTS',
    renderPipeline: 'URP',
    genre: ['RPG', 'Action', 'Fantasy', '3D'],
    status: 'Playable Demo',
    releaseDate: '2026-02-20',
    featured: true,
    developerNotes: 'Playable demo including Chapter 1 and boss battle against the Sunken Sentinel.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
    ],
    builds: [
      {
        id: 'build-eld-win',
        platform: 'windows',
        title: 'Windows Demo Build (v0.8.2)',
        fileName: 'Eldoria_Demo_v0.8.2_Win.zip',
        fileUrl: '/uploads/builds/Eldoria_Demo_v0.8.2_Win.zip',
        fileSize: '45.0 MB',
        version: '0.8.2',
        releaseDate: '2026-03-10',
        downloadCount: 950
      },
      {
        id: 'build-eld-mac',
        platform: 'mac',
        title: 'macOS Apple Silicon Build (v0.8.2)',
        fileName: 'Eldoria_Demo_v0.8.2_Mac.zip',
        fileUrl: '/uploads/builds/Eldoria_Demo_v0.8.2_Mac.zip',
        fileSize: '48.2 MB',
        version: '0.8.2',
        releaseDate: '2026-03-10',
        downloadCount: 410
      }
    ],
    technicalHighlights: [
      'Unity URP Custom Lighting & Toon Shading',
      'ScriptableObject Driven Inventory & Quest System',
      'Animator Controller State Machine for Combos',
      'Inverse Kinematics (IK) Foot Grounding',
      'Save/Load Serialization with JSON Encryption'
    ],
    minRequirements: {
      os: 'Windows 10 64-bit',
      processor: 'Intel Core i3-9100 or AMD FX-8350',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GTX 960 or AMD Radeon R9 280',
      directX: 'Version 11',
      storage: '500 MB available space'
    },
    devlogs: [
      {
        id: 'dev-eld-1',
        date: '2026-03-10',
        version: '0.8.2',
        title: 'Combat Responsiveness Update',
        content: 'Refactored weapon collision detection using Raycast Command Buffers for pixel-perfect melee registration.',
        changes: ['Added hitstop visual freeze on heavy attacks', 'Refactored enemy AI parry windows', 'Fixed URP water shader reflection glitches']
      }
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'GamerSam',
        rating: 4,
        date: '2026-03-15',
        comment: 'The toon shading is gorgeous and combat feels punchy. Can not wait for the full release!'
      }
    ],
    downloadsCount: 1360,
    likesCount: 198
  },
  {
    id: 'neon-velocity',
    title: 'Neon Velocity: Outrun',
    tagline: 'Retro synthwave arcade racing game playable directly in browser (WebGL) and Android APK.',
    description: 'Drift through neon-drenched grid cities set to an ultra-fast 80s synthwave soundtrack. Features real-time leaderboards and mobile touch support.',
    detailedOverview: `Neon Velocity: Outrun is a retro-arcade drift racing title optimized for low-latency WebGL web deployment and mobile platforms. Built in Unity URP with lightweight vertex lighting, custom arcade vehicle physics, and a responsive drift scoring algorithm.

### Key Technical Aspects
* **Arcade Vehicle Physics Model:** Custom wheel collider script simulating high-speed drift momentum without complex PhysX drag overhead.
* **WebGL Memory Optimization:** Strict asset bundle stripping keeping the compressed WebGL build under 15MB for fast browser loading.
* **Cross-Platform Input:** Integrated Unity New Input System supporting keyboard, gamepads, and mobile gyroscope touch steering.`,
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    unityVersion: '2022.3.15 LTS',
    renderPipeline: 'URP',
    genre: ['Racing', 'Arcade', 'Synthwave', 'Mobile', 'WebGL'],
    status: 'Released',
    releaseDate: '2025-11-05',
    featured: false,
    developerNotes: 'Playable directly on WebGL or download the Android APK for 120Hz display phones.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80'
    ],
    builds: [
      {
        id: 'build-nv-web',
        platform: 'webgl',
        title: 'WebGL Browser Play (Direct Play)',
        fileName: 'NeonVelocity_WebGL_v2.0.0.zip',
        fileUrl: '/uploads/builds/NeonVelocity_WebGL_v2.0.0.zip',
        fileSize: '18.4 MB',
        version: '2.0.0',
        releaseDate: '2025-12-01',
        isExternalLink: false,
        downloadCount: 3820
      },
      {
        id: 'build-nv-apk',
        platform: 'android',
        title: 'Android APK Build (v2.0.0)',
        fileName: 'NeonVelocity_v2.0.0.apk',
        fileUrl: '/uploads/builds/NeonVelocity_v2.0.0.apk',
        fileSize: '24.6 MB',
        version: '2.0.0',
        releaseDate: '2025-12-01',
        downloadCount: 1450
      },
      {
        id: 'build-nv-win',
        platform: 'windows',
        title: 'Windows Standalone (x64)',
        fileName: 'NeonVelocity_v2.0.0_Win64.zip',
        fileUrl: '/uploads/builds/NeonVelocity_v2.0.0_Win64.zip',
        fileSize: '32.1 MB',
        version: '2.0.0',
        releaseDate: '2025-12-01',
        downloadCount: 890
      }
    ],
    technicalHighlights: [
      'Sub-20MB WebGL Memory Footprint Optimization',
      'Custom Arcade Vehicle Wheel Drift Controller',
      'Post-Processing Bloom & Retro CRT Shaders',
      'Cross-Platform Input System Integration'
    ],
    minRequirements: {
      os: 'Windows / Mac / Modern Web Browser / Android 8.0+',
      processor: 'Dual-core 2.0 GHz',
      memory: '4 GB RAM',
      graphics: 'Integrated Intel HD 620 or equivalent WebGL 2.0 GPU',
      storage: '100 MB available space'
    },
    devlogs: [
      {
        id: 'dev-nv-1',
        date: '2025-12-01',
        version: '2.0.0',
        title: 'WebGL 2.0 & Mobile Update',
        content: 'Rebuilt post-processing stack for mobile GPUs and added online ghost car replay telemetry.',
        changes: ['Added mobile touch steering wheel overlay', 'Optimized shader variants for WebGL', 'Added 3 new synthwave tracks']
      }
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'ArcadeFanatic',
        rating: 5,
        date: '2025-12-12',
        comment: 'Runs ridiculously well right inside the web browser! The synthwave vibes are top notch.'
      }
    ],
    downloadsCount: 6160,
    likesCount: 512
  },
  {
    id: 'astral-echoes',
    title: 'Astral Echoes: Gravity Puzzle',
    tagline: 'Mind-bending 3D gravity-manipulation puzzle game using Unity DOTS & Burst compiler.',
    description: 'Alter gravity vectors, solve intricate spatial puzzles, and manipulate quantum spheres in a serene cosmic environment.',
    detailedOverview: `Astral Echoes is an atmospheric 3D gravity puzzle game designed to demonstrate Unity's Data-Oriented Technology Stack (DOTS), including Entities (ECS), Unity Physics, and the Burst Compiler.

### High-Performance Entity Architecture
* **Unity DOTS ECS Physics:** Handles over 50,000 interactive gravity-bound particles and celestial bodies at a rock-solid 120 FPS.
* **Spatial Audio Synthesizer:** Procedural ambient soundscapes rendered dynamically depending on current gravity vector orientations.
* **Minimalist Aesthetics:** High-contrast ambient lighting, soft shadows, and clean UI design.`,
    coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    unityVersion: '2022.3.25 LTS',
    renderPipeline: 'URP',
    genre: ['Puzzle', 'Physics', 'Atmospheric', '3D', 'DOTS'],
    status: 'Released',
    releaseDate: '2025-09-18',
    featured: false,
    developerNotes: 'Winner of Unity Physics Tech Showcase 2025.',
    trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
    ],
    builds: [
      {
        id: 'build-ae-win',
        platform: 'windows',
        title: 'Windows Standalone (x64)',
        fileName: 'AstralEchoes_v1.1.0_Win64.zip',
        fileUrl: '/uploads/builds/AstralEchoes_v1.1.0_Win64.zip',
        fileSize: '38.2 MB',
        version: '1.1.0',
        releaseDate: '2025-10-01',
        downloadCount: 1120
      },
      {
        id: 'build-ae-mac',
        platform: 'mac',
        title: 'macOS Universal Build',
        fileName: 'AstralEchoes_v1.1.0_Mac.zip',
        fileUrl: '/uploads/builds/AstralEchoes_v1.1.0_Mac.zip',
        fileSize: '41.0 MB',
        version: '1.1.0',
        releaseDate: '2025-10-01',
        downloadCount: 530
      }
    ],
    technicalHighlights: [
      'Unity ECS & DOTS Physics Architecture',
      'Burst-Compiled Spatial Gravity Vector Solvers',
      'Procedural Ambient Audio Synthesizer',
      'Custom Level Editor & XML Save System'
    ],
    minRequirements: {
      os: 'Windows 10 / macOS 11+',
      processor: 'Quad-core CPU (Intel i5 / Apple M1)',
      memory: '8 GB RAM',
      graphics: 'DirectX 11 / Metal compatible GPU',
      storage: '300 MB available space'
    },
    devlogs: [
      {
        id: 'dev-ae-1',
        date: '2025-10-01',
        version: '1.1.0',
        title: 'Level Pack 2 & Native M1 Support',
        content: 'Added 15 new gravity puzzle chambers and native Apple Silicon M1/M2 binary targets.',
        changes: ['15 new gravity puzzles added', 'Native Apple Silicon ARM64 compilation', 'Improved UI controller focus state']
      }
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'PuzzleMaster',
        rating: 5,
        date: '2025-10-15',
        comment: 'Brilliant spatial mechanics. The gravity shifts feel completely intuitive and natural!'
      }
    ],
    downloadsCount: 1650,
    likesCount: 280
  }
];
