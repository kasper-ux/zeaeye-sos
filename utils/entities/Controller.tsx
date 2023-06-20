export class Controller {
	userId: string;

	constructor(
		userId: string
	) {
		this.userId = userId;
	}

	static fromData(data: any) {
		return new Controller(
			data["userId"]
		)
	}
}