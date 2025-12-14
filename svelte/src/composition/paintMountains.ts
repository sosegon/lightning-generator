import type { MountainParams } from '@types';
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
	const evenMountains = createMountain(svg, mountainsParams, `url(#mountain-distortion-${id})`);
	const oddMountains = createMountain(svg, mountainsParams, `url(#mountain-distortion-${id})`);
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
