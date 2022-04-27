import { trpc } from "@/backend/utils/trpc";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

const QuestionContent: React.FC<{ id: string }> = ({ id }) => {
  const { data: question, isFetching } = trpc.useQuery([
    "question.getById",
    { id },
  ]);
  const { isLoading: isSessionLoading } = trpc.useQuery(["auth.getSession"]);
  const client = trpc.useContext();
  const { mutate, isLoading: isVoting } = trpc.useMutation("question.vote", {
    onSuccess() {
      client.invalidateQueries(["question.getById", { id }]);
    },
  });
  if (isFetching || isSessionLoading) return <div>loading...</div>;
  if (!question) {
    return <div>no questions found</div>;
  }

  return (
    <Flex direction="column" gap="4">
      {question.isOwner && (
        <Text p="5" bgColor="purple.700" color="white">
          You created this!
        </Text>
      )}
      <Heading>{question.body}</Heading>
      <Flex direction="column" gap="2">
        {question.options.map((option) => (
          <Box key={option.id}>
            {question.userVote ? (
              <Text
                textDecoration={
                  question.userVote.optionId === option.id
                    ? "underline"
                    : "none"
                }
              >
                {option.body} - {option._count.votes}
              </Text>
            ) : (
              <Button
                onClick={() =>
                  mutate({ questionId: question.id, optionId: option.id })
                }
                isLoading={isVoting}
                isDisabled={isVoting}
                color="innerText.500"
                w="fit-content"
              >
                {option.body}
              </Button>
            )}
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

const QuestionPage = () => {
  const {
    query: { id },
  } = useRouter();
  if (!id || typeof id !== "string") {
    return <div>No Id</div>;
  }
  return <QuestionContent id={id} />;
};

export default QuestionPage;
