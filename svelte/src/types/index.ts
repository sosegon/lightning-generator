import type { SvJs as SvJsType } from 'svjs';

export type BranchParams = {
	startPoint: { x: number; y: number }; // Starting point of the branch
	length: number; // Length of the branch
	angle: number; // Angle of the branch to tilt it
	rotation: number; // Rotation of the branch
	segments: number; // Number of segments in the branch
	subBranchesLength: number; // Length of the sub-branches relative to the branch
	width: number; // Width of the branch
	widthReductionRate: number; // Rate at which the width reduces for sub-branches
};

export type BranchDom = {
	level: number;
	offset: number;
	updatedOffset: number;
	svgElement: SvJsType | null;
};

export type MountainParams = {
	numberOfPeaks: number;
	distanceBetweenValleyPeak: number;
	color: string;
	valleyYPosition: number;
	speed: number;
};

export type MountainSvg = {
	oddMountains: SvJsType | null;
	evenMountains: SvJsType | null;
};

export type TurbulenceParams = {
	baseFrequency: number;
	numOctaves: number;
	stitchTiles: string;
	type: string;
	result: string;
};

export type DisplacementParams = {
	in: string;
	in2: string;
	scale: number;
	result: string;
};
