export class Alarm {
	docId: string;
	alarmId: string;
	controllerId: string;
	lat: number;
	lng: number;
	reportedOnUtc: string;
	statusText: string;
	tripId: string;

	constructor(
		docId: string,
		alarmId: string,
		controllerId: string,
		lat: number,
		lng: number,
		reportedOnUtc: string,
		statusText: string,
		tripId: string,
	) {
		this.docId = docId;
		this.alarmId = alarmId;
		this.controllerId = controllerId;
		this.lat = lat;
		this.lng = lng;
		this.reportedOnUtc = reportedOnUtc;
		this.statusText = statusText;
		this.tripId = tripId;
	}

	static fromData(data: any) {
		return new Alarm(
			data["docId"],
			data["alarmId"],
			data["controllerId"],
			data["lat"],
			data["lng"],
			data["reportedOnUtc"],
			data["statusText"],
			data["tripId"]
		)
	}
}
