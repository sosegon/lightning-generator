export class AppState {
	showInstructions: boolean = $state(true);
	isMuted: boolean = $state(false);

	setShowInstructions(value: boolean) {
		this.showInstructions = value;
	}

	setIsMuted(value: boolean) {
		this.isMuted = value;
	}
}

export type AppStateType = {
	showInstructions: boolean;
	setShowInstructions: (value: boolean) => void;
	isMuted: boolean;
	setIsMuted: (value: boolean) => void;
};
