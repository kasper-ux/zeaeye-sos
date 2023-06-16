import FirestoreSource from '@config/firestore';
import BasePage from '@ui/pages/BasePage'
import { User, useFirestore } from '@utils/providers/FirestoreProvider';
import { where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function ConfirmEmergancyInfoPage() {
	const [user, setUser] = useState<User>();
	const { getWhere } = useFirestore();

	useEffect(() => {
		loadUserDataWithUserDocId("0XcxIYs2zrcmFzN5SiWKFCCnKAz1")
	}, [])

	const loadUserDataWithUserDocId = async (userId: string) => {
		try {
			const userData = await getWhere(FirestoreSource.userData, where("userId", "==", userId));
			console.log(userData);
			if (userData != null) {
				setUser(User.fromData(userData.at(0)))
			}
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<BasePage title={ConfirmEmergancyInfoPage.title}>
			{user?.emergencyContactOne.contactName}
			<br />
			{user?.emergencyContactTwo.contactName}
		</BasePage>
	)
}

ConfirmEmergancyInfoPage.title = "Confirm Emergancy Info"