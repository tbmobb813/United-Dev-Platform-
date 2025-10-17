import NextAuth from 'next-auth';
import { authOptions } from '@udp/server-utils';

export default NextAuth(authOptions);
