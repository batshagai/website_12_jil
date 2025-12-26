const SoundManager = {
    soundEnabled: true,
    audioContext: null,
    
    // Animal sound URLs unchanged
    animalSounds: {
        'Хулгана': 'sounds/A high-pitched mouse squeak, short and sharp, as if startled..wav',
        'Үхэр': 'sounds/mixkit-cow-moo-in-the-barn-1751.wav',
        'Бар': 'sounds/67357__bidone__tiger.mp3',
        'Туулай': 'sounds/Gentle rabbit squeak with a slightly high-pitched tone..wav',
        'Луу': 'sounds/4504__noisecollector__dragon1.wav',
        'Могой': 'sounds/snake-hissing-6092.mp3',
        'Морь': 'sounds/horse-neigh-261131.mp3',
        'Хонь': 'sounds/710298__michaelperfect__sheep-baaing-3-norwegian-sheep-expressing-itself-concisely.wav',
        'Бич': 'sounds/monkey-sound-295406.mp3',
        'Тахиа': 'sounds/mixkit-rooster-crowing-in-the-morning-2462.wav',
        'Нохой': 'sounds/free-dog-bark-419014.mp3',
        'Гахай': 'sounds/510974__krzpia__oink.wav'
    },

    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('AudioContext initialized');
        } catch (e) {
            console.warn('AudioContext failed to initialize:', e);
        }
        return this;
    },

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    },

    playClickSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.value = 800;
            osc.type = 'sine';
            gain.gain.value = 0.1;
            
            const now = this.audioContext.currentTime;
            osc.start(now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.stop(now + 0.1);
        } catch (e) {
            console.warn('Click sound failed:', e);
        }
    },

    playSuccessSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        try {
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, i) => {
                setTimeout(() => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.value = 0.2;
                    const now = this.audioContext.currentTime;
                    osc.start(now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.stop(now + 0.3);
                }, i * 150);
            });
        } catch (e) {
            console.warn('Success sound failed:', e);
        }
    },

    playErrorSound() {
        if (!this.soundEnabled || !this.audioContext) return;
        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.frequency.value = 200;
            osc.type = 'sawtooth';
            gain.gain.value = 0.15;
            const now = this.audioContext.currentTime;
            osc.start(now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.stop(now + 0.3);
        } catch (e) {
            console.warn('Error sound failed:', e);
        }
    },

    playAnimalSound(animalName) {
        if (!this.soundEnabled) return;
        const soundUrl = this.animalSounds[animalName];
        if (!soundUrl) {
            console.warn(`No sound mapped for animal: ${animalName}`);
            return;
        }
        try {
            const audio = new Audio(soundUrl);
            audio.volume = 0.8;
            audio.play().catch(err => {
                console.warn(`Animal sound failed for ${animalName}:`, err);
            });
        } catch (e) {
            console.warn(`Animal sound creation failed for ${animalName}:`, e);
        }
    }
};

// Initialize sound immediately
SoundManager.init();

// Add this right after SoundManager initialization
document.addEventListener('click', function initAudio() {
    // Modern browsers require user interaction to start audio
    SoundManager.init();
    document.removeEventListener('click', initAudio);
}, { once: true });

// Initia

document.getElementById('toggle-sound').addEventListener('click', (e) => {
    const enabled = SoundManager.toggleSound();
    e.target.textContent = enabled ? '🔊' : '🔈';
    e.target.classList.toggle('muted', !enabled);
    SoundManager.playClickSound();
});

const sectionCount = 12;
const radius = 200;

