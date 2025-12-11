declare module 'svjs/src';

export type SvJs = {
	rotate: (angle: number, cx?: number, cy?: number) => SvJs;
	create: (element: string) => SvJs;
	set: (attributes: Record<string, number | string>) => SvJs;
	delete: () => void;
};
