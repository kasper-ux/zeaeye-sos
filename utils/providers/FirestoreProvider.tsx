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
	writeBatch,
	Timestamp,
	onSnapshot,
	Unsubscribe,
} from "firebase/firestore";
import firebase from '../../config/firebase';
import FirestoreSource from '../../config/firestore';

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
		update: any,
	) => Promise<void>,
	batchUpdate: (
		source: FirestoreSource,
		ids: Array<string>,
		update: FirestoreUpdate
	) => Promise<void>,
	create: (
		source: FirestoreSource,
		data: FirestoreUpdate
	) => Promise<DocumentData>,
	listenFor: (
		source: FirestoreSource,
		id: string,
		onUpdate: (update: DocumentSnapshot<DocumentData>) => void,
	) => Unsubscribe,
	serverTimestamp: () => Timestamp,
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
			doc.exists() ? options.parser({ ...doc.data(), docId: doc.id }) : null)

	const getAll = async (
		source: FirestoreSource,
		options: FirestoreOptions = defaultFirestoreOptions,
	) => await getDocs(query(
		collection(firestore, source),
	)).then((snapshot: QuerySnapshot<DocumentData>) =>
		snapshot.docs.map(
			(doc: QueryDocumentSnapshot<DocumentData>) =>
				options.parser({ ...doc.data(), docId: doc.id })))

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
				options.parser({ ...doc.data(), docId: doc.id })))

	const update = async (
		source: FirestoreSource,
		id: string,
		update: any
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

	const listenFor = (
		source: FirestoreSource,
		id: string,
		onUpdate: (update: DocumentSnapshot<DocumentData>) => void,
	): Unsubscribe =>
		onSnapshot(
			doc(firestore, source, id), onUpdate);

	const serverTimestamp = () =>
		Timestamp.fromDate(new Date());

	return (
		<FirestoreContext.Provider
			value={{
				get,
				getAll,
				getWhere,
				listenFor,
				update,
				batchUpdate,
				create,
				serverTimestamp,
			}}>
			{children}
		</FirestoreContext.Provider>
	)
}

export const useFirestore = () =>
	useContext(FirestoreContext);