import React from 'react';
import styled from 'styled-components';

interface BaseCardProps {
	children: any;
}

export const BaseCard = ({ children }: BaseCardProps) => {

	return (
		<Container>
			{children}
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	border-radius: 0.5rem;
	padding: 1rem;
	position: relative;
	flex-direction: column;
	width: calc(100% - 2rem);
	max-width: 20rem;
	background: #ffffff;
	box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`