// Island data (unchanged)
const islandInfo = [
    { name: "Хулгана", description: "Эрдэнийн зүйлээр бөөлжөөд байдаг    Эрүү цагаан хулгана нэгэн жил.", model: "models/blue+mouse+3d+model.glb" },
    { name: "Үхэр", description: "Эвэр сүүл нь тэнцүүхэн байдаг    Эзэндээ ээлтэй үхэр хоёр жил.", model: "models/cartoon+cow+3d+model.glb" },
    { name: "Бар", description: "Арын модонд алаглаад байдаг   Алаг эрээн бар гурван жил.", model: "models/tiger+plush+toy+3d+model.glb" },
    { name: "Туулай", description: "Дэлхий дээгүүр дэгдээд байдаг   Дэлдэн чихтэй туулай дөрвөн жил.", model: "models/bunny+3d+model.glb" },
    { name: "Луу", description: "Хөх тэнгэрт хүржигнээд байдаг   Хүч ихтэй луу таван жил.", model: "models/blue+dragon+3d+model.glb" },
    { name: "Могой", description: "Цаг үргэлж цагриглаад байдаг   Цагаан эрээн могой зургаан жил.", model: "models/snake.glb" },
    { name: "Морь", description: "Холын газрыг товчлоод байдаг  Хомбон туурайтай морь долоон жил.", model: "models/horse.glb" },
    { name: "Хонь", description: "Хотгор газрыг хорголоор дүүргэдэг  Хотондоо ээлтэй хонь найман жил.", model: "models/cartoon+sheep+3d+model.glb" },
    { name: "Бич", description: "Харсан/Үзсэн бүхнээ элэглээд байдаг   Илбэчин эрдэмтэй бич есөн жил.", model: "models/monkey.glb" },
    { name: "Тахиа", description: "Үүрийн жингээр донгодоод байдаг   Эвэр хошуутай тахиа арван жил.", model: "models/cute+chick+3d+model.glb" },
    { name: "Нохой", description: "Хортон дайсныг хоргоогоод байдаг   Хон хон дуутай нохой арван нэгэн жил.", model: "models/cartoon+puppy+3d+model.glb" },
    { name: "Гахай", description: "Хөрст газрыг сэндийлээд байдаг  Хөндлөн соёотой гахай арван хоёр жил.", model: "models/pink+pig+3d+model.glb" }
];

// Build sections in circular arrangement
const sections = islandInfo.slice(0, sectionCount).map((info, i) => {
    const angle = (i / sectionCount) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 30;
    return {
        name: info.name,
        description: info.description,
        islandPos: { x, y, z },
        cameraPos: { x: x * 1.3, y: y + 15, z: z * 1.3 },
        cameraLookAt: { x, y, z },
        modelPath: info.model
    };
});

let modelsLoaded = 0;
const islandMeshes = [];
let animationStarted = false;

// THREE scene, camera, renderer
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1a2a6c, 0.005);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(sections[0].cameraPos.x, sections[0].cameraPos.y, sections[0].cameraPos.z);
camera.lookAt(sections[0].cameraLookAt.x, sections[0].cameraLookAt.y, sections[0].cameraLookAt.z);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(10, 15, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0xff6b6b, 3, 60);
pointLight1.position.set(-20, 10, -15);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffd700, 2.5, 50);
pointLight2.position.set(20, 8, 15);
scene.add(pointLight2);

// Stars and particles (reduced complexity)
function createPoints(count, spread, color, size) {
    const g = new THREE.BufferGeometry();
    const verts = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) verts[i] = (Math.random() - 0.5) * spread;
    g.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    const m = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.8 });
    return new THREE.Points(g, m);
}
const stars = createPoints(5000, 500, 0xffffff, 1.5);
scene.add(stars);

const particles = createPoints(400, 80, 0xffd700, 0.25);
particles.material.blending = THREE.AdditiveBlending;
scene.add(particles);

// Loader and helpers
const loader = new THREE.GLTFLoader();

function getAnimalColor(name) {
    const map = {
        'Хулгана': 0x8B4513, 'Үхэр': 0x696969, 'Бар': 0xFF8C00, 'Туулай': 0xFFE4B5,
        'Луу': 0xDC143C, 'Могой': 0x32CD32, 'Морь': 0x8B0000, 'Хонь': 0xF5F5F5,
        'Бич': 0xD2691E, 'Тахиа': 0xFFD700, 'Нохой': 0xA9A9A9, 'Гахай': 0xFFB6C1
    };
    return map[name] || 0xffffff;
}

