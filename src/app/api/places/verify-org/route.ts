import { NextResponse } from 'next/server';
import { placesApi } from '@/lib/api/places';

// In src/types.ts (or a similar file)
export type Organization = {
  id: string;
  name: string;
  // ... any other properties of your organization objects
};

export async function POST(request: Request) {
  try {
    const { organizationId } = await request.json();
    const orgs = await placesApi.getOrg();

    console.log("Organizations:", orgs);

    if (!orgs || !orgs.length) {
      return NextResponse.json(
        { success: false, error: 'No organizations found' },
        { status: 404 }
      );
    }

    // Check if the provided organizationId exists in the list of orgs
    const isValidOrg = orgs.some((org) => org.id === organizationId);

    if (isValidOrg) {
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
