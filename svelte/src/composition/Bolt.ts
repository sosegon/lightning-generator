import type { BranchDom, BranchParams } from '@types';
import { Gen } from 'svjs/src';
import type { SvJs as SvJsType } from 'svjs';
import createDistortionFilter from './createDistortionFilter';

export class Bolt {
	private svg: SvJsType;
	private colors: { inner: string; outer: string };
	private rayInnerFilterName: string;
	private rayOuterFilterName: string;
	private canvasDimensions: { width: number; height: number };

	constructor(
		svg: SvJsType,
		colors: { inner: string; outer: string },
		canvasDimensions: { width: number; height: number }
	) {
		// Initialize Bolt properties here
		this.svg = svg;
		this.colors = colors;
		this.rayInnerFilterName = 'ray-distortion';
		this.rayOuterFilterName = 'ray-blur';
		this.canvasDimensions = canvasDimensions;
		this.createFilters();
	}

	/* Paints a lightning bolt at a given position
	 * Params:
	 *  positionX: number - x position of the bolt
	 *  branchParams: BranchParams containing parameters for the main branch
	 *  levels: number - number of levels of branches in the bolt
	 *  color: string - color of the glow bolt
	 */
	paint(positionX: number, branchParams: BranchParams, levels: number, color: string): void {
		this.colors.outer = color;
		this.updateDistortion();

		// Glow first to be behind the bolt
		const rootGlowGroup = this.svg.create('g').set({
			filter: `url(#${this.rayOuterFilterName})`
		});
		const rootGroup = this.svg.create('g').set({
			filter: `url(#${this.rayInnerFilterName})`
		});

		let branches: BranchDom[] = [];
		this.branch(branchParams, levels, rootGroup, rootGlowGroup, branches);

		// Re-positions the bolt
		rootGroup.set({ transform: `translate(${positionX} 0)` });
		rootGlowGroup.set({ transform: `translate(${positionX} 0)` });

		function animate() {
			for (let i = levels; i > 0; i--) {
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

		this.paintSkyLight(positionX, color);
	}

	/* Creates a branch and its sub-branches recursively
	 * Params:
	 *  branchParams: BranchParams containing parameters for the branch
	 *  levels: number - current level of the branch
	 *  svgGroup: SvJsType - SVG group to add the branch lines
	 *  svgGlowGroup: SvJsType - SVG group to add the glow lines
	 *  branches: BranchDom[] - array to store branch data for animation
	 */
	private branch(
		branchParams: BranchParams,
		levels: number,
		branchGroup: SvJsType,
		glowGroup: SvJsType,
		branches: BranchDom[]
	): void {
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

		branchGroup.rotate(rotation, startPoint.x, startPoint.y);
		glowGroup.rotate(rotation, startPoint.x, startPoint.y);

		const branchAttrs = {
			x1: startPoint.x,
			y1: startPoint.y,
			x2: startPoint.x,
			y2: startPoint.y + length,
			fill: 'none'
		};
		const svgGlowElement = glowGroup.create('line').set({
			...branchAttrs,
			stroke_width: 3 * width,
			stroke: this.colors.outer,
			style: `stroke-dashArray: ${length} ${length}; stroke-dashOffset: ${length}`
		});
		branches.push({
			level: levels,
			offset: length,
			updatedOffset: length,
			svgElement: svgGlowElement
		});
		const svgElement = branchGroup.create('line').set({
			...branchAttrs,
			stroke_width: width,
			stroke: this.colors.inner,
			style: `stroke-dashArray: ${length} ${length}; stroke-dashOffset: ${length}`
		});
		branches.push({
			level: levels,
			offset: length,
			updatedOffset: length,
			svgElement
		});

		if (levels > 1) {
			for (let i = 1; i < segments; i++) {
				const deltaRotation = Gen.random(-rotation * 0.1, rotation * 0.1, true);
				this.branch(
					{
						startPoint: {
							x: startPoint.x,
							y: startPoint.y + (length / segments) * i
						},
						length: length * subBranchesLength,
						angle: angle,
						rotation:
							i % 2 === 0 ? angle + (rotation + deltaRotation) : angle - (rotation + deltaRotation),
						segments: segments,
						subBranchesLength: subBranchesLength,
						width: width * (1 - widthReductionRate),
						widthReductionRate
					},
					levels - 1,
					branchGroup.create('g'),
					glowGroup.create('g'),
					branches
				);
			}
		}
	}

	private createFilters(): void {
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
		createDistortionFilter(this.svg, this.rayInnerFilterName, turbulenceParams, displacementParams);

		// Filter in the outer part of the bolt. It distorts and blurs
		// the glow of the bolt to create the feel of a glowing lightning
		// bolt
		const filterOut = createDistortionFilter(
			this.svg,
			this.rayOuterFilterName,
			turbulenceParams,
			displacementParams
		);
		filterOut.create('feGaussianBlur').set({
			in: 'ray',
			stdDeviation: 10
		});
	}

	private updateDistortion(): void {
		const seed = Gen.random(10, 20);
		const feNodeDistortion = document.getElementById(`turbulence-${this.rayInnerFilterName}`);
		feNodeDistortion?.setAttribute('seed', seed);
		const feNodeBlur = document.getElementById(`turbulence-${this.rayOuterFilterName}`);
		feNodeBlur?.setAttribute('seed', seed);
	}

	/* Creates a light effect on the sky at a given x position
	 * Params:
	 *  pointX: number - x position of the light effect
	 *  color: string - color of the light effect
	 */
	private paintSkyLight(positionX: number, color: string): void {
		// Create a radial gradient
		const radialGradient = this.svg.create('radialGradient').set({
			id: 'skyLightGradient',
			cx: positionX / this.canvasDimensions.width,
			cy: 0,
			r: 2
		});
		radialGradient.create('stop').set({ offset: '10%', 'stop-color': color, 'stop-opacity': 0.4 });
		radialGradient.create('stop').set({ offset: '50%', 'stop-color': color, 'stop-opacity': 0.05 });
		// Create a rectangle with the gradient fill
		const lightCanvas = this.svg.create('rect');
		lightCanvas.set({
			x: 0,
			y: 0,
			width: this.canvasDimensions.width,
			height: this.canvasDimensions.height,
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
}
