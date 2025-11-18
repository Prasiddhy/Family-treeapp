import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Person, FamilyData } from '../../types/family';

export async function POST(req: NextRequest) {
  const newPerson: Person = await req.json();

  const filePath = path.join(process.cwd(), 'app', 'data', 'family-data.json');

  // Ensure the file exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
  }

  // Read current family data
  let familyData: FamilyData = {};
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    familyData = JSON.parse(fileData);
  } catch (err) {
    console.error('Failed to read family data:', err);
    return NextResponse.json({ success: false, error: 'Failed to read family data' }, { status: 500 });
  }

  // Add new person
  familyData[newPerson.id] = newPerson;

  // Write updated data
  try {
    fs.writeFileSync(filePath, JSON.stringify(familyData, null, 2), 'utf8');
    return NextResponse.json({ success: true, person: newPerson });
  } catch (err) {
    console.error('Failed to write family data:', err);
    return NextResponse.json({ success: false, error: 'Failed to save member' }, { status: 500 });
  }
}
