import FirestoreSource from '@config/firestore';
import { SosCard } from '@ui/cards/SosCard';
import BasePage from '@ui/pages/BasePage'
import { Alarm, Controller, SosReply, SosReplyData, User } from '@utils/entities';
import { useFirestore } from '@utils/providers/FirestoreProvider';
import { DocumentData, DocumentSnapshot, Unsubscribe, doc, onSnapshot, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react'

export default function ReplySosPage() {
	const { getWhere, get, update, serverTimestamp, listenFor } = useFirestore();
	const [user, setUser] = useState<User>();
	const [alarm, setAlarm] = useState<Alarm>();
	const [sosReply, setSosReply] = useState<SosReplyData>();
	const { query } = useRouter();
	const { alarmId, type } = query;
	const [error, setError] = useState<string>();

	const listenForSosReply = useCallback((sosAlarmId: string) =>
		listenFor(FirestoreSource.sosReplies, sosAlarmId, (sosReplyData: DocumentSnapshot<DocumentData>) => {
			if (sosReplyData.exists()) {
				const _contactLabel = _getEmergencyContactLabel(type?.toString());
				const _sosReply: SosReply = SosReply.fromData(sosReplyData.data());
				setSosReply(_sosReply[_contactLabel]);
			}
		}), [listenFor, type])

	useEffect(() => {
		var sosReplySubscription: Unsubscribe;
		if (alarm != null) {
			sosReplySubscription = listenForSosReply(alarm?.alarmId)
		}
		return () => {
			if (sosReplySubscription != null) {
				sosReplySubscription();
			}
		}
	}, [alarm, listenForSosReply])

	const loadControllerIdFromAlarmId = useCallback(async (alarmId: string) => {
		const alarmData = await getWhere(FirestoreSource.deviceAlarms, where("alarmId", "==", alarmId));
		if (alarmData != null) {
			const alarm: Alarm = Alarm.fromData(alarmData.at(0));
			setAlarm(alarm);
			return alarm.controllerId;
		}
		return null;
	}, [getWhere]);

	const loadUserIdwithControllerId = useCallback(async (controllerId: string) => {
		const controllerData = await get(FirestoreSource.controllers, controllerId);
		if (controllerData) {
			const controller = Controller.fromData(controllerData);
			const userId: string = controller.userId;
			return userId;
		}
		return null;
	}, [get]);

	const loadUserDataWithUserId = useCallback(async (userId: string) => {
		const userData = await getWhere(FirestoreSource.userData, where("userId", "==", userId));
		if (userData) {
			const user = User.fromData(userData.at(0));
			setUser(user);
		}
	}, [getWhere]);

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

	const handleCancelAlarm = async () => {
		const _contactLabel = _getEmergencyContactLabel(type?.toString());
		return await update(FirestoreSource.sosReplies, alarm?.alarmId!, {
			[_contactLabel]: {
				...sosReply,
				state: "disapproved",
				timestamp: serverTimestamp(),
			},
		}).then(() => {
			if (alarmId)
				loadData(alarmId.toString());
		});
	}

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

	const loadData = useCallback(async (id: string) => {
		try {
			const controllerId: string | null = await loadControllerIdFromAlarmId(id);
			if (controllerId == null) return;
			const userId = await loadUserIdwithControllerId(controllerId)
			if (userId == null) return;
			await loadUserDataWithUserId(userId);
		} catch (e) {
			setError("Alarmen kunne ikke findes");
		}
	}, [loadControllerIdFromAlarmId, loadUserDataWithUserId, loadUserIdwithControllerId])

	useEffect(() => {
		if (alarmId)
			loadData(alarmId.toString());
	}, [alarmId, loadData])

	return (
		<BasePage title={ReplySosPage.title}>
			<SosCard
				error={error}
				user={user}
				alarm={alarm}
				reply={sosReply}
				initialComment={sosReply?.comment}
				onCancel={handleCancelAlarm}
				onComment={handleComment} />
		</BasePage>
	)
}

ReplySosPage.title = "SOS"