function addMeshToScene(mesh, info, isGLB, idx) {
    mesh.position.set(info.islandPos.x, info.islandPos.y, info.islandPos.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const index = (typeof idx === 'number') ? idx : islandMeshes.length;
    mesh.userData = {
        index,
        baseY: info.islandPos.y,
        time: Math.random() * Math.PI * 2,
        spinSpeed: 0,
        name: info.name,
        description: info.description,
        isGLB: !!isGLB,
        proximityOffset: 0
    };
    // propagate userData to children so raycast hits on child meshes still have index/name
    mesh.traverse(child => {
        if (child !== mesh) child.userData = mesh.userData;
    });
    scene.add(mesh);
    islandMeshes[index] = { mesh, wireframe: null }; // place at fixed index (matches sections)
}

function createFallbackMesh(info) {
    // CHANGE THIS LINE - make all fallback meshes same big size
    const size = 10; // Same big size for all fallback animals
    const geom = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshStandardMaterial({
        color: getAnimalColor(info.name),
        roughness: 0.3,
        metalness: 0.2,
        emissive: getAnimalColor(info.name),
        emissiveIntensity: 0.8 // Increased emissive for better visibility
    });
    const mesh = new THREE.Mesh(geom, mat);
    const edges = new THREE.EdgesGeometry(geom);
    const wire = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffd700 }));
    mesh.add(wire);
    return mesh;
}

function createWireframes() {
    islandMeshes.forEach(item => {
        const box = new THREE.Box3().setFromObject(item.mesh);
        const size = box.getSize(new THREE.Vector3()).multiplyScalar(1.3);
        const geom = new THREE.BoxGeometry(size.x, size.y, size.z);
        const edges = new THREE.EdgesGeometry(geom);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffd700 }));
        line.position.copy(item.mesh.position);
        scene.add(line);
        item.wireframe = line;
    });
}

// Loading models with consolidated error handling
// Loading models with consolidated error handling
function loadModels() {
    sections.forEach((info, i) => {
        loader.load(
            info.modelPath,
            (gltf) => {
                const model = gltf.scene;
                // CHANGE THIS LINE - make all animals same big size
                const baseScale = 12; // Same big size for all animals
                model.scale.set(baseScale, baseScale, baseScale);
                model.traverse(child => {
                    if (child.isMesh && child.material) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material.emissive = new THREE.Color(0x333333);
                        child.material.emissiveIntensity = 0.3;
                    }
                });
                addMeshToScene(model, info, true, i);
                onModelLoaded(info.name);
            },
            undefined,
            () => {
                const fallback = createFallbackMesh(info);
                addMeshToScene(fallback, info, false, i);
                onModelLoaded(info.name + ' (fallback)');
            }
        );
    });
}

const loadingScreen = document.getElementById('loading-screen');
const loadingProgress = document.getElementById('loading-progress');
const loadingText = document.getElementById('loading-text');

function updateLoading(loaded, total, name = '') {
    const pct = Math.round((loaded / total) * 100);
    if (loadingProgress) loadingProgress.style.width = `${pct}%`;
    if (loadingText) loadingText.textContent = name ? `Ачааллаж байна: ${name}` : 'Тохируулж байна...';
}

function onModelLoaded(name) {
    modelsLoaded++;
    updateLoading(modelsLoaded, sections.length, name);
    if (modelsLoaded === sections.length) {
        createWireframes();
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
        if (!animationStarted) {
            animationStarted = true;
            animate();
        }
    }
}

loadModels();

// Raycaster + click
// Raycaster + click
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    raycaster.far = 1000;
    const intersects = raycaster.intersectObjects(islandMeshes.map(i => i.mesh), true);
    if (intersects.length) {
        const obj = intersects[0].object;
        if (obj.userData) {
            obj.userData.spinSpeed = (obj.userData.spinSpeed || 0) + 0.1;

            // ADD THIS LINE TO PLAY ANIMAL SOUND
            SoundManager.playAnimalSound(obj.userData.name);

            showIslandInfo(obj.userData.index);
        }
    }
});

// UI elements (unchanged binding logic)
const infoPanel = document.getElementById('info-panel');
const infoTitle = document.getElementById('info-title');
const infoDescription = document.getElementById('info-description');
const closeInfoButton = document.getElementById('close-info');
const showAllInfoButton = document.getElementById('show-all-info');
const allInfoModal = document.getElementById('all-info-modal');
const islandGrid = document.getElementById('island-grid');
const closeModalButton = document.getElementById('close-modal');

