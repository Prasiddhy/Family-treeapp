import { FamilyData } from '../types/family';

export const familyData: FamilyData = {
  // GENERATION 1 - Oldest Ancestors
  "1": { id: "1", name: "Ram Bahadur Shrestha", firstName: "Ram", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1880, deathYear: 1940, children: ["2","3"], spouseId: "2", gender: 'male', occupation: 'Farmer', location: 'Kathmandu, Nepal', isAlive: false, image: "/images/Ram_Bahadur_Shrestha.jpg" },
  "2": { id: "2", name: "Sita Devi Shrestha", firstName: "Sita", lastName: "Devi", createdAt: new Date(), updatedAt: new Date(), birthYear: 1882, deathYear: 1945, children: ["2","3"], spouseId: "1", gender: 'female', occupation: 'Homemaker', location: 'Kathmandu, Nepal', isAlive: false, image: "/images/Sita_Devi_Shrestha.jpg" },

  // GENERATION 2
  "3": { id: "3", name: "Bhakta Shrestha", firstName: "Bhakta", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1910, children: ["4","5"], spouseId: "4", gender: 'male', occupation: 'Teacher', location: 'Pokhara, Nepal', isAlive: false, image: "/images/Bhakta_Shrestha.jpg" },
  "4": { id: "4", name: "Mina Shrestha", firstName: "Mina", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1912, children: ["4","5"], spouseId: "3", gender: 'female', occupation: 'Nurse', location: 'Pokhara, Nepal', isAlive: false, image: "/images/Mina_Shrestha.jpg" },
  "5": { id: "5", name: "Laxmi Shrestha", firstName: "Laxmi", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1915, children: ["6","7"], spouseId: "6", gender: 'female', occupation: 'Teacher', location: 'Kathmandu, Nepal', isAlive: false, image: "/images/Laxmi_Shrestha.jpg" },
  "6": { id: "6", name: "Dinesh Karki", firstName: "Dinesh", lastName: "Karki", createdAt: new Date(), updatedAt: new Date(), birthYear: 1910, children: ["6","7"], spouseId: "5", gender: 'male', occupation: 'Engineer', location: 'Kathmandu, Nepal', isAlive: false, image: "/images/Dinesh_Karki.jpg" },

  // GENERATION 3
  "7": { id: "7", name: "Prakash Shrestha", firstName: "Prakash", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1940, children: ["8","9"], spouseId: "8", gender: 'male', occupation: 'Doctor', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Prakash_Shrestha.jpg" },
  "8": { id: "8", name: "Anita Shrestha", firstName: "Anita", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1942, children: ["8","9"], spouseId: "7", gender: 'female', occupation: 'Teacher', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Anita_Shrestha.jpg" },
  "9": { id: "9", name: "Sujata Shrestha", firstName: "Sujata", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1945, children: ["10","11"], spouseId: "10", gender: 'female', occupation: 'Designer', location: 'Pokhara, Nepal', isAlive: true, image: "/images/Sujata_Shrestha.jpg" },
  "10": { id: "10", name: "Ramesh Bhandari", firstName: "Ramesh", lastName: "Bhandari", createdAt: new Date(), updatedAt: new Date(), birthYear: 1940, children: ["10","11"], spouseId: "9", gender: 'male', occupation: 'Manager', location: 'Pokhara, Nepal', isAlive: true, image: "/images/Ramesh_Bhandari.jpg" },

  // GENERATION 4
  "11": { id: "11", name: "Manoj Shrestha", firstName: "Manoj", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1970, children: ["12","13"], spouseId: "12", gender: 'male', occupation: 'Engineer', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Manoj_Shrestha.jpg" },
  "12": { id: "12", name: "Sunita Shrestha", firstName: "Sunita", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 1972, children: ["12","13"], spouseId: "11", gender: 'female', occupation: 'Teacher', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Sunita_Shrestha.jpg" },
  "13": { id: "13", name: "Neha Gurung", firstName: "Neha", lastName: "Gurung", createdAt: new Date(), updatedAt: new Date(), birthYear: 1975, children: ["14","15"], spouseId: "14", gender: 'female', occupation: 'Designer', location: 'Pokhara, Nepal', isAlive: true, image: "/images/Neha_Gurung.jpg" },
  "14": { id: "14", name: "Anil Gurung", firstName: "Anil", lastName: "Gurung", createdAt: new Date(), updatedAt: new Date(), birthYear: 1973, children: ["14","15"], spouseId: "13", gender: 'male', occupation: 'Entrepreneur', location: 'Pokhara, Nepal', isAlive: true, image: "/images/Anil_Gurung.jpg" },

  // GENERATION 5
  "15": { id: "15", name: "Aarav Shrestha", firstName: "Aarav", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 2000, children: ["16","17"], gender: 'male', occupation: 'Student', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Aarav_Shrestha.jpg" },
  "16": { id: "16", name: "Pragya Shrestha", firstName: "Pragya", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 2002, children: ["18","19"], gender: 'female', occupation: 'Student', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Pragya_Shrestha.jpg" },
  "17": { id: "17", name: "Kiran Gurung", firstName: "Kiran", lastName: "Gurung", createdAt: new Date(), updatedAt: new Date(), birthYear: 2003, children: ["20","21"], gender: 'male', occupation: 'Student', location: 'Pokhara, Nepal', isAlive: true, image: "/images/Kiran_Gurung.jpg" },
  "18": { id: "18", name: "Roshni Gurung", firstName: "Roshni", lastName: "Gurung", createdAt: new Date(), updatedAt: new Date(), birthYear: 2005, children: ["22"], gender: 'female', occupation: 'Student', location: 'Pokhara, Nepal', isAlive: true, image: "/images/Roshni_Gurung.jpg" },

  // GENERATION 6
  "19": { id: "19", name: "Aditya Shrestha", firstName: "Aditya", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 2025, children: [], gender: 'male', occupation: 'Toddler', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Aditya_Shrestha.jpg" },
  "20": { id: "20", name: "Isha Shrestha", firstName: "Isha", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 2026, children: [], gender: 'female', occupation: 'Toddler', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Isha_Shrestha.jpg" },

  // GENERATION 7
  "21": { id: "21", name: "Aryan Shrestha", firstName: "Aryan", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 2030, children: [], gender: 'male', occupation: 'Infant', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Aryan_Shrestha.jpg" },
  "22": { id: "22", name: "Sanya Shrestha", firstName: "Sanya", lastName: "Shrestha", createdAt: new Date(), updatedAt: new Date(), birthYear: 2031, children: [], gender: 'female', occupation: 'Infant', location: 'Kathmandu, Nepal', isAlive: true, image: "/images/Sanya_Shrestha.jpg" },
};
