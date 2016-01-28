//1 unit = 1 cm

var G = 6.67408e1;



var CAMERA_DISTANCE = 25;

var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 100;


var CUBE_COUNT = 30;

var MAXIMUM_DISTANCE_FROM_CENTER = 100;



var scene = new Physijs.Scene( { reportsize: CUBE_COUNT } );
scene.setGravity(new THREE.Vector3(0, 0, 0));

scene.addEventListener("update", update);



var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 2*MAXIMUM_DISTANCE_FROM_CENTER);
//camera = new THREE.OrthographicCamera( window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20, 0.1, 1000 );

var cameraactualzoom = camera.zoom;

var cameraactualrotation = new THREE.Vector3();
cameraactualrotation.copy(camera.rotation);



var renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFFFFFF, 1);
renderer.shadowMap.enabled = true;
//renderer.shadowMapSoft = true;

document.body.appendChild(renderer.domElement);



var cubes = [];


for(i = 0; i < CUBE_COUNT; ++i){

	var s = 1;
	var geometry = new THREE.BoxGeometry(s, s, s);

	var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF*Math.random() } );

	var cube = new Physijs.BoxMesh(geometry, material, geometry.parameters.width * geometry.parameters.height * geometry.parameters.depth); //

	cube.castShadow = true;
	cube.receiveShadow = true;

	cube.position.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
	cube.position.multiplyScalar(Math.pow(Math.random(), 1.5) * MAXIMUM_DISTANCE_FROM_CENTER);

	cube.rotation.x = Math.random(2*Math.PI);
	cube.rotation.y = Math.random(2*Math.PI);
	cube.rotation.z = Math.random(2*Math.PI);

	cube.matrixAutoUpdate = false;

	scene.add(cube);
	cubes.push(cube);

}



var lamplight = new THREE.SpotLight(0xFFFFD0, 1);

lamplight.position.set(CAMERA_DISTANCE + 1, CAMERA_DISTANCE + 1, CAMERA_DISTANCE + 1);

lamplight.castShadow = true;

lamplight.shadowCameraNear = CAMERA_DISTANCE - 1;
lamplight.shadowCameraFar = 2*CAMERA_DISTANCE;

lamplight.shadowMapWidth = 256;
lamplight.shadowMapHeight = 256;


scene.add(lamplight);

//scene.add(new THREE.SpotLightHelper(lamplight));

//scene.add(new THREE.CameraHelper(lamplight.shadow));


var hemisphereLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.5);
scene.add(hemisphereLight);




camera.position.z = CAMERA_DISTANCE;



function render(){ //three.js

	requestAnimationFrame(render);


	camera.zoom += (cameraactualzoom - camera.zoom) * 0.1;

	camera.rotation.x += (cameraactualrotation.x - camera.rotation.x) * 0.01;
	camera.rotation.y += (cameraactualrotation.y - camera.rotation.y) * 0.01;

	camera.updateProjectionMatrix();


	renderer.render(scene, camera);

}

render();



function update(){

	scene.simulate(undefined, 1);


	for(i = 0; i < cubes.length; ++i){

		var iposition = cubes[i].position;
		var Gimass = G*cubes[i].mass;

		for(j = i+1; j < cubes.length; ++j){

			var f = new THREE.Vector3();
			f.subVectors(iposition, cubes[j].position);
			f.multiplyScalar(Gimass*cubes[j].mass/f.lengthSq());

			cubes[j].applyCentralForce(f);

			f.negate();
			cubes[i].applyCentralForce(f);

			//console.log(cubes[i].position.x, cubes[j].position.x);

		}

		cubes[i].updateMatrix();

	}

}

update();



window.addEventListener("resize", resize, false);

function resize(e){

	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}



window.addEventListener("mousemove", mousemove, false);

function mousemove(e){

	cameraactualrotation.y = -((e.clientX)/window.innerWidth - 0.5)*2*Math.PI;
	cameraactualrotation.x = -((e.clientY)/window.innerHeight - 0.5)*Math.PI;
	
}



window.addEventListener("mousewheel", mousewheel, false);

function mousewheel(e){

	cameraactualzoom += (e.wheelDelta || e.detail) * 0.005;
	if(cameraactualzoom < CAMERA_MINIMUM_ZOOM) cameraactualzoom = CAMERA_MINIMUM_ZOOM;
	else if(cameraactualzoom > CAMERA_MAXIMUM_ZOOM) cameraactualzoom = CAMERA_MAXIMUM_ZOOM;

	return false;

}