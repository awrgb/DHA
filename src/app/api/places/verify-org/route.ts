// src/app/api/places/verify-org/route.ts
import { NextResponse } from 'next/server';
import { placesApi } from '@/lib/api/places';

export async function POST(request: Request) {
  try {
    const { organizationId } = await request.json();
    const org = await placesApi.getOrg();

    console.log("Organizations:", org);

    if (!org || !org.length) {
      return NextResponse.json(
        { success: false, error: 'No organizations found' },
        { status: 404 }
      );
    }

    const backendOrgId = org[0].id; // Assuming org[0] is the relevant organization

    if (organizationId === backendOrgId) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid organization ID' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying organization ID:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
