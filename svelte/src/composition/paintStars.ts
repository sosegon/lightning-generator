import { Gen } from 'svjs/src';
import type { SvJs as SvJsType } from 'svjs';

export default function paintStars(
	svg: SvJsType,
	canvasDimensions: { width: number; height: number },
	count: number
) {
	const { width, height } = canvasDimensions;
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
