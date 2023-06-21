import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SkeletonProps {
	width?: number,
	height?: number,
	children?: any;
}

export const Skeleton = ({
	width = 5,
	height = 2,
	children,
}: SkeletonProps) => {

	return (
		<Container width={width} height={height}>
			<Shimmer />
			{children}
		</Container>
	);
}

const shimmer = keyframes`
	from {
			transform: translateX(-100%);
	}
	to{
			transform: translateX(200%);
	}
`

const Container = styled.div<{
	width?: number,
	height?: number,
}>`
	background: #ededed;
	width: 100%;
	max-width: ${props => props.width}rem;
	height: ${props => props.height}rem;
	position: relative;
	display: flex;
	border-radius: 0.25rem;
	overflow: hidden;
	align-items: center;
	justify-content: center;
`

const Shimmer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 50%;
	height: 100%;

	background: linear-gradient(
		100deg,
		rgba(255,255,255,0) 20%,
		rgba(255,255,255,0.5) 50%,
		rgba(255,255,255,0) 80%
	);

	animation: ${shimmer} 1s infinite linear;
`