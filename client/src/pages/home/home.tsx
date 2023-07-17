import React from "react";
import { HomeContainer, HomeForm, HomeResponse, HomeResponses, HomeWrapper } from "@/pages/home/home.styles";
import languages from "@/../../shared/languages";

type Response = {
  input: string;
  output: string;
};

export default function Home() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const [responses, setResponses] = React.useState<Response[]>([
    {
      input: "Hello, my name is Alice",
      output: "\n\nBonjour, je m'appelle Alice.",
    },
    {
      input: "Hello, my name is Bob",
      output: "\n\nBonjour, je m'appelle Bob.",
    },
  ]);

  return (
    <HomeWrapper>
      <HomeResponses>
        <HomeContainer>
          {responses.map((response, index) => {
            return (
              <HomeResponse key={index}>
                <h5>
                  <em>{response.input}</em>
                </h5>
                <code>
                  <pre>{response.output}</pre>
                </code>
              </HomeResponse>
            );
          })}
        </HomeContainer>
      </HomeResponses>
      <HomeForm
        onSubmit={(event) => {
          event.preventDefault();
          const input = inputRef.current!;
          const select = selectRef.current!;
          const text = input.value.trim();
          const language = select.value;
          input.value = "";
          console.log({ text, language });
        }}
      >
        <HomeContainer>
          <input ref={inputRef} type="text" name="text" autoFocus placeholder="Enter text for translation..." />
          <select ref={selectRef} name="language">
            <option value="">Translate to:</option>
            {languages.map((language, index) => {
              return (
                <option key={index} value={language}>
                  {language}
                </option>
              );
            })}
          </select>
          <button type="submit">Translate</button>
        </HomeContainer>
      </HomeForm>
    </HomeWrapper>
  );
}
