import { EmergencyContact } from "./EmergencyContact";

export class User {
	docId: string;
	name: string;
	emergencyContactOne: EmergencyContact | null;
	emergencyContactTwo: EmergencyContact | null;

	constructor(
		docId: string,
		name: string,
		emergencyContactOne: EmergencyContact | null,
		emergencyContactTwo: EmergencyContact | null,
	) {
		this.docId = docId;
		this.name = name;
		this.emergencyContactOne = emergencyContactOne;
		this.emergencyContactTwo = emergencyContactTwo;
	};

	static fromData(data: any) {
		console.log(data);
		return new User(
			data["docId"],
			`${data["firstName"]} ${data["lastName"]}`,
			data["emergencyContactOne"] ? EmergencyContact.fromData(data["emergencyContactOne"]) : null,
			data["emergencyContactTwo"] ? EmergencyContact.fromData(data["emergencyContactTwo"]) : null,
		);
	}
}