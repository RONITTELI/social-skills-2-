import { NextResponse } from 'next/server';
import Analysis from '@/models/Analysis';
import dbConnect from '@/lib/mongodb';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    // Get the full history for each type
    const types = ['speech', 'emotion', 'posture'];
    const results = {};
    for (const type of types) {
      const history = await Analysis.find({ userId, type }).sort({ createdAt: -1 });
      results[type] = history.map(item => ({
        data: item.data,
        createdAt: item.createdAt
      }));
    }
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