function showIslandInfo(idx) {
    if (!sections[idx]) return;
    infoTitle.textContent = sections[idx].name;
    infoDescription.textContent = sections[idx].description;
    infoPanel.classList.add('visible');
}
closeInfoButton.addEventListener('click', () => infoPanel.classList.remove('visible'));

showAllInfoButton.addEventListener('click', () => {
    islandGrid.innerHTML = '';
    sections.forEach(s => {
        const c = document.createElement('div');
        c.className = 'island-card';
        c.innerHTML = `<h3>${s.name}</h3><p>${s.description}</p>`;
        islandGrid.appendChild(c);
    });
    allInfoModal.classList.add('visible');
});
closeModalButton.addEventListener('click', () => allInfoModal.classList.remove('visible'));


// Game & quiz -- preserved behavior (bindings only)
const startGameButton = document.getElementById('start-game');
const gameModal = document.getElementById('game-modal');
const closeGameButton = document.getElementById('close-game');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreElement = document.getElementById('score');
const gameResult = document.getElementById('game-result');

const startQuizButton = document.getElementById('start-quiz');
const quizModal = document.getElementById('quiz-modal');
const closeQuizButton = document.getElementById('close-quiz');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const prevQuestionButton = document.getElementById('prev-question');
const nextQuestionButton = document.getElementById('next-question');

let score = 0, currentQuestionIndex = 0, currentQuizIndex = 0;

const gameQuestions = [
    { question: "Хулгана жилийн онцлог юу вэ?", options: ["Эрдэнийн зүйлээр бөөлжөөд байдаг", "Хүчтэй байдаг", "Ууланд амьдардаг", "Усанд сэлдэг"], correct: 0 },
    { question: "Үхэр хэдэн жилийн тэмдэгт вэ?", options: ["Нэгэн жил", "Хоёр жил", "Гурван жил", "Дөрвөн жил"], correct: 1 },
    { question: "Алаг эрээн бар хэдэн жилийн тэмдэгт вэ?", options: ["Нэгэн жил", "Хоёр жил", "Гурван жил", "Дөрвөн жил"], correct: 2 },
    { question: "Дэлдэн чихтэй туулай хэдэн жилийн тэмдэгт вэ?", options: ["Гурван жил", "Дөрвөн жил", "Таван жил", "Зургаан жил"], correct: 1 },
    { question: "Хүч ихтэй луу хэдэн жилийн тэмдэгт вэ?", options: ["Дөрвөн жил", "Таван жил", "Зургаан жил", "Долоон жил"], correct: 1 }
];

const quizQuestions = [
    { question: "12 жилийн эхний жил аль амьтанд тохирох вэ?", options: ["Хулгана", "Үхэр", "Бар", "Туулай"], correct: 0 },
    { question: "Хэд дэх жил нь могой жил бэ?", options: ["5 дахь жил", "6 дахь жил", "7 дахь жил", "8 дахь жил"], correct: 1 },
    { question: "Аль амьтны жилийг 'Хүч ихтэй луу' гэж тодорхойлдог вэ?", options: ["4 дэх жил", "5 дахь жил", "6 дахь жил", "7 дахь жил"], correct: 1 },
    { question: "Хэд дэх жил нь 'Хомбон тохирох морь' гэж нэрлэгддэг вэ?", options: ["5 дахь жил", "6 дахь жил", "7 дахь жил", "8 дахь жил"], correct: 2 },
    { question: "12 жилийн сүүлийн жил аль амьтанд тохирох вэ?", options: ["Нохой", "Гахай", "Тахиа", "Бич"], correct: 1 }
];

