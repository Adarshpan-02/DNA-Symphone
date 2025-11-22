// Configuration
        const CONFIG = {
            colors: {
                A: 0xff4444,
                T: 0xffaa00,
                G: 0x44ff44,
                C: 0xff44ff
            },
            notes: {
                A: 261.63,
                T: 329.63,
                G: 392.00,
                C: 440.00
            }
        };

        // State
        let scene, camera, renderer, dnaGroup;
        let baseMeshes = [];
        let isPlaying = false;
        let currentIndex = 0;
        let audioContext = null;
        let playbackInterval = null;
        let tempo = 120;
        let sequence = 'ATGCATGCATGCATGCATGC';
        let mouseDown = false;
        let mouseX = 0, mouseY = 0;

        // Initialize scene
        function init() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);

            camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 18);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.getElementById('canvas-container').appendChild(renderer.domElement);

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
            light1.position.set(5, 5, 5);
            scene.add(light1);

            const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
            light2.position.set(-5, -5, -5);
            scene.add(light2);

            buildDNA();
            setupControls();
            
            window.addEventListener('resize', onResize);
            
            document.getElementById('loading').style.display = 'none';
            animate();
        }

        function buildDNA() {
            if (dnaGroup) {
                scene.remove(dnaGroup);
            }

            dnaGroup = new THREE.Group();
            baseMeshes = [];

            const radius = 2.5;
            const spacing = 0.6;
            const pairs = Math.min(sequence.length, 50);

            for (let i = 0; i < pairs; i++) {
                const angle = (i / pairs) * Math.PI * 3;
                const y = i * spacing - (pairs * spacing) / 2;

                const base = sequence[i] || 'A';
                const complement = base === 'A' ? 'T' : base === 'T' ? 'A' : base === 'G' ? 'C' : 'G';

                const x1 = Math.cos(angle) * radius;
                const z1 = Math.sin(angle) * radius;
                const x2 = -x1;
                const z2 = -z1;

                baseMeshes.push(createBase(x1, y, z1, base, i));
                baseMeshes.push(createBase(x2, y, z2, complement, i));

                createCylinder(x1, y, z1, x2, y, z2, 0.08, 0x444444);

                if (i < pairs - 1) {
                    const nextAngle = ((i + 1) / pairs) * Math.PI * 3;
                    const nextY = (i + 1) * spacing - (pairs * spacing) / 2;
                    
                    createCylinder(x1, y, z1, Math.cos(nextAngle) * radius, nextY, Math.sin(nextAngle) * radius, 0.12, 0x666666);
                    createCylinder(x2, y, z2, -Math.cos(nextAngle) * radius, nextY, -Math.sin(nextAngle) * radius, 0.12, 0x666666);
                }
            }

            scene.add(dnaGroup);
        }

        function createBase(x, y, z, base, index) {
            const geo = new THREE.SphereGeometry(0.25, 16, 16);
            const mat = new THREE.MeshPhongMaterial({
                color: CONFIG.colors[base],
                emissive: CONFIG.colors[base],
                emissiveIntensity: 0,
                shininess: 30
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            mesh.userData = { index, base };
            dnaGroup.add(mesh);
            return mesh;
        }

        function createCylinder(x1, y1, z1, x2, y2, z2, radius, color) {
            const start = new THREE.Vector3(x1, y1, z1);
            const end = new THREE.Vector3(x2, y2, z2);
            const dir = new THREE.Vector3().subVectors(end, start);
            const length = dir.length();
            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

            const geo = new THREE.CylinderGeometry(radius, radius, length, 8);
            const mat = new THREE.MeshPhongMaterial({ color, transparent: true, opacity: 0.6 });
            const mesh = new THREE.Mesh(geo, mat);
            
            mesh.position.copy(mid);
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
            mesh.quaternion.copy(quaternion);
            
            dnaGroup.add(mesh);
        }

        function setupControls() {
            const canvas = renderer.domElement;

            canvas.addEventListener('mousedown', (e) => {
                mouseDown = true;
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            canvas.addEventListener('mousemove', (e) => {
                if (mouseDown) {
                    const dx = e.clientX - mouseX;
                    const dy = e.clientY - mouseY;
                    dnaGroup.rotation.y += dx * 0.005;
                    dnaGroup.rotation.x += dy * 0.005;
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                }
            });

            canvas.addEventListener('mouseup', () => mouseDown = false);
            canvas.addEventListener('mouseleave', () => mouseDown = false);

            canvas.addEventListener('wheel', (e) => {
                e.preventDefault();
                camera.position.z += e.deltaY * 0.01;
                camera.position.z = Math.max(8, Math.min(35, camera.position.z));
            }, { passive: false });

            canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
            canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        }

        let touchStartX = 0, touchStartY = 0;

        function handleTouchStart(e) {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }

        function handleTouchMove(e) {
            e.preventDefault();
            if (e.touches.length === 1) {
                const dx = e.touches[0].clientX - touchStartX;
                const dy = e.touches[0].clientY - touchStartY;
                dnaGroup.rotation.y += dx * 0.005;
                dnaGroup.rotation.x += dy * 0.005;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }

        function animate() {
            requestAnimationFrame(animate);

            if (isPlaying) {
                dnaGroup.rotation.y += 0.003;
            }

            baseMeshes.forEach((mesh, idx) => {
                const baseIdx = Math.floor(idx / 2);
                const active = baseIdx === currentIndex;
                const scale = active ? 1.4 : 1.0;
                mesh.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);
                mesh.material.emissiveIntensity = active ? 0.6 : 0;
            });

            renderer.render(scene, camera);
        }

        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function playSound(base) {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            const freq = CONFIG.notes[base];
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.frequency.value = freq;
            osc.type = 'sine';

            gain.gain.setValueAtTime(0, audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.start();
            osc.stop(audioContext.currentTime + 0.3);
        }

        function togglePlay() {
            isPlaying = !isPlaying;
            const btn = document.getElementById('play-btn');
            const stat = document.getElementById('status-stat');

            if (isPlaying) {
                btn.textContent = 'Pause';
                stat.textContent = 'Playing';
                startPlayback();
            } else {
                btn.textContent = 'Play';
                stat.textContent = 'Paused';
                stopPlayback();
            }
        }

        function startPlayback() {
            if (playbackInterval) clearInterval(playbackInterval);
            playbackInterval = setInterval(() => {
                if (sequence.length > 0) {
                    playSound(sequence[currentIndex]);
                    currentIndex = (currentIndex + 1) % sequence.length;
                }
            }, (60 / tempo) * 1000);
        }

        function stopPlayback() {
            if (playbackInterval) {
                clearInterval(playbackInterval);
                playbackInterval = null;
            }
        }

        function reset() {
            isPlaying = false;
            currentIndex = 0;
            stopPlayback();
            document.getElementById('play-btn').textContent = 'Play';
            document.getElementById('status-stat').textContent = 'Paused';
        }

        function updateSequence(seq) {
            sequence = seq.toUpperCase().replace(/[^ATGC]/g, '');
            document.getElementById('sequence-input').value = sequence;
            document.getElementById('length-stat').textContent = sequence.length;
            reset();
            buildDNA();
        }

        function randomSequence() {
            const bases = ['A', 'T', 'G', 'C'];
            const len = 20 + Math.floor(Math.random() * 30);
            updateSequence(Array.from({ length: len }, () => bases[Math.floor(Math.random() * 4)]).join(''));
        }

        function loadPreset(seq) {
            updateSequence(seq);
        }

        // Event listeners
        document.getElementById('play-btn').onclick = togglePlay;
        document.getElementById('reset-btn').onclick = reset;
        document.getElementById('random-btn').onclick = randomSequence;
        document.getElementById('sequence-input').oninput = (e) => updateSequence(e.target.value);
        document.getElementById('tempo-slider').oninput = (e) => {
            tempo = parseInt(e.target.value);
            document.getElementById('tempo-value').textContent = tempo;
            if (isPlaying) {
                stopPlayback();
                startPlayback();
            }
        };

        window.onload = init;