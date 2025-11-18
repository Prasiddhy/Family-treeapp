import { Person, FamilyNode, FamilyData } from '../types/family';

export function getPersonById(id: string, data: FamilyData): Person | null {
  return data[id] || null;
}

export function getSpouse(person: Person, data: FamilyData): Person | null {
  if (!person.spouseId) return null;
  return getPersonById(person.spouseId, data);
}

export function getChildren(person: Person, data: FamilyData): Person[] {
  if (!person.children) return [];
  return person.children
    .map(id => getPersonById(id, data))
    .filter((p): p is Person => p !== null);
}

export function calculateAge(birthYear?: number, deathYear?: number): number | null {
  if (!birthYear) return null;
  const currentYear = new Date().getFullYear();
  const endYear = deathYear || currentYear;
  return endYear - birthYear;
}

export function isAlive(person: Person): boolean {
  return person.isAlive ?? !person.deathYear;
}

export function getLifeStatus(person: Person): string {
  if (isAlive(person)) {
    const age = calculateAge(person.birthYear);
    return age ? `${age} years old` : 'Age unknown';
  } else {
    const age = calculateAge(person.birthYear, person.deathYear);
    return age ? `Died at ${age} (${person.deathYear})` : `Died in ${person.deathYear}`;
  }
}

export function buildFamilyNode(
  personId: string,
  data: FamilyData,
  level: number = 0,
  parentName?: string,
  maxDepth: number = 10
): FamilyNode | null {
  if (level > maxDepth) return null;

  const person = getPersonById(personId, data);
  if (!person) return null;

  const spouse = getSpouse(person, data);
  const children = getChildren(person, data);

  return {
    person,
    spouse: spouse || undefined,
    children: children
      .map(child => buildFamilyNode(child.id, data, level + 1, person.name, maxDepth))
      .filter((node): node is FamilyNode => node !== null),
    level,
    parentName
  };
}

export function getGenerationColor(level: number): string {
  const colors = [
    'bg-blue-100 border-blue-400', // Generation 1
    'bg-green-100 border-green-400', // Generation 2
    'bg-yellow-100 border-yellow-400', // Generation 3
    'bg-purple-100 border-purple-400', // Generation 4
    'bg-pink-100 border-pink-400', // Generation 5+
  ];
  return colors[Math.min(level, colors.length - 1)];
}

export function getRelationshipText(person: Person, parentName?: string): string {
  if (!parentName) return '';

  if (person.gender === 'male') {
    return `Son of ${parentName}`;
  } else if (person.gender === 'female') {
    return `Daughter of ${parentName}`;
  }
  return `Child of ${parentName}`;
}

export function getSpouseRelationshipText(person: Person, spouse: Person): string {
  if (person.gender === 'male') {
    return `Husband of ${spouse.name}`;
  } else if (person.gender === 'female') {
    return `Wife of ${spouse.name}`;
  }
  return `Spouse of ${spouse.name}`;
}
