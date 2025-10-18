import { createBrowserRouter } from 'react-router';
import { AdminLayout } from './core/components/admin-layout';
import { NotFoundPage } from './core/components/not-found-page';
import { ScreenLayout } from './core/components/screen-layout';

// Importar rutas modulares
import { adminRoutes } from './modules/administator-panel/admin.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { calendarEventsRoutes } from './modules/calendar-events/calendar-events.routes';
import { checkoutRoutes } from './modules/checkout/checkout.routes';
import { culturalPlacesRoutes } from './modules/cultural-places/cultural-places.routes';
import { eventsRoutes } from './modules/events/events.routes';
import { myTicketRoutes } from './modules/my-tickets/my-tickets.routes';
import { recommendationsRoutes } from './modules/preference-recommendations/preference-recommendations.routes';
import { recomendationsRoutes } from './modules/recomendations/recomendations.routes';
import { ticketRoutes } from './modules/ticket/ticket.routes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ScreenLayout />,
    children: [
      ...culturalPlacesRoutes,
      ...eventsRoutes,
      ...calendarEventsRoutes,
      ...ticketRoutes,
      ...myTicketRoutes,
      ...checkoutRoutes,
      ...recommendationsRoutes,
      ...recomendationsRoutes,
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: adminRoutes,
  },
  ...authRoutes,
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export { router };
