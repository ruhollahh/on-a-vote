import { trpc } from "@/backend/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";

const QuestionContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(["question.getById", { id }]);
  if (isLoading) return <div>loading...</div>;
  if (!data) {
    return <div>no questions found</div>;
  }
  return <div>{data?.question}</div>;
};

const QuestionPage = () => {
  const {
    query: { id },
  } = useRouter();
  if (!id || typeof id !== "string") {
    return <div>No Id</div>;
  }
  return (
    <>
      <QuestionContent id={id} />
      <Link href="/">Home</Link>
    </>
  );
};

export default QuestionPage;
