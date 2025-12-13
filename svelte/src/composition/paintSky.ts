import type { SvJs as SvJsType } from 'svjs';

/* Creates a light sky background with a vertical gradient
 * Params:
 *  canvasDimensions: { width: number; height: number } - dimensions of the canvas
 *  colors: { gradientStart: string; gradientEnd: string } - colors for the gradient
 */
export default function paintSky(
	svg: SvJsType,
	canvasDimensions: { width: number; height: number },
	colors: { gradientStart: string; gradientEnd: string }
) {
	const bgGradient = svg.create('linearGradient').set({
		id: 'skyGradient',
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 1
	});
	bgGradient.create('stop').set({
		offset: '0%',
		'stop-color': colors.gradientStart,
		'stop-opacity': 1
	});
	bgGradient.create('stop').set({
		offset: '50%',
		'stop-color': colors.gradientEnd, // lighter shade at the bottom
		'stop-opacity': 1
	});
	svg.create('rect').set({
		x: 0,
		y: 0,
		width: canvasDimensions.width,
		height: canvasDimensions.height,
		fill: 'url(#skyGradient)'
	});
}
