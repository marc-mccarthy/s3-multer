import styled from 'styled-components';

export const Container = styled.div`
	max-width: 500px;
	margin: 2rem auto;
	padding: 2rem 1rem;
	border: 1px solid #ddd;
`;

export const Form = styled.form`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
`;

export const Input = styled.input`
	margin: 0.5rem 0;
	padding: 0.5rem;
`;

export const Button = styled.button`
	background: blue;
	color: white;
	border: none;
	padding: 0.5rem 1rem;
	border-radius: 5px;
	cursor: pointer;
`;