function loadGameQuestion() {
    if (currentQuestionIndex >= gameQuestions.length) {
        gameResult.textContent = `Тоглоом дууслаа! Таны оноо: ${score}/${gameQuestions.length}`;
        questionText.textContent = 'Тоглоом дууслаа!';
        optionsContainer.innerHTML = '';
        return;
    }
    const q = gameQuestions[currentQuestionIndex];
    questionText.textContent = q.question;
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-button';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            const btns = optionsContainer.querySelectorAll('button');
            btns.forEach((b, idx) => {
                b.classList.toggle('correct', idx === q.correct);
                b.classList.toggle('incorrect', idx === i && idx !== q.correct);
                b.disabled = true;
            });
            if (i === q.correct) { score++; scoreElement.textContent = score; SoundManager.playSuccessSound();
             } else {
                SoundManager.playErrorSound();
            }
            setTimeout(() => { currentQuestionIndex++; loadGameQuestion(); }, 1200);
        });
        optionsContainer.appendChild(btn);
    });
}

startGameButton.addEventListener('click', () => { score = 0; currentQuestionIndex = 0; scoreElement.textContent = score; gameResult.textContent = ''; loadGameQuestion(); gameModal.classList.add('visible'); });
closeGameButton.addEventListener('click', () => gameModal.classList.remove('visible'));

function loadQuizQuestion() {
    const q = quizQuestions[currentQuizIndex];
    quizQuestion.textContent = q.question;
    quizOptions.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            const btns = quizOptions.querySelectorAll('button');
            btns.forEach((b, idx) => {
                b.classList.toggle('correct', idx === q.correct);
                b.classList.toggle('incorrect', idx === i && idx !== q.correct);
                b.disabled = true;
            });

            // ADD SUCCESS/ERROR SOUNDS FOR QUIZ
            if (i === q.correct) {
                SoundManager.playSuccessSound();
            } else {
                SoundManager.playErrorSound();
            }
        });
        quizOptions.appendChild(btn);
    });
    prevQuestionButton.disabled = currentQuizIndex === 0;
    nextQuestionButton.disabled = currentQuizIndex === quizQuestions.length - 1;
}

startQuizButton.addEventListener('click', () => {
    currentQuizIndex = 0;
    currentQuestionElement.textContent = currentQuizIndex + 1;
    totalQuestionsElement.textContent = quizQuestions.length;
    loadQuizQuestion();
    quizModal.classList.add('visible');
});
closeQuizButton.addEventListener('click', () => quizModal.classList.remove('visible'));
prevQuestionButton.addEventListener('click', () => { if (currentQuizIndex > 0) { currentQuizIndex--; currentQuestionElement.textContent = currentQuizIndex + 1; loadQuizQuestion(); SoundManager.playClickSound();} });
nextQuestionButton.addEventListener('click', () => { if (currentQuizIndex < quizQuestions.length - 1) { currentQuizIndex++; currentQuestionElement.textContent = currentQuizIndex + 1; loadQuizQuestion(); SoundManager.playClickSound();} });

// Helpers: lerp, catmullRom spline utilities
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpVec(a, b, t, out) { out.x = lerp(a.x, b.x, t); out.y = lerp(a.y, b.y, t); out.z = lerp(a.z, b.z, t); }

function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t, t3 = t2 * t;
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2*p0 - 5*p1 + 4*p2 - p3) * t2 + (-p0 + 3*p1 - 3*p2 + p3) * t3);
}
function catmullRomVec(a, b, c, d, t, out) {
    out.x = catmullRom(a.x, b.x, c.x, d.x, t);
    out.y = catmullRom(a.y, b.y, c.y, d.y, t);
    out.z = catmullRom(a.z, b.z, c.z, d.z, t);
}

function getScrollProgress() {
    const sh = document.documentElement.scrollHeight - window.innerHeight;
    return sh <= 0 ? 0 : Math.min(Math.max(window.scrollY / sh, 0), 1);
}

function getSectionFromProgress(progress) {
    const max = Math.max(1, sections.length - 1);
    const raw = progress * max;
    const from = Math.floor(raw);
    const to = Math.min(from + 1, max);
    const p = raw - from;
    return { fromIndex: from, toIndex: to, progress: p };
}

function getSplinePosition(progress, target, points) {
    const count = points.length - 1;
    const scaled = progress * count;
    const section = Math.floor(scaled);
    const t = scaled - section;
    const p0 = points[Math.max(0, section - 1)];
    const p1 = points[section];
    const p2 = points[Math.min(count, section + 1)];
    const p3 = points[Math.min(count, section + 2)];
    catmullRomVec(p0, p1, p2, p3, t, target);
}

