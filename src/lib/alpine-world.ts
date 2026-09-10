import * as THREE from "three";

/** One continuous flight across the Jungfrau–Mönch–Eiger massif. Units are km. */
export async function createAlpineWorld(signal?: AbortSignal) {
  const resources: { dispose: () => void }[] = [];
  let closed = false;
  const own = <T extends { dispose: () => void }>(resource: T) => {
    if (closed || signal?.aborted) {
      resource.dispose();
      throw new DOMException("Scene closed", "AbortError");
    }
    resources.push(resource);
    return resource;
  };
  const release = () => {
    closed = true;
    resources.splice(0).forEach((resource) => resource.dispose());
  };
  const response = async (url: string) => {
    const result = await fetch(url, { signal });
    if (!result.ok) throw new Error(`Scenery unavailable: ${url}`);
    return result;
  };
  const texture = async (url: string, color = true) => {
    const file = await response(url);
    const bitmap = await createImageBitmap(await file.blob(), {
      imageOrientation: "flipY",
      premultiplyAlpha: "none",
      colorSpaceConversion: "none",
    });
    own({ dispose: () => bitmap.close() });
    const result = own(new THREE.Texture(bitmap));
    result.flipY = false;
    if (color) result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 8;
    result.needsUpdate = true;
    return result;
  };
  try {
    const [buffer, metadata, aerial, normal, cloud, skyPhoto, rock] =
      await Promise.all([
        response("/scenery/swiss-alps.bin").then((r) => r.arrayBuffer()),
        response("/scenery/swiss-alps.json").then((r) => r.json()),
        texture("/scenery/swiss-alps-albedo.webp"),
        texture("/scenery/swiss-alps-normal.webp", false),
        texture("/scenery/cloud-bank.webp"),
        texture("/scenery/cloud-descent.webp"),
        texture("/scenery/alpine-rock.webp"),
      ]);
    signal?.throwIfAborted();
    const heights = new Uint16Array(buffer);
    const size: number = metadata.size;
    const width: number = metadata.widthKm;
    if (heights.length !== size * size) throw new Error("Invalid terrain grid");
    const sample = (x: number, z: number) => {
      const col = THREE.MathUtils.clamp(
        (x / width + 0.5) * (size - 1),
        0,
        size - 1,
      );
      const row = THREE.MathUtils.clamp(
        (z / width + 0.5) * (size - 1),
        0,
        size - 1,
      );
      const x0 = Math.floor(col),
        z0 = Math.floor(row);
      const x1 = Math.min(x0 + 1, size - 1),
        z1 = Math.min(z0 + 1, size - 1);
      return (
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(
            heights[z0 * size + x0],
            heights[z0 * size + x1],
            col - x0,
          ),
          THREE.MathUtils.lerp(
            heights[z1 * size + x0],
            heights[z1 * size + x1],
            col - x0,
          ),
          row - z0,
        ) / 1000
      );
    };
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#e5edf4");
    scene.fog = new THREE.Fog("#e5edf4", 4, 13);
    const geometry = own(
      new THREE.PlaneGeometry(
        width,
        width,
        innerWidth < 700 ? 640 : 1024,
        innerWidth < 700 ? 640 : 1024,
      ),
    );
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++)
      positions.setY(i, sample(positions.getX(i), positions.getZ(i)));
    geometry.computeVertexNormals();
    const material = own(
      new THREE.MeshStandardMaterial({
        map: aerial,
        normalMap: normal,
        normalMapType: THREE.ObjectSpaceNormalMap,
        roughness: 1,
        metalness: 0,
      }),
    );
    // The photograph already contains lighting. A restrained grade and broad
    // fill preserve crevasses instead of bleaching them with procedural snow.
    rock.wrapS = rock.wrapT = THREE.MirroredRepeatWrapping;
    material.onBeforeCompile = (shader) => {
      shader.uniforms.rockTexture = { value: rock };
      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 terrainPosition;",
        )
        .replace(
          "#include <begin_vertex>",
          "#include <begin_vertex>\nterrainPosition = position;",
        );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        "#include <common>\nuniform sampler2D rockTexture; varying vec3 terrainPosition;",
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
        #include <map_fragment>
        vec3 terrainNormal = normalize(texture2D(normalMap, vNormalMapUv).xyz * 2.0 - 1.0);
        vec3 weights = pow(abs(terrainNormal), vec3(4.0));
        weights /= dot(weights, vec3(1.0));
        vec3 p = terrainPosition * 2.0;
        vec3 rock = texture2D(rockTexture, p.yz).rgb * weights.x
          + texture2D(rockTexture, p.xz).rgb * weights.y
          + texture2D(rockTexture, p.xy).rgb * weights.z;
        float cliff = 1.0 - smoothstep(0.2, 0.65, terrainNormal.y);
        diffuseColor.rgb *= mix(1.0, 0.7 + dot(rock, vec3(0.667)), cliff * 0.5);
        float luminance = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(luminance), 0.38);
        diffuseColor.rgb = diffuseColor.rgb * vec3(1.12, 1.18, 1.26) + vec3(0.035, 0.045, 0.06);
      `,
      );
    };
    scene.add(new THREE.Mesh(geometry, material));
    scene.add(new THREE.HemisphereLight("#e5f0ff", "#92a0ae", 2.1));
    const sunlight = new THREE.DirectionalLight("#fff8eb", 1.5);
    sunlight.position.set(-5, 9, 5);
    scene.add(sunlight);

    skyPhoto.wrapS = THREE.MirroredRepeatWrapping;
    const skyMaterial = own(
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          skyPhoto: { value: skyPhoto },
          zenith: { value: new THREE.Color("#b9d5ee") },
          horizon: { value: new THREE.Color("#e5edf4") },
        },
        vertexShader: `varying vec3 direction;
        void main() { direction = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform sampler2D skyPhoto; uniform vec3 zenith; uniform vec3 horizon; varying vec3 direction;
        void main() {
          vec3 d = normalize(direction);
          vec3 color = mix(horizon, zenith, smoothstep(0.0, 0.65, d.y));
          vec2 skyUV = vec2(atan(d.z, d.x) / 3.14159265, 0.73 + clamp(d.y / 0.7, 0.0, 1.0) * 0.27);
          color = mix(color, texture2D(skyPhoto, skyUV).rgb, 0.6 * smoothstep(0.0, 0.2, d.y));
          float sun = pow(max(0.0, dot(d, normalize(vec3(-0.8, 0.4, 0.8)))), 12.0);
          color = mix(color, vec3(1.0, 0.98, 0.95), sun * 0.65);
          gl_FragColor = vec4(color, 1.0);
          #include <colorspace_fragment>
        }`,
      }),
    );
    const sky = new THREE.Mesh(
      own(new THREE.SphereGeometry(40, 32, 16)),
      skyMaterial,
    );
    scene.add(sky);

    const cloudGeometry = own(new THREE.PlaneGeometry(1, 1));
    const clouds: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] =
      [];
    // Low cloud banks stay below the flight, never serving as a screen dissolve.
    for (let index = 0; index < 22; index++) {
      const cloudMaterial = own(
        new THREE.MeshBasicMaterial({
          map: cloud,
          transparent: true,
          opacity: 0.7,
          depthWrite: false,
          side: THREE.DoubleSide,
          fog: true,
          toneMapped: false,
        }),
      );
      const mesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
      const angle = index * 2.399963;
      const radius = 4.5 + (index % 4) * 1.25;
      mesh.position.set(
        Math.cos(angle) * radius,
        2.55 + (index % 3) * 0.16,
        Math.sin(angle) * radius,
      );
      mesh.scale.set(6 + (index % 3), 3.5 + (index % 2) * 0.4, 1);
      clouds.push(mesh);
      scene.add(mesh);
    }
    const camera = new THREE.PerspectiveCamera(48, 1, 0.025, 65);
    const curve = (points: number[][]) =>
      new THREE.CatmullRomCurve3(
        points.map((p) => new THREE.Vector3(...p)),
        false,
        "catmullrom",
      );
    // Approach Jungfrau, round its eastern shoulder, follow the glacier to
    // Mönch, then pass Eiger and turn back across the whole ridge.
    const route = curve([
      [-3.8, 4.7, 4.1],
      [-2.9, 4.55, 3.6],
      [-0.55, 4.45, 2.6],
      [1.6, 4.4, 1.1],
      [3.3, 4.45, -0.8],
      [3.2, 4.4, -2.5],
      [1.0, 4.7, -4.0],
      [-1.7, 4.95, -3.6],
    ]);
    const gaze = curve([
      [-0.3, 4.15, -0.3],
      [-1.7, 4.05, 1.75],
      [-1.8, 3.9, 1.9],
      [0.45, 3.9, -0.35],
      [1.4, 3.8, -2.4],
      [1.1, 3.8, -2.4],
      [1.1, 3.7, -1.8],
      [0.25, 3.65, -0.5],
    ]);
    route.arcLengthDivisions = 2800;
    route.updateArcLengths();
    const target = new THREE.Vector3();
    // Experience, Work, Contact follow the visible ridges from highest to lowest.
    const desktopPins = [
      new THREE.Vector3(-1.81640625, 4.157, 1.92382813),
      new THREE.Vector3(-1.43554688, 3.972, 2.44140625),
      new THREE.Vector3(-2.86132813, 3.691, 1.34765625),
    ];
    const mobilePins = [
      desktopPins[0],
      new THREE.Vector3(-0.078125, 3.571, 0.71289063),
      new THREE.Vector3(-1.875, 3.398, 0.52734375),
    ];
    const projectedPin = new THREE.Vector3();
    const projectLandmarks = (width: number, height: number) => {
      camera.updateMatrixWorld();
      return (width / height < 1.05 ? mobilePins : desktopPins).map((point) => {
        projectedPin.copy(point).project(camera);
        return {
          x: ((projectedPin.x + 1) / 2) * width,
          y: ((1 - projectedPin.y) / 2) * height,
          visible:
            projectedPin.z > -1 &&
            projectedPin.z < 1 &&
            Math.abs(projectedPin.x) < 1 &&
            Math.abs(projectedPin.y) < 1,
        };
      });
    };
    const update = (progress: number) => {
      const t = route.getUtoTmapping(progress, 0);
      route.getPoint(t, camera.position);
      camera.position.y = Math.max(
        camera.position.y,
        sample(camera.position.x, camera.position.z) + 0.35,
      );
      gaze.getPoint(t, target);
      camera.lookAt(target);
      camera.rotateZ(Math.sin(progress * Math.PI * 2) * 0.018);
      sky.position.copy(camera.position);
      clouds.forEach((mesh) => mesh.quaternion.copy(camera.quaternion));
    };
    update(0);
    return { scene, camera, update, projectLandmarks, dispose: release };
  } catch (error) {
    release();
    throw error;
  }
}
