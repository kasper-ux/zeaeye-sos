import { Context, createContext, useContext } from 'react';
import {
	DocumentData,
	DocumentSnapshot,
	QueryConstraint,
	QueryDocumentSnapshot,
	QuerySnapshot,
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	updateDoc,
	writeBatch
} from "firebase/firestore";
import firebase from '../../config/firebase';
import FirestoreSource from '../../config/firestore';

export class EmergencyContact {
	contactName: string;

	constructor(
		contactName: string
	) {
		this.contactName = contactName;
	}

	static fromData(data: any) {
		console.log(data)
		return new EmergencyContact(
			data["contactName"]
		)
	}
}

export class User {
	name: string;
	emergencyContactOne: EmergencyContact;
	emergencyContactTwo: EmergencyContact;

	constructor(
		name: string,
		emergencyContactOne: EmergencyContact,
		emergencyContactTwo: EmergencyContact,
	) {
		this.name = name;
		this.emergencyContactOne = emergencyContactOne;
		this.emergencyContactTwo = emergencyContactTwo;
	};

	static fromData(data: any) {
		console.log(data);
		return new User(
			data["name"],
			EmergencyContact.fromData(data["emergencyContactOne"]),
			EmergencyContact.fromData(data["emergencyContactTwo"]),
		);
	}
}

export class Alarm {
	controllerId: string;

	constructor(
		controllerId: string
	) {
		this.controllerId = controllerId;
	}

	static fromData(data: any) {
		return new Alarm(
			data["controllerId"]
		)
	}
}

export class Controller {
	userId: string;

	constructor(
		userId: string
	) {
		this.userId = userId;
	}

	static fromData(data: any) {
		return new Controller(
			data["userId"]
		)
	}
}

interface FirestoreOptions {
	parser: (data: DocumentData) => any
}

const defaultFirestoreOptions: FirestoreOptions = {
	parser: (data: DocumentData) => data
}

interface FirestoreUpdate {
	[key: string]: string
}

const FirestoreContext: Context<ContextProps> = createContext<ContextProps>({} as ContextProps)

interface ContextProps {
	get: (
		source: FirestoreSource,
		id: string,
		options?: FirestoreOptions,
	) => Promise<any> | undefined,
	getAll: (
		source: FirestoreSource,
		options?: FirestoreOptions
	) => Promise<Array<any>>,
	getWhere: (
		source: FirestoreSource,
		where: QueryConstraint,
		options?: FirestoreOptions,
	) => Promise<Array<any>>,
	update: (
		source: FirestoreSource,
		id: string,
		update: FirestoreUpdate,
	) => Promise<void>,
	batchUpdate: (
		source: FirestoreSource,
		ids: Array<string>,
		update: FirestoreUpdate
	) => Promise<void>,
	create: (
		source: FirestoreSource,
		data: FirestoreUpdate
	) => Promise<DocumentData>
}

export default function FirestoreProvider({
	children
}: {
	children: any
}) {
	const firestore = getFirestore(firebase);

	const get = async (
		source: FirestoreSource,
		id: string,
		options: FirestoreOptions = defaultFirestoreOptions,
	) => await getDoc(doc(firestore, source, id)).then(
		(doc: DocumentSnapshot<DocumentData>) =>
			doc.exists() ? options.parser(doc.data()) : null)

	const getAll = async (
		source: FirestoreSource,
		options: FirestoreOptions = defaultFirestoreOptions,
	) => await getDocs(query(
		collection(firestore, source),
	)).then((snapshot: QuerySnapshot<DocumentData>) =>
		snapshot.docs.map(
			(doc: QueryDocumentSnapshot<DocumentData>) =>
				options.parser(doc.data())))

	const getWhere = async (
		source: FirestoreSource,
		where: QueryConstraint,
		options: FirestoreOptions = defaultFirestoreOptions
	) => await getDocs(query(
		collection(firestore, source),
		where,
	)).then((snapshot: QuerySnapshot<DocumentData>) =>
		snapshot.docs.map(
			(doc: QueryDocumentSnapshot<DocumentData>) =>
				options.parser(doc.data())))

	const update = async (
		source: FirestoreSource,
		id: string,
		update: FirestoreUpdate
	) => await updateDoc(
		doc(firestore, source, id),
		update
	)

	const batchUpdate = async (
		source: FirestoreSource,
		ids: Array<string>,
		update: FirestoreUpdate
	) => {
		const batch = writeBatch(firestore);
		for (const id of ids)
			batch.update(
				doc(firestore, source, id),
				update
			)
		await batch.commit();
	}

	const create = async (
		source: FirestoreSource,
		data: FirestoreUpdate
	) => await addDoc(
		collection(firestore, source),
		data
	);

	return (
		<FirestoreContext.Provider
			value={{
				get,
				getAll,
				getWhere,
				update,
				batchUpdate,
				create,
			}}>
			{children}
		</FirestoreContext.Provider>
	)
}

export const useFirestore = () =>
	useContext(FirestoreContext);