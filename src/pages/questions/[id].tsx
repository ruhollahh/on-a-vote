import { trpc } from "@/backend/utils/trpc";
import { ShowSession } from "@/components/ShowSession";
import { Box } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

const QuestionContent: React.FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = trpc.useQuery(["question.getById", { id }]);
  const { data: session, isLoading: isSessionLoading } = trpc.useQuery([
    "auth.getSession",
  ]);
  if (isLoading || isSessionLoading) return <div>loading...</div>;
  if (!data) {
    return <div>no questions found</div>;
  }
  return (
    <div>
      {session?.userId ? (
        <Box w="5xl" h="20" mx="auto" bgColor="teal.700">
          {data.body}
        </Box>
      ) : (
        <div>{data.body}</div>
      )}
      <div>
        {data.options.map((option) => (
          <span key={option.id}>{option.body}</span>
        ))}
      </div>
    </div>
  );
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
      <Link href="/">
        <a>Home</a>
      </Link>
    </>
  );
};

export default QuestionPage;
