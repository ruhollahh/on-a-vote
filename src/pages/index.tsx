import { trpc } from "@/backend/utils/trpc";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  ModalFooter,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/layout";
import type { NextPage } from "next";
import Link from "next/link";
import { FieldError, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateQuestion,
  createQuestionValidator,
} from "@/shared/createQuestionValidator";
import { ReactNode, useState } from "react";
import { FiPlusCircle, FiXCircle } from "react-icons/fi";
import { useRouter } from "next/router";

const QuestionModal = ({
  isModalOpen,
  closeModal,
  ...props
}: {
  isModalOpen: boolean;
  closeModal: () => void;
}) => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateQuestion>({
    defaultValues: {
      options: [{ body: "Yes" }, { body: "No" }],
    },
    resolver: zodResolver(createQuestionValidator),
  });

  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });

  const router = useRouter();

  const { mutate, isLoading } = trpc.useMutation("question.create", {
    onSuccess(data) {
      reset();
      closeModal();
      router.push(`/questions/${data.id}`);
    },
  });

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} {...props}>
      <ModalOverlay />
      <ModalContent
        color="gray.700"
        as="form"
        onSubmit={handleSubmit((data) => {
          console.log("submit");
          mutate(data);
        })}
      >
        <ModalHeader>Create a new poll question</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="3">
            <FormControl isInvalid={Boolean(errors.question)}>
              <FormLabel htmlFor="question">
                Write down your question:
              </FormLabel>
              <Input
                id="question"
                placeholder="Why are we here?"
                {...register("question")}
              />
              {Boolean(errors.question) && (
                <Text pt="1" fontSize="small" color="red.400">
                  {errors?.question?.message}
                </Text>
              )}
            </FormControl>
            <Text>Now add some options:</Text>
            <SimpleGrid columns={2} spacing={2}>
              {fields.map((field, index) => {
                return (
                  <FormControl key={field.id}>
                    <InputGroup>
                      <Input
                        placeholder="Option"
                        {...register(`options.${index}.body` as const)}
                      />
                      <InputRightElement>
                        <IconButton
                          icon={<FiXCircle />}
                          aria-label="delete option"
                          color="gray.700"
                          onClick={() => remove(index)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    {Boolean(errors?.options?.[index]?.body?.message) && (
                      <Text pt="1" fontSize="small" color="red.400">
                        {errors?.options?.[index]?.body?.message}
                      </Text>
                    )}
                  </FormControl>
                );
              })}
              <IconButton
                icon={<FiPlusCircle />}
                aria-label="add option"
                onClick={() =>
                  append({
                    body: "Another Option",
                  })
                }
              />
            </SimpleGrid>
            {Boolean((errors?.options as FieldError | undefined)?.message) && (
              <Text pt="1" fontSize="small" color="red.400">
                {(errors?.options as FieldError | undefined)?.message}
              </Text>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Flex justify="space-between" w="full">
            <Button variant="ghost" mr={3} onClick={closeModal}>
              Cancel
            </Button>
            <Button colorScheme="blue" isLoading={isLoading} type="submit">
              Submit
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["question.getAll"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Flex direction="column" gap="8" px="14" py="10">
      <Flex justify="space-between">
        <Heading as="h1">Poll Quesions</Heading>
        <Box>
          <Button
            variant="solid"
            bgColor="innerBg.500"
            sx={{
              "&:hover": { bgColor: "innerBg.400" },
            }}
            color="innerText.500"
            onClick={() => setIsModalOpen(true)}
          >
            Create Poll
          </Button>
          <QuestionModal isModalOpen={isModalOpen} closeModal={closeModal} />
        </Box>
      </Flex>
      <Flex direction="column" gap="4">
        {data?.map((question) => (
          <Box
            key={question.id}
            bgColor="innerBg.500"
            sx={{
              "&:hover": { bgColor: "innerBg.400" },
            }}
            color="innerText.500"
            p="4"
            rounded="md"
          >
            <Link href={`/questions/${question.id}`}>
              <a>
                <Flex justify="space-between">
                  <Flex direction="column" gap="1">
                    <Text fontSize="lg">{question.body}</Text>
                    <Text fontSize="small" fontStyle="italic">
                      by {question.user.name}
                    </Text>
                  </Flex>
                  <Text fontSize="x-small" fontWeight="bold">
                    {question.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </Flex>
              </a>
            </Link>
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

export default Home;
