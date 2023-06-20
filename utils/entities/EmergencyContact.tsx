export class EmergencyContact {
	contactName?: string;
	contactPhone?: string;
	relationType?: string;
	otherDefinedRelation?: string;
	phoneCode?: number;
	address?: string;
	age?: string;

	constructor({
		contactName,
		contactPhone,
		relationType,
		otherDefinedRelation,
		phoneCode,
		address,
		age,
	}: {
		contactName?: string,
		contactPhone?: string,
		relationType?: string,
		otherDefinedRelation?: string,
		phoneCode?: number;
		address?: string;
		age?: string;
	}) {
		this.contactName = contactName;
		this.contactPhone = contactPhone;
		this.relationType = relationType;
		this.otherDefinedRelation = otherDefinedRelation;
		this.phoneCode = phoneCode;
		this.address = address;
		this.age = age;
	}

	static empty() {
		return new EmergencyContact({});
	}

	static fromData(data: any) {
		return new EmergencyContact({
			contactName: data["contactName"],
			contactPhone: data["contactPhone"],
			relationType: data["relationType"],
			otherDefinedRelation: data["otherDefinedRelation"],
			phoneCode: data["phoneCode"],
			address: data["address"],
			age: data["age"],
		})
	}
}