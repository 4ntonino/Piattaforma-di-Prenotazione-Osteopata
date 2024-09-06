
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon, TimeIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isAuthenticated } = useContext(Context);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/message/getall",
        { withCredentials: true }
      );
      setMessages(data.messages);
    } catch (error) {
      toast.error(error.response.data.message || "Errore nel caricamento dei messaggi");
    } finally {
      setLoading(false);
    }
  };

  const handleShowMessage = (message) => {
    setSelectedMessage(message);
    onOpen();
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" textAlign="center" mb={8}>
        Messaggi Ricevuti
      </Heading>
      {loading ? (
        <Box textAlign="center">
          <Spinner size="xl" />
        </Box>
      ) : messages.length > 0 ? (
        <AnimatePresence>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {messages.map((message, index) => (
              <MotionBox
                key={message._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  bg={bgColor}
                  p={6}
                  rounded="lg"
                  shadow="md"
                  borderWidth="1px"
                  _hover={{ shadow: "lg", transform: "translateY(-5px)" }}
                  transition="all 0.3s"
                >
                  <VStack align="start" spacing={3}>
                    <Heading size="md">
                      {message.firstName} {message.lastName}
                    </Heading>
                    <HStack>
                      <EmailIcon color="blue.500" />
                      <Text fontSize="sm" color={textColor}>
                        {message.email}
                      </Text>
                    </HStack>
                    <HStack>
                      <PhoneIcon color="green.500" />
                      <Text fontSize="sm" color={textColor}>
                        {message.phone}
                      </Text>
                    </HStack>
                    <Text noOfLines={3} color={textColor}>
                      {message.message}
                    </Text>
                    <HStack justify="space-between" w="100%">
                      <Badge colorScheme="purple">
                        <TimeIcon mr={2} />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </Badge>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleShowMessage(message)}
                      >
                        Leggi tutto
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </AnimatePresence>
      ) : (
        <Text textAlign="center" fontSize="lg">
          Non ci sono messaggi al momento.
        </Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedMessage?.firstName} {selectedMessage?.lastName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={4}>
              <HStack>
                <EmailIcon color="blue.500" />
                <Text>{selectedMessage?.email}</Text>
              </HStack>
              <HStack>
                <PhoneIcon color="green.500" />
                <Text>{selectedMessage?.phone}</Text>
              </HStack>
              <Text fontWeight="bold">Messaggio:</Text>
              <Text>{selectedMessage?.message}</Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Chiudi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Messages;