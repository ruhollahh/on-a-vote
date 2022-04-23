import { trpc } from "@/backend/utils/trpc";
import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const client = trpc.useContext();
  const { mutate, error, isLoading } = trpc.useMutation("question.create", {
    async onSuccess() {
      await client.invalidateQueries(["question.getAll"]);
      setQuestion("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ body: question, options: ["a", "b", "c", "d"] });
      }}
    >
      <label htmlFor="question">New Question:</label>
      <input
        id="question"
        disabled={isLoading}
        onChange={(e) => setQuestion(e.target.value)}
        value={question}
      />
      {error && <p>{error.message}</p>}
    </form>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["question.getAll"]);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {data?.map((q) => (
        <div key={q.id}>
          <Link href={`/questions/${q.id}`}>{q.body}</Link>
        </div>
      ))}
      <QuestionForm />
    </div>
  );
};

export default Home;
