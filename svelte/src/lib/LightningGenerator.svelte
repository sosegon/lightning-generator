<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type { AppStateType } from './AppState.svelte';
	let container: HTMLDivElement;
	let svjsLoaded = false;
	let SvJs: any, Gen: any;

	let appState: AppStateType = getContext('canvas');

	onMount(async () => {
		// Dynamically import svjs from CDN
		const svjs = await import('https://cdn.jsdelivr.net/npm/svjs@1.0.2/+esm');
		SvJs = svjs.SvJs;
		Gen = svjs.Gen;
		svjsLoaded = true;
		initLightning();
	});

	function initLightning() {
		if (!container || !SvJs) return;
		// Boilerplate
		const svg = new SvJs().addTo(document.getElementById('container'));
		const svgSize = Math.min(window.innerHeight, window.innerWidth);
		const { innerHeight: viewBoxHeight, innerWidth: viewBoxWidth } = window;
		svg.set({
			x: 0,
			y: 0,
			width: viewBoxWidth,
			height: viewBoxHeight,
			viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
			id: 'svgBox'
		});

		// Colors
		const COLORS = {
			BACKGROUND: '#000000',
			GLOW: '#4444ff',
			BOLT: '#ffffff'
		};

		// Background
		svg.create('rect').set({
			x: 0,
			y: 0,
			width: viewBoxWidth,
			height: viewBoxHeight,
			fill: COLORS.BACKGROUND
		});

		// Filters
		const turbulenceParams = {
			baseFrequency: 0.005,
			numOctaves: 5,
			stitchTiles: 'stitch',
			type: 'fractalNoise',
			result: 'noise'
		};
		const displacementParams = {
			in: 'SourceGraphic',
			in2: 'noise',
			scale: 150,
			result: 'ray'
		};

		// Filter in the inner part of the bolt. It distorts the bolt
		// lines. It creates the look of a natural lightning bolt
		const filterIn = svg.createFilter('distortion');
		filterIn.create('feTurbulence').set({ ...turbulenceParams, id: 'turbulence-distortion' });
		filterIn.create('feDisplacementMap').set(displacementParams);

		// Filter in the outter part of the bolt. It distorts and blurs
		// the glow of the bolt to create the feel of a glowing lightning
		// bolt
		const filterOut = svg.createFilter('blur');
		filterOut.create('feTurbulence').set({ ...turbulenceParams, id: 'turbulence-blur' });
		filterOut.create('feDisplacementMap').set(displacementParams);
		filterOut.create('feGaussianBlur').set({
			in: 'ray',
			stdDeviation: 10
		});

		/* Creates a branch and its sub-branches recursively
		 * Params:
		 *  branchParams: Object containing parameters for the branch:
		 *    startPoint: {x, y} - starting point of the branch
		 *    length: number - length of the branch
		 *    angle: number - angle of the branch to tilt it
		 *    rotation: number - rotation of the branch
		 *    segments: number - number of segments in the branch
		 *    subBranchesLength: number - length of the sub-branches relative to the branch
		 *    width: number - width of the branch
		 *    widthReductionRate: number - rate at which the width reduces for sub-branches
		 *  branchLevels: number - current level of the branch
		 *  svgGroup: SvJs element - SVG group to add the branch lines
		 *  svgGlowGroup: SvJs element - SVG group to add the glow lines
		 *  branches: array - array to store branch data for animation
		 */
		function createBranch(branchParams, branchLevels, svgGroup, svgGlowGroup, branches) {
			const {
				startPoint,
				length,
				angle,
				rotation,
				segments,
				subBranchesLength,
				width,
				widthReductionRate
			} = branchParams;
			svgGroup.rotate(rotation, startPoint.x, startPoint.y);
			svgGlowGroup.rotate(rotation, startPoint.x, startPoint.y);
			const branchAttrs = {
				x1: startPoint.x,
				y1: startPoint.y,
				x2: startPoint.x,
				y2: startPoint.y + length,
				fill: 'none',
				className: branchLevels
			};
			const svgGlowElement = svgGlowGroup.create('line').set({
				...branchAttrs,
				stroke_width: 3 * width,
				stroke: COLORS.GLOW,
				style: `stroke-dashArray: ${length} ${length}; stroke-dashOffset: ${length}`
			});
			branches.push({
				level: branchLevels,
				offset: length,
				updatedOffset: length,
				className: branchLevels,
				svgElement: svgGlowElement
			});
			const svgElement = svgGroup.create('line').set({
				...branchAttrs,
				stroke_width: width,
				stroke: COLORS.BOLT,
				style: `stroke-dashArray: ${length} ${length}; stroke-dashOffset: ${length}`
			});
			branches.push({
				level: branchLevels,
				offset: length,
				updatedOffset: length,
				className: branchLevels,
				svgElement
			});
			if (branchLevels > 1) {
				for (let i = 1; i < segments; i++) {
					const deltaRotation = Gen.random(-rotation * 0.1, rotation * 0.1, true);
					createBranch(
						{
							startPoint: {
								x: startPoint.x,
								y: startPoint.y + (length / segments) * i
							},
							length: length * subBranchesLength,
							angle: angle,
							rotation:
								i % 2 === 0
									? angle + (rotation + deltaRotation)
									: angle - (rotation + deltaRotation),
							segments: segments,
							subBranchesLength: subBranchesLength,
							width: width * (1 - widthReductionRate),
							widthReductionRate
						},
						branchLevels - 1,
						svgGroup.create('g'),
						svgGlowGroup.create('g'),
						branches
					);
				}
			}
		}

		/* Creates a lightning bolt at a given position
		 * Params:
		 *  positionX: number - x position of the bolt
		 *  branchParams: Object containing parameters for the main branch
		 *  boltLevels: number - number of levels of branches in the bolt
		 */
		function createBolt(positionX, branchParams, boltLevels) {
			const rootGlowGroup = svg.create('g').set({
				filter: 'url(#blur)'
			});
			const rootGroup = svg.create('g').set({
				filter: 'url(#distortion)'
			});

			let branches = [];

			createBranch(branchParams, boltLevels, rootGroup, rootGlowGroup, branches);

			// Re-positions the bolt
			rootGroup.set({ transform: `translate(${positionX} 0)` });
			rootGlowGroup.set({ transform: `translate(${positionX} 0)` });

			function animate() {
				for (let i = boltLevels; i > 0; i--) {
					branches = branches.map((br) => {
						let newBr = { ...br };
						if (br.level === i) {
							const { offset, updatedOffset } = br;
							if (updatedOffset > 0) {
								const newUpdatedOffset = updatedOffset - offset / 7;
								br.svgElement.set({
									style: `stroke-dashArray: ${offset} ${offset}; stroke-dashOffset: ${newUpdatedOffset}`
								});
								newBr.updatedOffset = newUpdatedOffset;
							} else {
								newBr.svgElement?.delete();
								newBr.svgElement = null;
							}
						}
						return newBr;
					});
				}
				if (branches.every((br) => br.svgElement === null)) {
					rootGroup.delete();
					rootGlowGroup.delete();
					return;
				}
				requestAnimationFrame(animate);
			}

			animate();
		}

		/* Creates a light effect on the sky at a given x position
		 * Params:
		 *  pointX: number - x position of the light effect
		 */
		function lightSky(pointX) {
			// Create a radial gradient
			const radialGradient = svg.create('radialGradient').set({
				id: 'skyGradient',
				cx: pointX / viewBoxWidth,
				cy: 0,
				r: 2
			});
			radialGradient
				.create('stop')
				.set({ offset: '10%', 'stop-color': COLORS.GLOW, 'stop-opacity': 0.4 });
			radialGradient
				.create('stop')
				.set({ offset: '50%', 'stop-color': COLORS.GLOW, 'stop-opacity': 0.05 });
			// Create a rectangle with the gradient fill
			const lightCanvas = svg.create('rect');
			lightCanvas.set({
				x: 0,
				y: 0,
				width: viewBoxWidth,
				height: viewBoxHeight,
				fill: 'url(#skyGradient)'
			});

			function animateLight() {
				if (lightCanvas) {
					let currentOpacity = parseFloat(lightCanvas.get('fill-opacity') || '0.6');
					if (currentOpacity > 0) {
						currentOpacity -= 0.02;
						lightCanvas.set({ 'fill-opacity': currentOpacity });
					} else {
						radialGradient.delete();
						lightCanvas.delete();
						return;
					}
				}
				requestAnimationFrame(animateLight);
			}

			animateLight();
		}

		let svgDom = document.getElementById('svgBox');
		svg.addEventListener('mouseleave', (e: PointerEvent) => {
			appState.setShowInstructions(true);
		});
		svg.addEventListener('pointerdown', (e: PointerEvent) => {
			appState.setShowInstructions(false);
			if( !appState.isMuted ) {
				// Play lightning sound
				const audio = new Audio('/sound/lightning-strike.mp3');
				audio.volume = 0.1;
				audio.currentTime = 0;
				audio.play();
			} 

			// Update turbulence filter to get different patterns
			const seed = Gen.random(10, 20);
			const feNodeDistortion = document.getElementById('turbulence-distortion');
			feNodeDistortion.setAttribute('seed', seed);
			const feNodeBlur = document.getElementById('turbulence-blur');
			feNodeBlur.setAttribute('seed', seed);

			let endPoint = new DOMPoint();
			endPoint.x = e.clientX;
			endPoint.y = e.clientY;
			endPoint = endPoint.matrixTransform(svgDom.getScreenCTM().inverse());

			const branchParams = {
				startPoint: { x: 0, y: 0 },
				length: viewBoxHeight,
				angle: 0,
				rotation: Gen.random(20, 30),
				segments: Gen.random(3, 6),
				subBranchesLength: Gen.random(0.4, 0.6),
				width: 6,
				widthReductionRate: 0.4
			};

			createBolt(endPoint.x, branchParams, 3);
			lightSky(endPoint.x);
		});
	}
</script>

<div id="container" bind:this={container}></div>
