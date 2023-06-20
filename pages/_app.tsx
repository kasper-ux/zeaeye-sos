import AuthenticationProvider from '@utils/providers/AuthenticationProvider'
import FirestoreProvider from '@utils/providers/FirestoreProvider'
import type { AppProps } from 'next/app'
import './_style.css';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthenticationProvider>
			<Toaster toastOptions={{
				style: {
					fontSize: "0.85rem",
					fontWeight: "500",
					letterSpacing: "0.1px",
				},
			}} />
			<FirestoreProvider>
				<Component {...pageProps} />
			</FirestoreProvider>
		</AuthenticationProvider>
	)
}