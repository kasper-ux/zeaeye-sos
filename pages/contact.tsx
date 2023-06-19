import FirestoreSource from '@config/firestore';
import { ContactCard } from '@ui/cards/ContactCard';
import BasePage from '@ui/pages/BasePage'
import { EmergencyContact, User, useFirestore } from '@utils/providers/FirestoreProvider';
import { where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ContactPage() {
	const [user, setUser] = useState<User>();
	const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>();
	const { getWhere } = useFirestore();
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
			if (userData != null) {
				const _user = User.fromData(userData.at(0));
				const _emergencyContact = _getEmergencyContact(_user, contactType);
				setUser(User.fromData(userData.at(0)))
				setEmergencyContact(_emergencyContact);
			}
		} catch (e) {
			console.error(e)
		}
	}

	const _getEmergencyContact = (user: User, contactType: string) => {
		switch (contactType) {
			case "1":
				return user.emergencyContactOne;
			case "2":
				return user.emergencyContactTwo;
			default:
				return user.emergencyContactOne;
		}
	}

	return (
		<BasePage title={ContactPage.title}>
			<ContactCard contact={emergencyContact} />
		</BasePage>
	)
}

ContactPage.title = "Bekræft SOS Kontakt"