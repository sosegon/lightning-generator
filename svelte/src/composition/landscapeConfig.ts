import type { MountainParams } from '@types';

// Mountains
const farMountainsParams: MountainParams = {
	numberOfPeaks: 3,
	distanceBetweenValleyPeak: 25,
	color: '#0D0D2D',
	valleyYPosition: null,
	speed: 0.05,
	segments: 100
};

const midMountainsParams: MountainParams = {
	numberOfPeaks: 4,
	distanceBetweenValleyPeak: 35,
	color: '#1A1A38',
	valleyYPosition: null,
	speed: 0.075,
	segments: 100
};

const nearMountainsParams: MountainParams = {
	numberOfPeaks: 1,
	distanceBetweenValleyPeak: 50,
	color: '#262643',
	valleyYPosition: null,
	speed: 0.1,
	segments: 100
};

export default {
	farMountainsParams,
	midMountainsParams,
	nearMountainsParams
};
