import { Box, Heading, Stack, Tabs } from '@chakra-ui/react';
import { useAuth } from '../../../core/contexts/auth-context';

const dashboards = [
  {
    name: 'Festival Verde',
    url: 'https://dashboard.marianogimenez.ar/festival-verde?iframe=true', // siempre mandar iframe=true
  },
  {
    name: 'Respuesta Climatica',
    url: 'https://dashboard.marianogimenez.ar/respuesta-climatica?iframe=true',
  },
];

export const BI = () => {
  const { token } = useAuth();
  return (
    <Stack gap={6}>
      <Heading size="lg" color="gray.800">
        Reportes y Business Intelligence
      </Heading>

      <Tabs.Root
        defaultValue={dashboards[0].name}
        variant={'enclosed'}
        colorPalette="green"
      >
        <Tabs.List>
          {dashboards.map((dashboard) => (
            <Tabs.Trigger key={dashboard.name} value={dashboard.name}>
              {dashboard.name}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>

        {dashboards.map((dashboard) => (
          <Tabs.Content key={dashboard.name} value={dashboard.name} pt={1}>
            <Box
              w="100%"
              h="100vw"
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              bg="white"
            >
              <iframe
                src={dashboard.url + `&token=${token}`}
                width="100%"
                height="100%"
                style={{
                  border: 'none',
                  display: 'block',
                }}
                title={dashboard.name}
                allow="fullscreen"
              />
            </Box>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Stack>
  );
};
