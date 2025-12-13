<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type {
		BranchParams,
		BranchDom,
		MountainParams,
		SvgMountain,
		TurbulenceParams,
		DisplacementParams
	} from 'Types';
	import { SvJs, Gen } from 'svjs/src';
	import type { SvJs as SvJsType } from 'svjs';
	import type { AppStateType } from './AppState.svelte';
	import type { LightningStateType } from './LightningState.svelte';
	let container: HTMLDivElement;

	let appState: AppStateType = getContext('canvas');
	let lightningState: LightningStateType = getContext('lightning');

	onMount(() => {
		initLightning();
		const handleResize = () => {
			if (container) {
				container.innerHTML = '';
				initLightning();
			}
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	function createDistortionFilter(
		svg: SvJsType,
		id: string,
		turbulenceParams: TurbulenceParams,
		displacementParams: DisplacementParams
	) {
		const filter = svg.createFilter(id);
		filter.create('feTurbulence').set({ ...turbulenceParams, id: `turbulence-${id}` });
		filter.create('feDisplacementMap').set(displacementParams);
		return filter;
	}

	function createStars(svg: SvJsType, count: number) {
		const { innerWidth: width, innerHeight: height } = window;
		for (let i = 0; i < count; i++) {
			svg.create('circle').set({
				cx: Gen.random(0, width),
				cy: Gen.random(0, height),
				r: Gen.random(0.5, 1.5),
				fill: 'white',
				opacity: Gen.random(0.1, 0.8)
			});
		}
	}

	function createMountains(svg: SvJsType) {
		function createMountain(
			svg: SvJsType,
			params: MountainParams,
			filterUrl: string = ''
		): SvJsType {
			const points: Array<[number, number]> = [];

			const { numberOfPeaks, valleyYPosition, distanceBetweenValleyPeak, color } = params;

			const dh = distanceBetweenValleyPeak; // vertical distance between peaks
			const vh = window.innerHeight;
			const y2 = valleyYPosition; // valley y position
			const y1 = y2 - dh; // peak y position
			const w = window.innerWidth / (numberOfPeaks * 2); // horizontal distance between peaks and valleys

			let x = 0;
			for (let i = 0; i < 2 * numberOfPeaks + 1; i++) {
				const px = x;
				const py = i % 2 !== 0 ? y1 : y2;
				points.push([px, py]);
				x += w;
			}

			const closingPoints = [
				[points[points.length - 1][0], points[points.length - 1][1] + vh],
				[points[0][0], points[0][1] + vh]
			];

			let closingD = '';
			for (const pt of closingPoints) {
				closingD += ` L${pt[0]},${pt[1]}`;
			}

			const group = svg.create('g');
			const mountainShape = group.createCurve(points, 1);
			mountainShape.set({
				fill: color,
				d: mountainShape.element.getAttribute('d') + closingD,
				stroke: 'none',
				filter: filterUrl
			});

			const mountainFiller = group.create('rect');
			mountainFiller.set({
				x: 0,
				y: valleyYPosition * 1.01, // Going slightly below to avoid gaps due to application of filters
				width: window.innerWidth,
				height: vh - valleyYPosition,
				fill: color
			});

			return group;
		}

		const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
		const mountainLayers: MountainParams[] = [
			{
				numberOfPeaks: 3,
				distanceBetweenValleyPeak: 20,
				color: '#0D0D2D',
				valleyYPosition: windowHeight * 0.45,
				speed: 0.01
			}, // darkest, furthest
			{
				numberOfPeaks: 4,
				distanceBetweenValleyPeak: 40,
				color: '#1A1A38',
				valleyYPosition: windowHeight * 0.45 + 25,
				speed: 0.05
			}, // mid
			{
				numberOfPeaks: 2,
				distanceBetweenValleyPeak: 60,
				color: '#262643',
				valleyYPosition: windowHeight * 0.45 + 70,
				speed: 0.1
			} // closest, lightest
		];

		const svgMountains: SvgMountain[] = [];
		for (let i = 0; i < mountainLayers.length; i++) {
			const layer = mountainLayers[i];

			// Filter to distort mountains
			const turbulenceParams = {
				baseFrequency: 0.005,
				numOctaves: Gen.random(2, 5),
				stitchTiles: 'stitch',
				type: 'fractalNoise',
				result: 'noise'
			};
			const displacementParams = {
				in: 'SourceGraphic',
				in2: 'noise',
				scale: Gen.random(50, 100),
				result: 'ray'
			};
			createDistortionFilter(svg, `mountain-distortion-${i}`, turbulenceParams, displacementParams);

			// Create 2 group of mountains to scroll even - odd - even - odd
			const evenMountains = createMountain(svg, layer, `url(#mountain-distortion-${i})`);
			const oddMountains = createMountain(svg, layer, `url(#mountain-distortion-${i})`);
			evenMountains.set({ transform: `translate(0,0)` });
			oddMountains.set({ transform: `translate(${windowWidth},0)` });
			svgMountains.push({ evenMountains, oddMountains });
		}

		// Animate for continuous scrolling
		const positionsX: Array<{ evenX: number; oddX: number }> = [];
		for (let i = 0; i < mountainLayers.length; i++) {
			positionsX.push({ evenX: 0, oddX: windowWidth });
		}

		function animateMountains() {
			for (let i = 0; i < mountainLayers.length; i++) {
				const layer = svgMountains[i];
				const evenMountains = layer.evenMountains;
				const oddMountains = layer.oddMountains;
				const speed = mountainLayers[i].speed;

				positionsX[i].evenX -= speed;
				positionsX[i].oddX -= speed;

				// When a group moves out of view, jump it to the right of the other group
				if (positionsX[i].evenX <= -windowWidth) {
					positionsX[i].evenX = positionsX[i].oddX + windowWidth;
				}
				if (positionsX[i].oddX <= -windowWidth) {
					positionsX[i].oddX = positionsX[i].evenX + windowWidth;
				}

				evenMountains?.set({ transform: `translate(${positionsX[i].evenX},0)` });
				oddMountains?.set({ transform: `translate(${positionsX[i].oddX},0)` });
			}
			requestAnimationFrame(animateMountains);
		}

		animateMountains();
	}

	function initLightning() {
		if (!container || !SvJs) return;
		// Boilerplate
		const svg = new SvJs().addTo(container);
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
			BACKGROUND_GRADIENT_END: '#222244',
			BOLT: '#ffffff'
		};

		// Create a vertical linear gradient for the background
		const bgGradient = svg.create('linearGradient').set({
			id: 'bgGradient',
			x1: 0,
			y1: 0,
			x2: 0,
			y2: 1
		});
		bgGradient.create('stop').set({
			offset: '0%',
			'stop-color': COLORS.BACKGROUND,
			'stop-opacity': 1
		});
		bgGradient.create('stop').set({
			offset: '50%',
			'stop-color': COLORS.BACKGROUND_GRADIENT_END, // lighter shade at the bottom
			'stop-opacity': 1
		});
		svg.create('rect').set({
			x: 0,
			y: 0,
			width: viewBoxWidth,
			height: viewBoxHeight,
			fill: 'url(#bgGradient)'
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
		const rayInnerFilterName = 'ray-distortion';
		createDistortionFilter(svg, rayInnerFilterName, turbulenceParams, displacementParams);

		// Filter in the outter part of the bolt. It distorts and blurs
		// the glow of the bolt to create the feel of a glowing lightning
		// bolt
		const rayOuterFilterName = 'ray-blur';
		const filterOut = createDistortionFilter(
			svg,
			rayOuterFilterName,
			turbulenceParams,
			displacementParams
		);
		filterOut.create('feGaussianBlur').set({
			in: 'ray',
			stdDeviation: 10
		});

		/* Creates a branch and its sub-branches recursively
		 * Params:
		 *  branchParams: BranchParams containing parameters for the branch
		 *  branchLevels: number - current level of the branch
		 *  svgGroup: SvJsType - SVG group to add the branch lines
		 *  svgGlowGroup: SvJsType - SVG group to add the glow lines
		 *  branches: BranchDom[] - array to store branch data for animation
		 */
		function createBranch(
			branchParams: BranchParams,
			branchLevels: number,
			svgGroup: SvJsType,
			svgGlowGroup: SvJsType,
			branches: BranchDom[]
		) {
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
				fill: 'none'
			};
			const svgGlowElement = svgGlowGroup.create('line').set({
				...branchAttrs,
				stroke_width: 3 * width,
				stroke: lightningState.color,
				style: `stroke-dashArray: ${length} ${length}; stroke-dashOffset: ${length}`
			});
			branches.push({
				level: branchLevels,
				offset: length,
				updatedOffset: length,
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
		 *  branchParams: BranchParams containing parameters for the main branch
		 *  boltLevels: number - number of levels of branches in the bolt
		 */
		function createBolt(positionX: number, branchParams: BranchParams, boltLevels: number) {
			const rootGlowGroup = svg.create('g').set({
				filter: `url(#${rayOuterFilterName})`
			});
			const rootGroup = svg.create('g').set({
				filter: `url(#${rayInnerFilterName})`
			});

			let branches: BranchDom[] = [];

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
								br.svgElement?.set({
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
		function lightSky(pointX: number) {
			// Create a radial gradient
			const radialGradient = svg.create('radialGradient').set({
				id: 'skyGradient',
				cx: pointX / viewBoxWidth,
				cy: 0,
				r: 2
			});
			radialGradient
				.create('stop')
				.set({ offset: '10%', 'stop-color': lightningState.color, 'stop-opacity': 0.4 });
			radialGradient
				.create('stop')
				.set({ offset: '50%', 'stop-color': lightningState.color, 'stop-opacity': 0.05 });
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

		svg.addEventListener('mouseleave', () => {
			appState.setShowInstructions(true);
		});

		svg.addEventListener('pointerdown', (e: PointerEvent) => {
			appState.setShowInstructions(false);
			if (!appState.isMuted) {
				// Play lightning sound
				const audio = new Audio('/sound/lightning-strike.mp3');
				audio.volume = 0.1;
				audio.currentTime = 0;
				audio.play();
			}

			// Update turbulence filter to get different patterns
			const seed = Gen.random(10, 20);
			const feNodeDistortion = document.getElementById(`turbulence-${rayInnerFilterName}`);
			feNodeDistortion?.setAttribute('seed', seed);
			const feNodeBlur = document.getElementById(`turbulence-${rayOuterFilterName}`);
			feNodeBlur?.setAttribute('seed', seed);

			let endPoint = new DOMPoint();
			endPoint.x = e.clientX;
			endPoint.y = e.clientY;
			const ctm = svg?.element.getScreenCTM();
			if (ctm) {
				endPoint = endPoint.matrixTransform(ctm.inverse());
			}

			const branchParams: BranchParams = {
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

		createStars(svg, 100);
		createMountains(svg);
	}
</script>

<div id="container" bind:this={container}></div>
