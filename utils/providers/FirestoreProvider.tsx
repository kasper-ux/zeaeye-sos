import { Context, createContext, useContext } from 'react';
import {
	DocumentData,
	QueryConstraint,
	QueryDocumentSnapshot,
	QuerySnapshot,
	addDoc,
	collection,
	doc,
	getDocs,
	getFirestore,
	query,
	updateDoc,
	writeBatch
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

	const getAll = async (
		source: FirestoreSource,
		options: FirestoreOptions = defaultFirestoreOptions,
	) => await getDocs(query(
		collection(firestore, source),
	)).then((snapshot: QuerySnapshot<DocumentData>) =>
		snapshot.docs.map(
			(doc: QueryDocumentSnapshot<DocumentData>) =>
				options.parser(doc.data)))

	const getWhere = async (
		source: FirestoreSource,
		where: QueryConstraint,
		options: FirestoreOptions = defaultFirestoreOptions
	) => await getDocs(query(
		collection(firestore, source),
		where
	)).then((snapshot: QuerySnapshot<DocumentData>) =>
		snapshot.docs.map(
			(doc: QueryDocumentSnapshot<DocumentData>) =>
				options.parser(doc.data)))

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