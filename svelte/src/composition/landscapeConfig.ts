import type { MountainParams } from 'Types';

// Mountains
const farMountainsParams: MountainParams = {
	numberOfPeaks: 3,
	distanceBetweenValleyPeak: 20,
	color: '#0D0D2D',
	valleyYPosition: null,
	speed: 0.01
};

const midMountainsParams: MountainParams = {
	numberOfPeaks: 4,
	distanceBetweenValleyPeak: 40,
	color: '#1A1A38',
	valleyYPosition: null,
	speed: 0.05
};

const nearMountainsParams: MountainParams = {
	numberOfPeaks: 1,
	distanceBetweenValleyPeak: 120,
	color: '#262643',
	valleyYPosition: null,
	speed: 0.1
};

export default {
	farMountainsParams,
	midMountainsParams,
	nearMountainsParams
};
