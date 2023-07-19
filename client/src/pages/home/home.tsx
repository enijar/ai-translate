import React from "react";
import {
  HomeContainer,
  HomeError,
  HomeForm,
  HomeLoader,
  HomeResponse,
  HomeResponses,
  HomeWrapper,
} from "@/pages/home/home.styles";
import languages from "@/../../shared/languages";
import config from "@/config";
import Loader from "@/components/loader/loader";

type Response = {
  text: string;
  language: string;
  result: string;
};

export default function Home() {
  const responsesRef = React.useRef<HTMLElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selectRef = React.useRef<HTMLSelectElement>(null);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [responses, setResponses] = React.useState<Response[]>([]);

  React.useLayoutEffect(() => {
    const responses = responsesRef.current!;
    const input = inputRef.current!;
    responses.scrollTop = responses.scrollHeight;
    input.focus();
  }, [responses]);

  return (
    <HomeWrapper>
      <HomeResponses ref={responsesRef}>
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
          {loading && (
            <HomeLoader>
              <Loader />
            </HomeLoader>
          )}
        </HomeContainer>
      </HomeResponses>
      <HomeForm
        onSubmit={async (event) => {
          event.preventDefault();
          if (loading) return;
          const input = inputRef.current!;
          const select = selectRef.current!;
          const text = input.value.trim();
          const language = select.value;
          if (text.length === 0) {
            return setError("Enter text for translation");
          }
          if (text.length > 500) {
            return setError("Text must be 500 or less characters");
          }
          if (language.length === 0) {
            return setError("Select a language to translate to");
          }
          setError(null);
          setLoading(true);
          try {
            const res = await fetch(`${config.apiUrl}/api/translate-text`, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text, language }),
            });
            if (res.ok) {
              const response: Response = await res.json();
              setResponses((responses) => [...responses, response]);
              input.value = "";
            }
          } catch (err) {
            console.error(err);
            setError("Server error, try again");
          } finally {
            setLoading(false);
          }
        }}
      >
        <HomeContainer>
          {error !== null && <HomeError>{error}</HomeError>}
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
