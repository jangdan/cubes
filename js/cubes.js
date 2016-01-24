var CAMERA_DISTANCE = Math.sqrt(625);

var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 10;

var MAXIMUM_DISTANCE_FROM_CENTER = CAMERA_DISTANCE - 1;



var scene = new THREE.Scene();


var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 2*CAMERA_DISTANCE);
//camera = new THREE.OrthographicCamera( window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20, 0.1, 1000 );
var cameraactualzoom = camera.zoom;
//scene.add(camera);

var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;

document.body.appendChild(renderer.domElement);



var geometry = new THREE.BoxGeometry(1, 1, 1);


for(i = 0; i < 150; ++i){

	var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF*Math.random() } );

	var cube = new THREE.Mesh(geometry, material);

	cube.castShadow = true;
	cube.receiveShadow = true;

	cube.position.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
	cube.position.multiplyScalar(Math.sqrt(Math.random()) *MAXIMUM_DISTANCE_FROM_CENTER);

	cube.rotation.x = Math.random(2*Math.PI);
	cube.rotation.y = Math.random(2*Math.PI);
	cube.rotation.z = Math.random(2*Math.PI);

	scene.add(cube);

}



var lamplight = new THREE.SpotLight(0xFFFFD0, 1);

lamplight.position.set(CAMERA_DISTANCE + 1, CAMERA_DISTANCE + 1, CAMERA_DISTANCE + 1);

lamplight.castShadow = true;

lamplight.shadowCameraNear = CAMERA_DISTANCE - 1;
lamplight.shadowCameraFar = 2*CAMERA_DISTANCE;

lamplight.shadowMapWidth = 4096;
lamplight.shadowMapHeight = 4096;


scene.add(lamplight);

//scene.add(new THREE.SpotLightHelper(lamplight));

//scene.add(new THREE.CameraHelper(lamplight.shadow));


var hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.5);
scene.add(hemisphereLight);




camera.position.z = CAMERA_DISTANCE;



function render(){

	requestAnimationFrame(render);

	scene.rotation.y += 0.005;

	camera.zoom += (cameraactualzoom - camera.zoom) * 0.1;
	camera.updateProjectionMatrix();

	renderer.render(scene, camera);

}



render();



window.addEventListener("resize", resize, false);

function resize(e){

	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}



window.addEventListener("mousewheel", mousewheel, false);

function mousewheel(e){

	cameraactualzoom += (e.wheelDelta || e.detail) * 0.005;
	if(cameraactualzoom < CAMERA_MINIMUM_ZOOM) cameraactualzoom = CAMERA_MINIMUM_ZOOM;
	else if(cameraactualzoom > CAMERA_MAXIMUM_ZOOM) cameraactualzoom = CAMERA_MAXIMUM_ZOOM;

	return false;

}