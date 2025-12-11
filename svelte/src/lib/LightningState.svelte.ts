export class LightningState {
	availableColors: string[] = ['#4444ff', '#ff4444', '#44ff44', '#ffff44', '#ff44ff', '#44ffff'];
	color: string = $state(this.availableColors[0]);

	setColor(value: string) {
		this.color = value;
	}
}

export type LightningStateType = {
	availableColors: string[];
	color: string;
	setColor: (value: string) => void;
};
