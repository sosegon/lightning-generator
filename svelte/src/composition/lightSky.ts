import type { SvJs as SvJsType } from 'svjs';

/* Creates a light effect on the sky at a given x position
 * Params:
 *  pointX: number - x position of the light effect
 */
export default function lightSky(
	svg: SvJsType,
	pointX: number,
	color: string,
	canvasDimensions: { width: number; height: number }
) {
	// Create a radial gradient
	const radialGradient = svg.create('radialGradient').set({
		id: 'skyLightGradient',
		cx: pointX / canvasDimensions.width,
		cy: 0,
		r: 2
	});
	radialGradient.create('stop').set({ offset: '10%', 'stop-color': color, 'stop-opacity': 0.4 });
	radialGradient.create('stop').set({ offset: '50%', 'stop-color': color, 'stop-opacity': 0.05 });
	// Create a rectangle with the gradient fill
	const lightCanvas = svg.create('rect');
	lightCanvas.set({
		x: 0,
		y: 0,
		width: canvasDimensions.width,
		height: canvasDimensions.height,
		fill: 'url(#skyLightGradient)'
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
