(
    function init() {
        let CLEAR_COLOR = new THREE.Color(0x000000); 
        let SKYBOX_NAME = 'corona';
        // set up renderer
        let canvas = document.getElementById('background');
        [canvas.width, canvas.height]  = [window.innerWidth, window.innerHeight];
        let renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            // antialias: true,
            alpha: false
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // set up scene
        let scene = new THREE.Scene();
        scene.background = CLEAR_COLOR;
        scene.autoClear = true;
            
        // set up camera
        let camera = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            45,
            3000
        );
        camera.position.set(0, 0, 0);
        camera.lookAt(new THREE.Vector3(0,-1,0))
        camera.updateProjectionMatrix();

        // set up skybox
        let skyGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        
        function createMaterialArray() {
            let skyboxPaths = ['right', 'left', 'top','bot', 'front', 'back'].map(side => {
                return `front-end/background-images/bkg1_${side}.png`
            });
            let materialArray = skyboxPaths.map(path => {
                let texture = new THREE.TextureLoader().load(path);
                return new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide})
            });
            return materialArray;
        }
        let skyboxMaterials = createMaterialArray();
        let skybox = new THREE.Mesh(skyGeometry, skyboxMaterials);
        scene.add(skybox)
        
        function animate() {
            skybox.rotation.z += 0.001;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();
    }
)();