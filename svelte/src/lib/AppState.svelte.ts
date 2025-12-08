export class AppState {
	showInstructions: boolean = $state(true);
	isMuted: boolean = $state(false);
	showInfo: boolean = $state(true);

	setShowInstructions(value: boolean) {
		this.showInstructions = value;
	}

	setIsMuted(value: boolean) {
		this.isMuted = value;
	}

	setShowInfo(value: boolean) {
		this.showInfo = value;
	}
}

export type AppStateType = {
	showInstructions: boolean;
	setShowInstructions: (value: boolean) => void;
	isMuted: boolean;
	setIsMuted: (value: boolean) => void;
	showInfo: boolean;
	setShowInfo: (value: boolean) => void;
};
