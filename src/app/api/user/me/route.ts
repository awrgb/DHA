// src/app/api/user/me/route.ts
import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { currentUser } from '@/lib/current-user';

export async function GET() {
  console.log('[USER_GET]: I called it');
  const session = await auth();
  console.log('[USER_GET]: Session', session);
  if (!session?.user) {
    console.log('[USER_GET]: No session');
    return new NextResponse(null, { status: 401 });
  }

  try {
    const user = await currentUser(session.user.accessToken);
    if (!user) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('[USER_GET]', error);
    return new NextResponse(null, { status: 500 });
  }
}
