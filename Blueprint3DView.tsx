import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Wall {
    id: number;
    start: [number, number, number];
    end: [number, number, number];
    thickness: number;
}

interface Blueprint3DViewProps {
    wallData: Wall[];
    extrusionHeight: number;
    landLength: number;
    landWidth: number;
}

const Blueprint3DView: React.FC<Blueprint3DViewProps> = ({ wallData, extrusionHeight, landLength, landWidth }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        console.log("3D Visualizer Initializing...", { wallCount: wallData.length, land: `${landLength}x${landWidth}` });

        const container = mountRef.current;
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 550;

        // 1. Scene Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#f2e9e4'); // Slight parchment/warm white

        // 2. Camera Setup
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
        const viewDistance = Math.max(landLength, landWidth) * 2;
        camera.position.set(viewDistance, viewDistance, viewDistance);
        camera.lookAt(landLength / 2, 0, landWidth / 2);

        // 3. Renderer Setup
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                preserveDrawingBuffer: true
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            container.appendChild(renderer.domElement);
        } catch (err) {
            console.error("WebGL Initialization failed", err);
            setError("WebGL not supported or initialization failed.");
            return;
        }

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(landLength / 2, 0, landWidth / 2);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.minDistance = 1;
        controls.maxDistance = 5000;
        // controls.maxPolarAngle = Math.PI / 2.1; 

        // 5. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
        hemiLight.position.set(0, 100, 0);
        scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(landLength * 1.5, 100, landWidth * 1.5);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 100;
        dirLight.shadow.camera.bottom = -100;
        dirLight.shadow.camera.left = -100;
        dirLight.shadow.camera.right = 100;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 500;
        dirLight.shadow.mapSize.set(2048, 2048);
        scene.add(dirLight);

        // 6. Foundation & Grid
        const groundGeo = new THREE.PlaneGeometry(landLength + 100, landWidth + 100);
        const groundMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.8 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(landLength / 2, -0.05, landWidth / 2);
        ground.receiveShadow = true;
        scene.add(ground);

        const plotGeo = new THREE.BoxGeometry(landLength, 0.2, landWidth);
        const plotMat = new THREE.MeshStandardMaterial({ color: '#94a3b8' });
        const plot = new THREE.Mesh(plotGeo, plotMat);
        plot.position.set(landLength / 2, -0.1, landWidth / 2);
        plot.receiveShadow = true;
        scene.add(plot);

        const grid = new THREE.GridHelper(Math.max(landLength, landWidth) + 100, 50, 0x4a4e69, 0xd1d5db);
        grid.position.set(landLength / 2, 0, landWidth / 2);
        scene.add(grid);

        // Axis helper for debugging
        const axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        // 7. Walls & Rooms
        let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;

        const wallMaterial = new THREE.MeshStandardMaterial({
            color: '#f8f9fa',
            roughness: 0.5,
            metalness: 0.1
        });

        wallData.forEach((wall) => {
            const start = new THREE.Vector3(...wall.start);
            const end = new THREE.Vector3(...wall.end);

            minX = Math.min(minX, start.x, end.x);
            maxX = Math.max(maxX, start.x, end.x);
            minZ = Math.min(minZ, start.z, end.z);
            maxZ = Math.max(maxZ, start.z, end.z);

            const distance = start.distanceTo(end);
            if (distance < 0.01) return;

            const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            mid.y += extrusionHeight / 2;

            const wallGeo = new THREE.BoxGeometry(distance, extrusionHeight, wall.thickness);
            const wallMesh = new THREE.Mesh(wallGeo, wallMaterial);
            wallMesh.position.copy(mid);

            const dir = new THREE.Vector3().subVectors(end, start).normalize();
            const angle = Math.atan2(dir.z, dir.x);
            wallMesh.rotation.y = -angle;
            wallMesh.castShadow = true;
            wallMesh.receiveShadow = true;
            scene.add(wallMesh);
        });

        // 8. Roof removed per user request for interior viewing.

        // 9. Animation Loop
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // 10. Resize Handling
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // 11. Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (frameId) cancelAnimationFrame(frameId);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            scene.clear();
        };

    }, [wallData, extrusionHeight, landLength, landWidth]);

    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-10 text-center rounded-3xl">
                <p className="text-xl font-black mb-4">Rendering Error</p>
                <p className="text-sm text-slate-400">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-dwello-indigo rounded-xl text-xs font-bold"
                >
                    Reload Interface
                </button>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[550px] bg-dwello-parchment rounded-3xl overflow-hidden shadow-inner border border-dwello-lilac/20">
            <div ref={mountRef} className="w-full h-full" />
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                <span className="px-3 py-1 bg-dwello-indigo/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-white/20">
                    Neural 3D Synthesis Engine
                </span>
                <span className="px-3 py-1 bg-dwello-silk/80 backdrop-blur-md text-dwello-indigo text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm border border-dwello-indigo/10">
                    Status: Render Active
                </span>
            </div>
            <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-50">
                <p className="text-[8px] font-black text-dwello-indigo uppercase tracking-widest">Orbit: Left Click • Zoom: Scroll • Pan: Right Click</p>
            </div>
        </div>
    );
};

export default Blueprint3DView;
