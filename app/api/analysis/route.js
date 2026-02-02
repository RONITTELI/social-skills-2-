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
        scenarioId: item.scenarioId,
        scenarioTitle: item.scenarioTitle,
        createdAt: item.createdAt
      }));
    }
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, type, data, scenarioId, scenarioTitle } = body;
    
    if (!userId || !type || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const analysis = await Analysis.create({
      userId,
      type,
      data,
      scenarioId,
      scenarioTitle,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
