// app/api/family/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { FamilyData } from '../../types/family';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'data', 'family-data.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const familyData: FamilyData = JSON.parse(fileData);
    return NextResponse.json(familyData);
  } catch (err) {
    console.error('Failed to read family data:', err);
    return NextResponse.json({ error: 'Failed to load family data' }, { status: 500 });
  }
}
