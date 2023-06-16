import { Context, createContext, useContext, useState } from 'react';
import { UserCredential, getAuth, signInWithEmailAndPassword, signOut as firebaseSignOut, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult, User } from "firebase/auth";
import firebase from '../../config/firebase';

interface ContextProps {
	user?: User,
	signInWithEmail: (
		email: string,
		password: string
	) => Promise<void>,
	signInWithPhone: (
		phoneNumber: string,
		buttonId: string,
		onSubmit: (response: any) => void,
	) => Promise<ConfirmationResult>,
	signOut: () => Promise<void>,
}

const AuthenticationContext: Context<ContextProps> = createContext<ContextProps>({} as ContextProps)

export default function AuthenticationProvider({
	children
}: {
	children: any
}) {
	const [user, setUser] = useState<User>();
	const authentication = getAuth(firebase);

	// ReCaptcha Verifier
	// https://firebase.google.com/docs/auth/web/phone-auth#use-invisible-recaptcha
	const _recaptchaVerifier = (
		buttonId: string,
		onSubmit: (response: any) => void
	) => new RecaptchaVerifier(buttonId, {
		'size': 'invisible',
		'callback': onSubmit
	}, authentication);

	const signInWithEmail = async (
		email: string,
		password: string
	) => await signInWithEmailAndPassword(
		authentication,
		email,
		password
	).then((uc: UserCredential) => setUser(uc.user))

	const signInWithPhone = async (
		phoneNumber: string,
		buttonId: string,
		onSubmit: (response: any) => void,
	) => await signInWithPhoneNumber(
		authentication,
		phoneNumber,
		_recaptchaVerifier(buttonId, onSubmit)
	)

	const signOut = async () =>
		await firebaseSignOut(authentication);

	return (
		<AuthenticationContext.Provider
			value={{
				user,
				signInWithEmail,
				signInWithPhone,
				signOut
			}}>
			{children}
		</AuthenticationContext.Provider>
	)
}

export const useAuthentication = () =>
	useContext(AuthenticationContext);