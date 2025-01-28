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
    // 1. Extract organization ID from query parameters
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    // 2. Validate organization ID
    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 } // Bad Request
      );
    }

    // 3. Fetch organizations (adjust this part based on your actual API)
    const orgs = await placesApi.getOrg();

    // 4. Check if organizations were fetched successfully
    if (!orgs || !orgs.length) {
      return NextResponse.json(
        { success: false, error: 'No organizations found' },
        { status: 404 } // Not Found
      );
    }

    // 5. Find the organization by ID
    const org: Organization | undefined = orgs.find((org: Organization) => org.id === organizationId);

    // 6. Return the organization or an error
    if (org) {
      return NextResponse.json({ success: true, data: org });
    } else {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 } // Not Found
      );
    }
  } catch (error) {
    // 7. Handle errors
    console.error('Error fetching organization by ID:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 } // Internal Server Error
    );
  }
}
