import styled from 'styled-components';

type Props = {
	children: any;
}

export const BaseLayout = ({ children }: Props) => {

	return (
		<Section>
			{children}
		</Section>
	);
}

const Section = styled.section`
	display: flex;
`