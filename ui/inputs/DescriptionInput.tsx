import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { BaseInput } from './BaseInput';
import { InfoCard } from '@ui/styles';

interface DescriptionInputProps {
	placeholder?: string,
	onChange?: (value: string) => void,
	initialValue?: string,
}

export const DescriptionInput = ({ placeholder, onChange, initialValue }: DescriptionInputProps) => {

	const handleChange = (e: any) => {
		if (onChange) {
			onChange!(e.target.value)
		}
	}

	return (
		<Content>
			<TextArea
				placeholder={placeholder}
				onChange={handleChange}
				autoFocus >
				{initialValue}
			</TextArea>
		</Content>
	);
}

const Content = styled.div`
	position: relative;
	min-height: 6rem;
	border: 1px solid #e7e7e7;
	border-radius: 0.25rem;
	font-size: 0.9rem;
	display: flex;
	align-items: center;
	justify-content: center;
	width: calc(100% - 1.5rem);
	overflow: hidden;
	padding: 0.75rem;
	&:has(textarea:focus) {
		border-color: #0073f6;
	}
`

const TextArea = styled.textarea`
	border: 0;
	width: 100%;
	height: 100%;
	min-height: 6rem;
	font-size: 0.8rem;
	position: relative;
	margin: 0;
	padding: 0;
	resize: vertical;
	outline: none;
`
