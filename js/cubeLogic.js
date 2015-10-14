var camera, scene, renderer;
var mesh, group;
var leds = [];

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer();

    camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);
    camera.position.z = 400;

    var domElement = document.getElementById("model");

    scene = new THREE.Scene();
    var controls = new THREE.OrbitControls( camera, domElement );
    controls.addEventListener( 'change', render );
    group = new THREE.Object3D();
    group.rotation.y = Math.PI /2.0;

    for (var i = 0; i<3; i++){
        for(var j=0; j<3; j++){
            for(var k =0; k<3; k++){
                var geometry = new THREE.SphereGeometry( 10, 32, 32 );
                var material = new THREE.MeshBasicMaterial({color:(i+1)*20+256*20*(j+1)+256*20*(k+1)});

                mesh = new THREE.Mesh(geometry, material);
                mesh.position.y = 100 - i*100;
                mesh.position.x = 100 - j*100;
                mesh.position.z = k*100 - 100;
                group.add(mesh);
                leds.push(mesh);
            }
        }
    }

    scene.add(group);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(300, 300);
    document.getElementById("model").appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    //group.rotation.x += 0.005;
    //group.rotation.y += 0.01;
    //console.log(group.rotation.y);

    renderer.render(scene, camera);

}

function render(){
    renderer.render( scene, camera );
}