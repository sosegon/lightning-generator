import type { TurbulenceParams, DisplacementParams } from '@types';
import type { SvJs as SvJsType } from 'svjs';

export default function createDistortionFilter(
	svg: SvJsType,
	id: string,
	turbulenceParams: TurbulenceParams,
	displacementParams: DisplacementParams
) {
	const filter = svg.createFilter(id);
	filter.create('feTurbulence').set({ ...turbulenceParams, id: `turbulence-${id}` });
	filter.create('feDisplacementMap').set(displacementParams);
	return filter;
}
