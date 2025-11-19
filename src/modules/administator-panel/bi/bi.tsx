import { Box, Heading, Stack, Tabs } from '@chakra-ui/react';
export const BI = () => {
  return (
    <Stack gap={6}>
      <Heading size="lg" color="gray.800">
        Reportes y Business Intelligence
      </Heading>

      <Tabs.Root defaultValue="festival-verde" variant={'enclosed'}>
        <Tabs.List>
          <Tabs.Trigger value="festival-verde">Festival Verde</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        <Tabs.Content value="festival-verde" pt={1}>
          <Box
            w="100%"
            h="100vw"
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            bg="white"
          >
            <iframe
              src="https://dashboard.marianogimenez.ar/festival-verde"
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
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
};
