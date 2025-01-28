import { NextResponse } from 'next/server';
import { placesApi } from '@/lib/api/places';

// Assuming you have an Organization type defined somewhere, e.g., in a types.ts file:
// import { Organization } from '@/types';
// If not, define it here or adjust as needed:
type Organization = {
  id: string;
  name: string;
  // ... other properties of your Organization type
};

export async function GET(request: Request) {
  try {
    // Extract organization ID from query parameters
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const orgs = await placesApi.getOrg();

    if (!orgs || !orgs.length) {
      return NextResponse.json(
        { success: false, error: 'No organizations found' },
        { status: 404 }
      );
    }

    // Find the organization by ID, now with type annotation
    const org: Organization | undefined = orgs.find((org: Organization) => org.id === organizationId);

    if (org) {
      return NextResponse.json({ success: true, data: org });
    } else {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching organization by ID:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
