import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import RootLayout from '@/layouts/root/RootLayout';
import { LoadingProgress } from '@/components/loader'; // ROLE BASED PERMISSION TEST PAGE

const Permission = lazy(() => import('@/pages/permission')); // FEATURES RELATED PAGES

const Faqs = lazy(() => import('@/pages/faq'));
const Cart = lazy(() => import('@/pages/cart'));
const Pricing = lazy(() => import('@/pages/pricing'));
const Checkout = lazy(() => import('@/pages/checkout'));
const ContactUs = lazy(() => import('@/pages/contact-us'));
const ComingSoon = lazy(() => import('@/pages/coming-soon'));
const Maintenance = lazy(() => import('@/pages/maintenance'));


const LAYOUT_CONTENT = <RootLayout>
    <Suspense fallback={<LoadingProgress />}>
      <Outlet />
    </Suspense>
  </RootLayout>;
export const PublicRoutes = [{
  path: 'permission',
  element: <Permission />
}, {
  path: 'maintenance',
  element: <Maintenance />
}, {
  path: 'coming-soon',
  element: <ComingSoon />
}];