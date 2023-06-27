import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const BaseInput: React.FC<InputProps> = (props: InputProps) => {

	return (
		<Input {...props} />
	);
}

const Input = styled.input`
	border: 0;
	width: 100%;
	height: 100%;
	font-size: 1rem;
	padding: 0 0.75rem;
`