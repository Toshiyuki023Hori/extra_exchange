import { css } from 'styled-components';
import down_arrow from '../../../assets/DownArrow.png';

export const Colors = {
  main: '#8DD6FF',
  characters: '#6C7880',
  subcolor1: '#D9F1FF',
  accent1: '#70AACC',
  accent2: '#466A80',
};

export const mixinHeaderSpace = css`
  margin-top: 110px;
`;

export const mixinUserMarginLeft = css`
  margin-left: 30px;
`;

export const mixinHoverUnderlineEffect = css`
  position: absolute;
  left: 0;
  bottom: -4px;
  content: '';
  width: 100%;
  height: 2px;
  transform: scale(0, 1);
  transition: transform 0.3s;
`;

export const mixinUlLabel = css`
  float: left;
  font-weight: 700;
`;

export const mixinInputForm = css`
  background: white;
  height: 40px;
  width: 50%;
  border: 1.2px solid ${Colors.accent1};

  &::placeholder {
    color: ${Colors.characters};
    font-size: 0.82rem;
  }
`;

export const mixinLiTag = css`
  list-style: none;
  display: flex;
  align-items: center;
`;

export const mixinDropDown = css`
  border: 1.2px solid #70aacc;
  padding: 10px 15px;
  outline: none;
  background: url(${down_arrow});
  background-repeat: no-repeat;
  background-size: 17px 19px;
  background-position: right 10px center;
`

export const mixinTextArea = css`
  background: white;
  width: 50%;
  height: 200px;
  border: 1.2px solid ${Colors.accent1};
  position: relative;
  white-space: pre-wrap;

  &::placeholder {
    color: ${Colors.characters};
  }
`;