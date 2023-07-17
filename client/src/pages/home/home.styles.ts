import styled from "styled-components";

export const HomeForm = styled.form`
  background-color: #404040;
  padding: 2em 1em;
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  grid-template-rows: 2em;
  gap: 1em;
  align-items: center;

  input, select, button {
    display: block;
    height: 100%;

    :focus {
      outline: 0.1em solid rgba(255, 255, 255, 0.9);
    }
  }

  input {
    width: 100%;
    border: none;
    font-size: 20px;
    line-height: 1em;
    border-radius: 20em;
    background-color: rgba(255, 255, 255, 0.1);
    color: #f0f0f0;
    padding-inline: 1em;
    vertical-align: middle;

    ::placeholder {
      color: #f0f0f0;
      opacity: 0.75;
    }
  }

  select {
    background-color: transparent;
    padding-inline: 1em;
    cursor: pointer;
  }

  button {
    border: none;
    background-color: rgba(0, 255, 0, 0.25);
    font-size: 20px;
    line-height: 1em;
    border-radius: 20em;
    padding-inline: 1em;
    cursor: pointer;

    :hover {
      background-color: rgba(0, 255, 0, 0.35);
    }
  }
`;

export const HomeResponse = styled.section`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  font-size: 16px;

  h5 {
    font-weight: bold;
  }
`;

export const HomeResponses = styled.article`
  max-height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  gap: 1em;
  padding: 1em;
`;

export const HomeWrapper = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr max-content;
`;
