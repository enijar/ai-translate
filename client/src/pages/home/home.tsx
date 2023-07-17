import React from "react";
import { HomeContainer, HomeForm, HomeResponse, HomeResponses, HomeWrapper } from "@/pages/home/home.styles";
import languages from "@/../../shared/languages";
import config from "@/config";

type Response = {
  text: string;
  language: string;
  result: string;
};

export default function Home() {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const [loading, setLoading] = React.useState(false);

  const [responses, setResponses] = React.useState<Response[]>([
    {
      text: "Hello, my name is Alice",
      language: "french",
      result: "\n\nBonjour, je m'appelle Alice.",
    },
    {
      text: "Hello, my name is Bob",
      language: "french",
      result: "\n\nBonjour, je m'appelle Bob.",
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
                  Text: <em>{response.text}</em>
                  <br />
                  Language: <em>{response.language}</em>
                </h5>
                <code>
                  <pre>{response.result}</pre>
                </code>
              </HomeResponse>
            );
          })}
        </HomeContainer>
      </HomeResponses>
      <HomeForm
        onSubmit={async (event) => {
          event.preventDefault();
          if (loading) return;
          setLoading(true);
          const input = inputRef.current!;
          const select = selectRef.current!;
          const text = input.value.trim();
          const language = select.value;
          try {
            const res = await fetch(`${config.apiUrl}/api/translate`, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text, language }),
            });
            const response: Response = await res.json();
            setResponses((responses) => [...responses, response]);
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
          input.value = "";
          console.log({ text, language });
        }}
      >
        <HomeContainer>
          <input
            ref={inputRef}
            type="text"
            name="text"
            autoFocus
            placeholder="Enter text for translation..."
            disabled={loading}
          />
          <select ref={selectRef} name="language" disabled={loading}>
            <option value="">Translate to:</option>
            {languages.map((language, index) => {
              return (
                <option key={index} value={language}>
                  {language}
                </option>
              );
            })}
          </select>
          <button type="submit" disabled={loading}>
            Translate
          </button>
        </HomeContainer>
      </HomeForm>
    </HomeWrapper>
  );
}
