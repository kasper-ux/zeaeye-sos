import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const BaseInput: React.FC<InputProps> = (props: InputProps) => {

	return (
		<Input {...props} />
	);
}

const Input = styled.input`
	
`