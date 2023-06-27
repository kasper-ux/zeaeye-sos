import FirestoreSource from '@config/firestore';
import { SosCard } from '@ui/cards/SosCard';
import BasePage from '@ui/pages/BasePage'
import { Alarm, Controller, SosReply, SosReplyData, User } from '@utils/entities';
import { useFirestore } from '@utils/providers/FirestoreProvider';
import { where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'

export default function ReplySosPage() {
	const { getWhere, get, update, serverTimestamp } = useFirestore();
	const [user, setUser] = useState<User>();
	const [alarm, setAlarm] = useState<Alarm>();
	const [sosReply, setSosReply] = useState<SosReplyData>();
	const { query } = useRouter();
	const { alarmId, type } = query;
	const [error, setError] = useState<string>();

	useEffect(() => {
		if (alarmId)
			loadData(alarmId.toString());
	}, [alarmId])

	const loadData = async (id: string) => {
		try {
			const controllerId: string | null = await loadControllerIdFromAlarmId(id);
			if (controllerId == null) return;
			const userId = await loadUserIdwithControllerId(controllerId)
			if (userId == null) return;
			await loadUserDataWithUserId(userId);
		} catch (e) {
			setError("Alarmen kunne ikke findes");
		}
	}

	const loadControllerIdFromAlarmId = async (alarmId: string) => {
		const alarmData = await getWhere(FirestoreSource.deviceAlarms, where("alarmId", "==", alarmId));
		if (alarmData != null) {
			const alarm: Alarm = Alarm.fromData(alarmData.at(0));
			setAlarm(alarm);
			return alarm.controllerId;
		}
		return null;
	}

	const loadUserIdwithControllerId = async (controllerId: string) => {
		const controllerData = await get(FirestoreSource.controllers, controllerId);
		if (controllerData) {
			const controller = Controller.fromData(controllerData);
			const userId: string = controller.userId;
			return userId;
		}
		return null;
	}

	const loadUserDataWithUserId = async (userId: string) => {
		const userData = await getWhere(FirestoreSource.userData, where("userId", "==", userId));
		if (userData) {
			const user = User.fromData(userData.at(0));
			setUser(user);
		}
	}

	const _getEmergencyContactLabel = (contactType?: string) => {
		switch (contactType) {
			case "cba":
				return "user";
			case "efd":
				return "emergencyContactOne";
			case "ihg":
				return "emergencyContactTwo";
			default:
				return "emergencyContactOne";
		}
	}

	const handleCancelAlarm = async () =>
		await get(FirestoreSource.sosReplies, alarm?.alarmId!)?.then(async (sosReplyData: any) => {
			const _contactLabel = _getEmergencyContactLabel(type?.toString());
			const _sosReply: SosReply = SosReply.fromData(sosReplyData);
			setSosReply(_sosReply[_contactLabel]);
			return await update(FirestoreSource.sosReplies, alarm?.alarmId!, {
				[_contactLabel]: {
					..._sosReply[_contactLabel],
					state: "disapproved",
					timestamp: serverTimestamp(),
				},
			}).then(() => {
				if (alarmId)
					loadData(alarmId.toString());
				return
			});
		});

	const handleComment = async (comment: string) => {
		if (sosReply) {
			const _contactLabel = _getEmergencyContactLabel(type?.toString());
			return await update(FirestoreSource.sosReplies, alarm?.alarmId!, {
				[_contactLabel]: {
					...sosReply,
					comment: comment,
					timestamp: serverTimestamp(),
				},
			})
		}
	}

	return (
		<BasePage title={ReplySosPage.title}>
			<SosCard
				error={error}
				user={user}
				alarm={alarm}
				reply={sosReply}
				onCancel={handleCancelAlarm}
				onComment={handleComment} />
		</BasePage>
	)
}

ReplySosPage.title = "SOS"