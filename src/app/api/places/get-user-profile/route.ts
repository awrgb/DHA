// src/app/api/places/get-user-profile/route.ts
import { NextResponse } from 'next/server';
import { placesApi } from '@/lib/api/places';

export async function GET() {
  try {
    const userProfile = await placesApi.getUser();
    console.log(userProfile);
    return NextResponse.json({ success: true, userProfile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
