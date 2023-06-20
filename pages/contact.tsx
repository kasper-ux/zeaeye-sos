import FirestoreSource from '@config/firestore';
import { ContactCard } from '@ui/cards/ContactCard';
import BasePage from '@ui/pages/BasePage'
import { EmergencyContact, User } from '@utils/entities';
import { EmergencyContactConfirmation, EmergencyContactConfirmationData } from '@utils/entities/EmergencyContactConfirmation';
import { useFirestore } from '@utils/providers/FirestoreProvider';
import { where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ContactPage() {
	const [user, setUser] = useState<User>();
	const [emergencyContact, setEmergencyContact] = useState<EmergencyContact | null>();
	const [confirmation, setConfirmantion] = useState<EmergencyContactConfirmationData>();
	const { getWhere, update, get } = useFirestore();
	const { query } = useRouter();
	const { userId, type } = query;

	useEffect(() => {
		if (userId) {
			loadUserDataWithUserDocId(userId as string, (type as string) ?? "1");
		}
	}, [userId]);

	const loadUserDataWithUserDocId = async (userId: string, contactType: string) => {
		try {
			const userData = await getWhere(FirestoreSource.userData, where("userId", "==", userId));
			if (userData != null && userData.length > 0) {
				const _user = User.fromData(userData.at(0));
				setUser(User.fromData(userData.at(0)))
				setEmergencyContact(_user[_getEmergencyContactLabel(contactType)])
				const _emergencyContactConfirmationData = await get(FirestoreSource.emergencyContactConfirmations, userId);
				if (_emergencyContactConfirmationData != null) {
					const _emergencyContactConfirmation = EmergencyContactConfirmation.fromData(_emergencyContactConfirmationData);
					const _confirmation = _getEmergencyContact(_emergencyContactConfirmation, contactType);
					setConfirmantion(_confirmation);
				}
			}
		} catch (e) {
			console.error(e)
		}
	}

	const _getEmergencyContact = (contact: EmergencyContactConfirmation, contactType: string) => {
		switch (contactType) {
			case "1":
				return contact.emergencyContactOne
			case "2":
				return contact.emergencyContactTwo;
			default:
				return contact.emergencyContactOne;
		}
	}

	const _getEmergencyContactLabel = (contactType?: string) => {
		switch (contactType) {
			case "1":
				return "emergencyContactOne";
			case "2":
				return "emergencyContactTwo";
			default:
				return "emergencyContactOne";
		}
	}

	const handleSaveContact = async (address?: string, age?: number) =>
		await update(FirestoreSource.emergencyContactConfirmations, `${user?.docId}`, {
			[_getEmergencyContactLabel(type?.toString())]: {
				address: address ?? emergencyContact?.address,
				age: age ?? emergencyContact?.age,
				state: "approved",
				userDocId: `${user?.docId}`
			},
		});

	const handleDenyContact = async () =>
		await update(FirestoreSource.emergencyContactConfirmations, `${user?.docId}`, {
			[_getEmergencyContactLabel(type?.toString())]: {
				address: emergencyContact?.address,
				age: emergencyContact?.age,
				state: "disapproved",
				userDocId: `${user?.docId}`
			},
		});

	return (
		<BasePage title={ContactPage.title}>
			<ContactCard
				onAccept={handleSaveContact}
				onDeny={handleDenyContact}
				contact={emergencyContact}
				confirmation={confirmation} />
		</BasePage>
	)
}

ContactPage.title = "Bekræft Nødkontakt"