import type { MountainParams, MountainSvg } from '@types';
import type { SvJs as SvJsType } from 'svjs';
import { Gen } from 'svjs/src';
import createDistortionFilter from './createDistortionFilter';

function createMountain(svg: SvJsType, params: MountainParams, filterUrl: string = ''): SvJsType {
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

export default function paintMountains(svg: SvJsType) {
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

	const MountainSvgs: MountainSvg[] = [];
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
		MountainSvgs.push({ evenMountains, oddMountains });
	}

	// Animate for continuous scrolling
	const positionsX: Array<{ evenX: number; oddX: number }> = [];
	for (let i = 0; i < mountainLayers.length; i++) {
		positionsX.push({ evenX: 0, oddX: windowWidth });
	}

	function animateMountains() {
		for (let i = 0; i < mountainLayers.length; i++) {
			const layer = MountainSvgs[i];
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
