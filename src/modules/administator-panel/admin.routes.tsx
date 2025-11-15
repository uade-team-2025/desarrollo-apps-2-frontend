import type { RouteObject } from 'react-router';

// Importar rutas de submódulos administrativos
import { BI } from './bi/bi';
import { culturalPlacesManagementRoutes } from './cultural-places/cultural-places.routes';
import { dashboardRoutes } from './dashboard/dashboard.routes';
import { eventsManagementRoutes } from './events/events.routes';
import { ticketsManagementRoutes } from './tickets/tickets.routes';
import { usersManagementRoutes } from './users/users.routes';

const ComingSoon = ({ title }: { title: string }) => (
  <div style={{ textAlign: 'center', padding: '2rem' }}>
    <h2>{title}</h2>
    <p>Esta sección está en desarrollo</p>
  </div>
);

export const adminRoutes: RouteObject[] = [
  ...dashboardRoutes,
  ...eventsManagementRoutes,
  ...culturalPlacesManagementRoutes,
  ...ticketsManagementRoutes,
  ...usersManagementRoutes,
  {
    path: 'reportes',
    element: <BI />,
  },
  {
    path: 'configuracion',
    element: <ComingSoon title="Configuración" />,
  },
];
