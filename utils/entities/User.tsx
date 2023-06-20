import { EmergencyContact } from "./EmergencyContact";

export class User {
	docId: string;
	name: string;
	emergencyContactOne: EmergencyContact;
	emergencyContactTwo: EmergencyContact;

	constructor(
		docId: string,
		name: string,
		emergencyContactOne: EmergencyContact,
		emergencyContactTwo: EmergencyContact,
	) {
		this.docId = docId;
		this.name = name;
		this.emergencyContactOne = emergencyContactOne;
		this.emergencyContactTwo = emergencyContactTwo;
	};

	static fromData(data: any) {
		return new User(
			data["id"],
			`${data["firstName"]} ${data["lastName"]}`,
			EmergencyContact.fromData(data["emergencyContactOne"]),
			EmergencyContact.fromData(data["emergencyContactTwo"]),
		);
	}
}