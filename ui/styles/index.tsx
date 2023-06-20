import styled from "styled-components"

export const CardContent = styled.div<{ isLoading?: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	justify-content: center;
	width: 100%;
	opacity: ${props => props.isLoading ? "0.5" : "1.0"};
	pointer-events: ${props => props.isLoading ? "none" : "all"};
	& > *:not(:last-child) {
		margin-bottom: 0.5rem;
	}
`

export const InfoCard = styled.div`
	height: 2.5rem;
	border: 1px solid #e7e7e7;
	border-radius: 0.25rem;
	font-size: 0.9rem;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
`

export const Input = styled.input`
	padding: 0rem 1rem;
	border: 0;
	height: 2.5rem;
	font-size: 0.8rem;
	border-radius: 0.25rem;
	background: #ffffff;
	border: 1px solid #e7e7e7;
	width: calc(100% - 2rem);
	outline: 0;
	&::placeholder {
		color: #8c8c8c;
	}
	&:focus {
		border-color: #0091ff;

	}
	&:disabled {
		background: #e7e7e7;
		box-shadow: none;
	}
`

export const InputWrapper = styled.div`	
	display: flex;
	flex-direction: row;
	width: 100%;
	border: 1px solid #e7e7e7;
	border-radius: 0.25rem;
	overflow: hidden;
	& > input {
		flex: 1;
		border: 0;
	}
	&:has(> input:focus) {
		border-color: #0091ff;
	}
`

export const InputLabel = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.8rem;
	padding-left: 1rem;
	color: #8c8c8c;
`

export const Header = styled.div`
	display: flex;
	flex-direction: column;
	padding-bottom: 0.5rem;
`

export const Title = styled.div`
	font-size: 1.4rem;
	font-weight: 800;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
`

export const Subtitle = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 0.9rem;
`

export const Button = styled.button`
	display: flex;
	align-items: center;
	text-align: center;
	justify-content: center;
	padding: 0rem 1rem;
	height: 2.5rem;
	border: 0;
	color: #ffffff;
	border-radius: 0.25rem;
	font-size: 0.75rem;
	cursor: pointer;
	font-weight: 500;
`

export const LinkButton = styled(Button)`
	background: #ffffff;
	color: #8c8c8c;
	text-decoration: underline;
	width: 10rem;
	&:hover, &:active {
		color: #ff0000;
	}
`

export const PrimaryButton = styled(Button) <{ color?: string }>`
	background: ${props => props.color};
	transition: all 0.3s ease;
	width: 100%;
	&:hover {
		filter: brightness(1.1);
	}
	&:active {
		transform: scale(0.98);
		filter: brightness(0.95);
	}
	&:disabled {
		background: #f8f8f8;
		color: #000000;
		cursor: default;
		&:hover {
			filter: brightness(1.0);
		}
	}
`

export const StateButton = styled(Button)`
	background: #f8f8f8;
	color: #000000;
	transition: all 0.3s ease;
	width: 100%;
	cursor: default;
`

export const Symbol = styled.span<{ color?: string }>`
	color: ${props => props.color};
	font-size: 1.3rem;
	margin-left: 0.5rem;
`

export const Note = styled.span`
	color: #8a8a8a;
	margin-top: 1rem;
	font-size: 0.9rem;
	text-align: center;
	max-width: 16rem;
`

export const Spacer = styled.div<{ height?: number }>`
	display: flex;
	height: ${props => props.height ?? "1.0"}rem;
`

export const Loading = styled.span`
	font-size: 0.8rem;
	font-weight: 500;
`

export const Error = styled.div`
	padding: 0 0.25rem;
	height: 2.5rem;
	border: 1px solid #ff0000;
	border-radius: 0.25rem;
	font-size: 0.9rem;
	color: #ff0000;
	display: flex;
	align-items: center;
	justify-content: center;
	width: calc(100% - 0.5rem);
`