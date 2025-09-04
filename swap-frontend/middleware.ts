
import { withAuth } from 'next-auth/middleware';
export default withAuth({ callbacks: { authorized: ({ token }) => !!token } });
export const config = { matcher: ['/dashboard/:path*','/matches/:path*','/courses/:path*','/requests/:path*','/sessions/:path*','/chat/:path*','/profile/:path*'] };