// Navigation UI
const navContainer = document.getElementById('navigation');
const titleElement = document.getElementById('title');
const scrollProgressBar = document.getElementById('scroll-progress');
// Add click sounds to all action buttons
document.getElementById('show-all-info').addEventListener('click', () => {
    SoundManager.playClickSound();
});

document.getElementById('start-game').addEventListener('click', () => {
    SoundManager.playClickSound();
});

document.getElementById('start-quiz').addEventListener('click', () => {
    SoundManager.playClickSound();
});

// Add click sounds to modal close buttons
document.getElementById('close-modal').addEventListener('click', () => {
    SoundManager.playClickSound();
});

document.getElementById('close-game').addEventListener('click', () => {
    SoundManager.playClickSound();
});

document.getElementById('close-quiz').addEventListener('click', () => {
    SoundManager.playClickSound();
});

document.getElementById('close-info').addEventListener('click', () => {
    SoundManager.playClickSound();
});

// Add click sounds to navigation buttons
document.addEventListener('DOMContentLoaded', function() {
    // This will add click sounds to nav buttons after they're created
    setTimeout(() => {
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                SoundManager.playClickSound();
            });
        });
    }, 1000);
});

sections.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'nav-button';
    btn.textContent = s.name;
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
        const top = (i / (sections.length - 1)) * (document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top, behavior: 'smooth' });
    });
    navContainer.appendChild(btn);
});

function updateActiveSection(idx) {
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach((b, i) => b.classList.toggle('active', i === idx));
    titleElement.textContent = sections[idx].name;
    titleElement.classList.remove('visible');
    setTimeout(() => titleElement.classList.add('visible'), 50);

    islandMeshes.forEach((item, i) => {
        const isActive = i === idx;
        item.mesh.traverse(child => {
            if (child.isMesh && child.material) child.material.emissiveIntensity = isActive ? 1.0 : 0.3;
        });
        // CHANGE THESE LINES - same big size for all, with slight active scaling
        const targetScale = isActive ? 15 : 14; // All animals big, active ones slightly bigger
        item.mesh.scale.set(targetScale, targetScale, targetScale);
    });
}

// Scroll handling
let targetCameraPos = new THREE.Vector3(), targetLookAt = new THREE.Vector3(), currentLookAt = new THREE.Vector3();
targetCameraPos.copy(sections[0].cameraPos);
targetLookAt.copy(sections[0].cameraLookAt);
currentLookAt.copy(sections[0].cameraLookAt);

const cameraPathPoints = sections.map(s => s.cameraPos);
const lookAtPathPoints = sections.map(s => s.islandPos);
let useSpline = true;

window.addEventListener('scroll', () => {
    const progress = getScrollProgress();
    if (scrollProgressBar) scrollProgressBar.style.height = (progress * 100) + '%';
    const { fromIndex, toIndex, progress: p } = getSectionFromProgress(progress);
    const activeIndex = p < 0.5 ? fromIndex : toIndex;
    updateActiveSection(activeIndex);

    if (useSpline && sections.length >= 4) {
        getSplinePosition(progress, targetCameraPos, cameraPathPoints);
        getSplinePosition(progress, targetLookAt, lookAtPathPoints);
    } else {
        lerpVec(sections[fromIndex].cameraPos, sections[toIndex].cameraPos, p, targetCameraPos);
        lerpVec(sections[fromIndex].cameraLookAt, sections[toIndex].cameraLookAt, p, targetLookAt);
    }

    islandMeshes.forEach((item, i) => {
        const dist = Math.abs(activeIndex - i);
        const prox = Math.max(0, 1 - dist / 2);
        item.mesh.userData.proximityOffset = prox * 0.5;
        const fade = Math.max(0.1, 1 - dist * 0.3);
        item.mesh.traverse(child => {
            if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = fade;
            }
        });
        if (item.wireframe) {
            item.wireframe.material.transparent = true;
            item.wireframe.material.opacity = fade;
        }
    });
}, { passive: true });

