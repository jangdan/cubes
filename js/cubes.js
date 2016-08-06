
var G = 6.67408e1;




var CAMERA_DISTANCE = 25;

var CAMERA_MINIMUM_ZOOM = 1;
var CAMERA_MAXIMUM_ZOOM = 100;


var CUBE_COUNT = 25;

var MAXIMUM_DISTANCE_FROM_CENTER = 30;





var scene = new Physijs.Scene( { reportsize: CUBE_COUNT } );

scene.setGravity(new THREE.Vector3(0, 0, 0));


scene.addEventListener("update", update);





var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 1, 1000 );

camera.rotation.order = "YXZ";



var intendedcamera = {

	zoom: camera.zoom,

	rotation: new THREE.Vector3()

}


intendedcamera.rotation.copy(camera.rotation);



camera.position.z = CAMERA_DISTANCE;





var renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setClearColor(0xFFFFFF, 1);


document.body.appendChild(renderer.domElement);







var cubes = [];





var side = 1;





for(i = 0; i < CUBE_COUNT; ++i){

	var geometry = new THREE.BoxGeometry(side, side, side);

	var material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF * Math.random() } );


	var cube = new Physijs.BoxMesh( geometry, material, 1 );

	cube.castShadow = true;

	cube.receiveShadow = true;


	cube.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();

	cube.position.multiplyScalar(Math.pow(Math.random(), 1) * MAXIMUM_DISTANCE_FROM_CENTER);


	cube.rotation.x = Math.random( 2*Math.PI );
	cube.rotation.y = Math.random( 2*Math.PI );
	cube.rotation.z = Math.random( 2*Math.PI );


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







function render(){ //three.js

	requestAnimationFrame(render);





	camera.zoom += (intendedcamera.zoom - camera.zoom) * 0.1;



	camera.rotation.x += (intendedcamera.rotation.x - camera.rotation.x) * 0.01;
	camera.rotation.y += (intendedcamera.rotation.y - camera.rotation.y) * 0.01;


	if(intendedcamera.rotation.x > Math.PI) intendedcamera.rotation.x = Math.PI;
	else if(intendedcamera.rotation.x < -Math.PI) intendedcamera.rotation.x = -Math.PI;



	camera.updateProjectionMatrix();





	renderer.render(scene, camera);

}

render();





function update(){ //physijs

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

		}


		cubes[i].updateMatrix();

	}

}

update();







//events

window.addEventListener("resize", function(e){

	camera.aspect = window.innerWidth/window.innerHeight;


	camera.updateProjectionMatrix();



	renderer.setSize(window.innerWidth, window.innerHeight);

}, false);





window.addEventListener("mousemove", function(e){

	intendedcamera.rotation.x = (window.innerHeight/2 - e.clientY) * 0.005;
	intendedcamera.rotation.y = (window.innerWidth/2 - e.clientX) * 0.005;
	
}, false);





window.addEventListener("mousewheel", function(e){

	intendedcamera.zoom += (e.wheelDelta || e.detail) * 0.005;

	if(intendedcamera.zoom < CAMERA_MINIMUM_ZOOM) intendedcamera.zoom = CAMERA_MINIMUM_ZOOM;
	else if(intendedcamera.zoom > CAMERA_MAXIMUM_ZOOM) intendedcamera.zoom = CAMERA_MAXIMUM_ZOOM;


	return false;

}, false);