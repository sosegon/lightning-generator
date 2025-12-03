export class AppState {
	showInstructions: boolean = $state(true);

	setShowInstructions(value: boolean) {
		this.showInstructions = value;
	}
}

export type AppStateType = {
	showInstructions: boolean;
	setShowInstructions: (value: boolean) => void;
};