// Mouse parallax
let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
window.addEventListener('mousemove', e => {
    targetMouseX = e.clientX / window.innerWidth - 0.5;
    targetMouseY = e.clientY / window.innerHeight - 0.5;
});

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
const clock = new THREE.Clock();
const lerpSpeed = 0.025;
const mouseLerpSpeed = 0.05;

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    mouseX = lerp(mouseX, targetMouseX, mouseLerpSpeed);
    mouseY = lerp(mouseY, targetMouseY, mouseLerpSpeed);

    camera.position.x = lerp(camera.position.x, targetCameraPos.x + mouseX * 2.5, lerpSpeed);
    camera.position.y = lerp(camera.position.y, targetCameraPos.y - mouseY * 2.5, lerpSpeed);
    camera.position.z = lerp(camera.position.z, targetCameraPos.z, lerpSpeed);

    currentLookAt.x = lerp(currentLookAt.x, targetLookAt.x + mouseX * 3, lerpSpeed);
    currentLookAt.y = lerp(currentLookAt.y, targetLookAt.y - mouseY * 3, lerpSpeed);
    currentLookAt.z = lerp(currentLookAt.z, targetLookAt.z, lerpSpeed);
    camera.lookAt(currentLookAt);

    stars.rotation.y += 0.00005;
    stars.rotation.x = mouseY * 0.05;

    particles.rotation.y += 0.0003;
    particles.rotation.x = Math.sin(t * 0.2) * 0.1 + mouseY * 0.1;
    particles.position.x = mouseX * 5;
    particles.position.y = -mouseY * 5;

    islandMeshes.forEach(item => {
        if (!item?.mesh?.userData) return;

        item.mesh.userData.time += 0.008;
        const floatOffset = Math.sin(item.mesh.userData.time) * 0.3;
        const prox = item.mesh.userData.proximityOffset || 0;

        // Update mesh position
        item.mesh.position.y = item.mesh.userData.baseY + floatOffset + prox;

        // Update wireframe position to match
        if (item.wireframe) {
            item.wireframe.position.y = item.mesh.position.y;
        }

        // Handle spin animation
        if (item.mesh.userData.spinSpeed > 0) {
            item.mesh.rotation.y += item.mesh.userData.spinSpeed;
            if (item.wireframe) {
                item.wireframe.rotation.y = item.mesh.rotation.y;
            }
            item.mesh.userData.spinSpeed *= 0.98;
            if (item.mesh.userData.spinSpeed < 0.001) {
                item.mesh.userData.spinSpeed = 0;
            }
        }
    });

    renderer.render(scene, camera);
}

// Ensure credits modal can be opened/closed and is visible above canvas
(function(){
  const creditsModal = document.getElementById('credits-modal');
  const closeBtn = document.getElementById('close-credits');
  const showCreditsBtn = document.getElementById('show-credits');
  const showAllBtn = document.getElementById('show-all-info');

  if (!creditsModal) return;

  function showCredits() {
    creditsModal.classList.add('visible');
    creditsModal.style.display = 'flex';
    creditsModal.style.zIndex = '9999';
    try { SoundManager.playClickSound(); } catch(e) {}
  }
  function hideCredits() {
    creditsModal.classList.remove('visible');
    creditsModal.style.display = 'none';
    try { SoundManager.playClickSound(); } catch(e) {}
  }

  if (closeBtn) closeBtn.addEventListener('click', hideCredits);
  if (showCreditsBtn) showCreditsBtn.addEventListener('click', (e) => { e.preventDefault(); showCredits(); });
  // keep existing fallback: allow "show-all-info" to open credits if desired
  if (showAllBtn) showAllBtn.addEventListener('click', (e) => {
    // if all-info modal is used separately, avoid collision; only open credits when user intended
    // here we only open credits when explicit credits button not present:
    if (!showCreditsBtn) { e.preventDefault(); showCredits(); }
  });

  creditsModal.addEventListener('click', (e) => { if (e.target === creditsModal) hideCredits(); });

  if (!creditsModal.classList.contains('visible')) creditsModal.style.display = 'none';
})();