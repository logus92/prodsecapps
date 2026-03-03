// ProdSecApps - The Kubernetes Data Stream Visual
// Concepts: Flow, Pipeline, Tiers, Scanning

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// Fog for depth (The "Dark Mode" fade effect)
scene.fog = new THREE.FogExp2(0x050a14, 0.03);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// --- 1. THE GRID (The Infrastructure Layer) ---
const gridHelper = new THREE.GridHelper(100, 50, 0x00f0ff, 0x112233);
gridHelper.position.y = -2;
scene.add(gridHelper);

// --- 2. THE SCANNING RINGS (The ARC Engine) ---
const ringsGroup = new THREE.Group();
scene.add(ringsGroup);

for (let i = 0; i < 5; i++) {
    const geometry = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(geometry, material);
    ring.position.z = -10 - (i * 15);
    ringsGroup.add(ring);
}

// --- 3. THE APPS (Floating Cubes Stream) ---
// We create cubes representing different app tiers (Green, Cyan, Purple)
const cubeGroup = new THREE.Group();
scene.add(cubeGroup);

const cubes = [];
const colors = [0x0aff60, 0x00f0ff, 0xbc13fe]; // Tier 3, Tier 2, Tier 1 colors

for (let i = 0; i < 40; i++) {
    const size = Math.random() * 0.4 + 0.2;
    const geometry = new THREE.BoxGeometry(size, size, size);
    
    // Wireframe for tech look
    const material = new THREE.MeshBasicMaterial({ 
        color: colors[Math.floor(Math.random() * colors.length)], 
        wireframe: true 
    });
    
    const cube = new THREE.Mesh(geometry, material);
    
    // Random Start Positions
    cube.position.x = (Math.random() - 0.5) * 15;
    cube.position.y = (Math.random() - 0.5) * 6;
    cube.position.z = -Math.random() * 60; // Spread deep into Z
    
    // Store animated properties
    cube.userData = {
        speed: Math.random() * 0.1 + 0.05,
        rotSpeed: Math.random() * 0.02
    };
    
    cubes.push(cube);
    cubeGroup.add(cube);
}

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// --- CAMERA POSITION ---
camera.position.z = 5;

// --- MOUSE INTERACTION (Parallax) ---
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);

    // 1. Move Cubes (The Stream)
    cubes.forEach(cube => {
        cube.position.z += cube.userData.speed; // Move forward
        cube.rotation.x += cube.userData.rotSpeed;
        cube.rotation.y += cube.userData.rotSpeed;

        // Reset if it passes the camera
        if (cube.position.z > 5) {
            cube.position.z = -50;
            cube.position.x = (Math.random() - 0.5) * 15;
            cube.position.y = (Math.random() - 0.5) * 6;
        }
    });

    // 2. Rotate Rings (The Scanners)
    ringsGroup.children.forEach((ring, idx) => {
        ring.rotation.z += 0.005 * (idx % 2 === 0 ? 1 : -1); // Alternate rotation
    });

    // 3. Move Grid for speed illusion
    gridHelper.position.z += 0.05;
    if(gridHelper.position.z > 2) gridHelper.position.z = 0;

    // 4. Parallax Camera
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -20); // Always look down the pipeline

    renderer.render(scene, camera);
}

animate();

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
