export class EmergencyContactConfirmation {
	emergencyContactOne: EmergencyContactConfirmationData;
	emergencyContactTwo: EmergencyContactConfirmationData;

	constructor({
		emergencyContactOne,
		emergencyContactTwo,
	}: {
		emergencyContactOne: EmergencyContactConfirmationData;
		emergencyContactTwo: EmergencyContactConfirmationData;
	}) {
		this.emergencyContactOne = emergencyContactOne;
		this.emergencyContactTwo = emergencyContactTwo;
	}

	static fromData(data: any) {
		return new EmergencyContactConfirmation({
			emergencyContactOne: EmergencyContactConfirmationData.fromData(data["emergencyContactOne"]),
			emergencyContactTwo: EmergencyContactConfirmationData.fromData(data["emergencyContactTwo"]),
		})
	}
}

export class EmergencyContactConfirmationData {
	address: string;
	age: string;
	state: string;
	userDocId: string;

	constructor({
		address,
		age,
		state,
		userDocId,
	}: {
		address: string;
		age: string;
		state: string;
		userDocId: string;
	}) {
		this.address = address;
		this.age = age;
		this.state = state;
		this.userDocId = userDocId;
	}

	static fromData(data: any) {
		return new EmergencyContactConfirmationData({
			address: data["address"],
			age: data["age"],
			state: data["state"],
			userDocId: data["userDocId"],
		})
	}
}