declare module 'svjs/src';

export type SvJs = {
	element: SVGElement;
	rotate: (angle: number, cx?: number, cy?: number) => SvJs;
	create: (element: string) => SvJs;
	set: (attributes: Record<string, number | string>) => SvJs;
	delete: () => void;
	createFilter: (id: string) => SvJs;
	animate: (
		keyframes: Record<string, string | number | array>,
		options: Record<string, number | string>
	) => SvJs;
	get: (attribute: string) => any;
	moveTo: (x: number, y: number) => SvJs;
	createCurve: (points: Array<[number, number]>, curveFactor: number) => SvJs;
};
