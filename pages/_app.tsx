import AuthenticationProvider from '@utils/providers/AuthenticationProvider'
import FirestoreProvider from '@utils/providers/FirestoreProvider'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AuthenticationProvider>
			<FirestoreProvider>
				<Component {...pageProps} />
			</FirestoreProvider>
		</AuthenticationProvider>
	)
}