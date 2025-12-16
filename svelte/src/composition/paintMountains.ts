import type { MountainParams } from '@types';
import type { SvJs as SvJsType } from 'svjs';
import { Gen } from 'svjs/src';
import { createNoise2D } from 'simplex-noise';
import createDistortionFilter from './createDistortionFilter';

function createMountain(
	svg: SvJsType,
	params: MountainParams,
	canvasDimensions: { width: number; height: number }
): SvJsType {
	const noise = createNoise2D();
	const points: Array<[number, number]> = [];
	const waveStep = canvasDimensions.width / params.segments;
	let d = '';
	for (let i = 0; i <= params.segments; i++) {
		const x = i * waveStep;
		const noiseValue = noise(x * 0.005, 0);
		let y =
			noiseValue *
			params.distanceBetweenValleyPeak *
			Math.sin(x * ((2 * Math.PI) / canvasDimensions.width) * params.numberOfPeaks);
		y = y + params.valleyYPosition - params.distanceBetweenValleyPeak / 2;

		// add jagginess
		const jaggedness = (noise(x * 0.05, 100) + 1) / 2; // normalize to [0,1]
		y += (jaggedness - 0.5) * 8;

		points.push([x, y]);

		d += i === 0 ? `M${x},${y}` : ` L ${x} ${y}`;
	}

	const closingPoints = [
		[points[points.length - 1][0], points[points.length - 1][1] + canvasDimensions.height],
		[points[0][0], points[0][1] + canvasDimensions.height]
	];

	let closingD = '';
	for (const pt of closingPoints) {
		closingD += ` L${pt[0]},${pt[1]}`;
	}

	const group = svg.create('g');
	const mountainShape = group.create('path');
	mountainShape.set({
		fill: params.color,
		d: d + closingD,
		stroke: 'none'
	});

	return group;
}

export default function paintMountains(
	svg: SvJsType,
	canvasDimensions: { width: number; height: number },
	mountainsParams: MountainParams,
	id: string
): () => void {
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

	createDistortionFilter(svg, `mountain-distortion-${id}`, turbulenceParams, displacementParams);

	// Create 2 group of mountains to scroll even - odd - even - odd
	const evenMountains = createMountain(svg, mountainsParams, canvasDimensions);
	const oddMountains = createMountain(svg, mountainsParams, canvasDimensions);
	evenMountains.set({ transform: `translate(0,0)` });
	oddMountains.set({ transform: `translate(${canvasDimensions.width},0)` });

	let evenX = 0;
	let oddX = canvasDimensions.width;

	// Function to scroll mountains
	return function () {
		const speed = mountainsParams.speed;
		evenX -= speed;
		oddX -= speed;

		// When a group moves out of view, jump it to the right of the other group
		if (evenX <= -canvasDimensions.width) {
			evenX = oddX + canvasDimensions.width;
		}
		if (oddX <= -canvasDimensions.width) {
			oddX = evenX + canvasDimensions.width;
		}
		evenMountains?.set({ transform: `translate(${evenX},0)` });
		oddMountains?.set({ transform: `translate(${oddX},0)` });
	};
}
