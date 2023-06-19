import FirestoreSource from '@config/firestore';
import { ContactCard } from '@ui/cards/ContactCard';
import BasePage from '@ui/pages/BasePage'
import { Alarm, Controller, User, useFirestore } from '@utils/providers/FirestoreProvider';
import { limit, where } from 'firebase/firestore';
import { useEffect, useState } from 'react'

export default function ReplySosPage() {
	const { getWhere, get } = useFirestore();
	const [user, setUser] = useState<User>();

	useEffect(() => {
		loadData();
	}, [])

	const loadData = async () => {
		const controllerId: string = await loadControllerId("alarmId");
		if (controllerId == null) return;
		console.log(controllerId)

		const userId = await loadUserIdwithControllerId(controllerId)
		if (userId == null) return;
		console.log(userId)
		loadUserDataWithUserId(userId);
	}

	const loadControllerId = async (alarmId: string) => {
		const alarmData = await getWhere(FirestoreSource.deviceAlarms, where("alarmId", "==", alarmId));
		if (alarmData != null) {
			const alarm: Alarm = Alarm.fromData(alarmData.at(0));
			console.log(alarm)
			return alarm.controllerId;
		}
		return "";
	}

	const loadUserIdwithControllerId = async (controllerId: string) => {
		const controllerData = await get(FirestoreSource.controllers, controllerId);
		if (controllerData) {
			const controller = Controller.fromData(controllerData);
			const userId: string = controller.userId;
			console.log(userId);
		}
	}

	const loadUserDataWithUserId = async (userId: string) => {
		const userData = await getWhere(FirestoreSource.userData, where("userId", "==", userId));
		if (userData) {
			const user = User.fromData(userData.at(0));
			setUser(user);
		}
	}

	return (
		<BasePage title={ReplySosPage.title}>

		</BasePage>
	)
}

ReplySosPage.title = "Reply Sos"