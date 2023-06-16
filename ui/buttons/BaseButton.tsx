import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export const BaseButton = (props: ButtonProps) => {
	return (
		<Button {...props} />
	);
}

const Button = styled.button`
	
`
