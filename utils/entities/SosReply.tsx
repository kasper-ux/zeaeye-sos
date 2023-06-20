export class SosReply {
	emergencyContactOne: SosReplyData;
	emergencyContactTwo: SosReplyData;
	user: SosReplyData;

	constructor(
		emergencyContactOne: SosReplyData,
		emergencyContactTwo: SosReplyData,
		user: SosReplyData,
	) {
		this.emergencyContactOne = emergencyContactOne;
		this.emergencyContactTwo = emergencyContactTwo;
		this.user = user;
	};

	static fromData(data: any) {
		return new SosReply(
			SosReplyData.fromData(data["emergencyContactOne"]),
			SosReplyData.fromData(data["emergencyContactTwo"]),
			SosReplyData.fromData(data["user"]),
		);
	}
}

export class SosReplyData {
	alarmId: string;
	receiver: string;
	state: string;
	timestamp: string;

	constructor(
		alarmId: string,
		receiver: string,
		state: string,
		timestamp: string,
	) {
		this.alarmId = alarmId;
		this.receiver = receiver;
		this.state = state;
		this.timestamp = timestamp;
	};

	static fromData(data: any) {
		return new SosReplyData(
			data["alarmId"],
			data["receiver"],
			data["state"],
			data["timestamp"],
		)
	}
}