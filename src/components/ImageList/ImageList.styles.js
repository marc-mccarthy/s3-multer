import styled from 'styled-components';

export const ImageListStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px 10px;
  background: #E3856B; 
`;

export const Title = styled.h2`
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  color: #333;
  letter-spacing: 2px;
  font-size: 1.2rem;
`; 

export const Image = styled.img`
  max-width: 200px;
  height: auto; 
  margin: 10px;
  border-radius: 4px;
  box-shadow: 0 0 6px #ccc;
`;

export const ImageWrapper = styled.div`
  padding: 10px;
  border: 1px solid #ddd;
  margin: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;
