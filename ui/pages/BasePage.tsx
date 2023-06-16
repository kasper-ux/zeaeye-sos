import Head from 'next/head';
import { Fragment } from 'react';
import styled from 'styled-components';

type Props = {
	title: string,
	description?: string,
	children?: any,
}

export default function BasePage({
	title,
	description,
	children,
}: Props) {
	return (
		<Page>
			<Head>
				<Title>{title}</Title>
				<Meta name="description" content={description} />
				<Meta name="viewport" content="width=device-width, initial-scale=1" />
				<Link rel="icon" href="/favicon.ico" />
			</Head>
			<Main>
				{children}
			</Main>
		</Page>
	);
}

const Main = styled.main`
	display: flex;
	flex-direction: column;
`

const Title = styled.title``
const Meta = styled.meta``
const Link = styled.link``
const Page = Fragment;