import type { BranchParams } from '@types';
import { SvJs, Gen } from 'svjs/src';
import type { SvJs as SvJsType } from 'svjs';
import paintMountains from './paintMountains';
import paintStars from './paintStars';
import paintSky from './paintSky';
import { Bolt } from './Bolt';
import landscapeConfig from './landscapeConfig';

export class Landscape {
	private svg: SvJsType;
	private bolt: Bolt;

	constructor(
		container: HTMLElement,
		colors: {
			skyGradientStart: string;
			skyGradientEnd: string;
			boltInner: string;
			boltGlow: string;
		},
		shouldPaint: {
			sky: boolean;
			stars: boolean;
			mountains: boolean;
		} = { sky: true, stars: true, mountains: true },
		onMouseLeave: () => void = () => {},
		onPointerDown: () => void = () => {}
	) {
		if (!container) {
			throw new Error('Container element is required to create Landscape');
		}
		this.svg = new SvJs().addTo(container);
		const { innerHeight: viewBoxHeight, innerWidth: viewBoxWidth } = window;
		this.svg.set({
			x: 0,
			y: 0,
			width: viewBoxWidth,
			height: viewBoxHeight,
			viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
			id: 'svgBox'
		});

		if (shouldPaint.sky) {
			paintSky(
				this.svg,
				{ width: viewBoxWidth, height: viewBoxHeight },
				{ gradientStart: colors.skyGradientStart, gradientEnd: colors.skyGradientEnd }
			);
		}

		if (shouldPaint.stars) {
			paintStars(this.svg, { width: viewBoxWidth, height: viewBoxHeight }, 100);
		}

		let animationFns: Array<() => void> = [];
		if (shouldPaint.mountains) {
			const scrollFarMountains = paintMountains(
				this.svg,
				{ width: viewBoxWidth, height: viewBoxHeight },
				{ ...landscapeConfig.farMountainsParams, valleyYPosition: viewBoxHeight * 1 - 150 },
				'far-mountains'
			);
			animationFns.push(scrollFarMountains);
			const scrollMidMountains = paintMountains(
				this.svg,
				{ width: viewBoxWidth, height: viewBoxHeight },
				{ ...landscapeConfig.midMountainsParams, valleyYPosition: viewBoxHeight * 1 - 90 },
				'mid-mountains'
			);
			animationFns.push(scrollMidMountains);
			const scrollNearMountains = paintMountains(
				this.svg,
				{ width: viewBoxWidth, height: viewBoxHeight },
				{
					...landscapeConfig.nearMountainsParams,
					valleyYPosition: viewBoxHeight * 1 - 30
				},
				'near-mountains'
			);
			animationFns.push(scrollNearMountains);
		}

		this.bolt = new Bolt(
			this.svg,
			{
				inner: colors.boltInner,
				outer: colors.boltGlow
			},
			{
				width: viewBoxWidth,
				height: viewBoxHeight
			}
		);

		this.svg.addEventListener('mouseleave', () => {
			onMouseLeave();
		});

		this.svg.addEventListener('pointerdown', (e: PointerEvent) => {
			const boltColor = onPointerDown();

			let endPoint = new DOMPoint();
			endPoint.x = e.clientX;
			endPoint.y = e.clientY;
			const ctm = this.svg.element.getScreenCTM();
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

			this.bolt.paint(endPoint.x, branchParams, 3, boltColor);
		});

		function animate() {
			animationFns.forEach((fn) => fn());
			requestAnimationFrame(animate);
		}
		animate();
	}
}
