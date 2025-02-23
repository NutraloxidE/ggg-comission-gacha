import { Box, Spinner, Text } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="gray.100"
    >
      <Spinner size="xl" color="blue.500" />
      <Text mt={4} fontSize="xl" color="gray.700">
        Loading...
      </Text>
    </Box>
  );
}