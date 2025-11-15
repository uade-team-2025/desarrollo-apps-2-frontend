import { Box, Heading, Stack } from '@chakra-ui/react';

export const BI = () => {
  return (
    <Stack gap={6}>
      <Heading size="lg" color="gray.800">
        Reportes y Business Intelligence
      </Heading>

      <Box
        w="100%"
        h="calc(100vh - 100px)"
        minH="600px"
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        bg="white"
      >
        <iframe
          src="http://dashboard.marianogimenez.ar/"
          width="100%"
          height="100%"
          style={{
            border: 'none',
            display: 'block',
          }}
          title="Dashboard de Business Intelligence"
          allow="fullscreen"
        />
      </Box>
    </Stack>
  );
};
