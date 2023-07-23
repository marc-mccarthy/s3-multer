/// ImageList.styles.js

import styled from 'styled-components';

export const ImageListStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px 10px;
  background: #f5f5f5; 
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
