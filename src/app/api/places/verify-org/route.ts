import { NextResponse } from 'next/server';
import { placesApi } from '@/lib/api/places';

export async function POST(request: Request) {
  try {
    const { organizationId } = await request.json();
    const org = await placesApi.getOrg();
    const backend_org_id = org[0].id;
    console.log(backend_org_id)

    if (organizationId === backend_org_id) {
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
