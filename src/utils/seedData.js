import { db } from '../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const testStudents = [
  { name: 'John Doe', email: 'john@example.com', role: 'student', class: 'Class-A' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'student', class: 'Class-A' },
  { name: 'Bob Wilson', email: 'bob@example.com', role: 'student', class: 'Class-A' },
  { name: 'Alice Brown', email: 'alice@example.com', role: 'student', class: 'Class-B' },
  { name: 'Charlie Davis', email: 'charlie@example.com', role: 'student', class: 'Class-B' },
];

export async function seedTestData() {
  try {
    // Add test students
    const studentRefs = await Promise.all(
      testStudents.map(student => 
        addDoc(collection(db, 'users'), {
          ...student,
          createdAt: Timestamp.now()
        })
      )
    );

    // Add some test attendance records
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const dates = [today, yesterday, twoDaysAgo];
    
    // Create attendance records for each student for the past 3 days
    for (const studentRef of studentRefs) {
      for (const date of dates) {
        const status = Math.random() > 0.2 ? 'Present' : 'Absent'; // 80% chance of being present
        await addDoc(collection(db, 'attendance'), {
          studentId: studentRef.id,
          class: testStudents[studentRefs.indexOf(studentRef)].class,
          date: Timestamp.fromDate(date),
          status,
          markedBy: 'system',
          markedAt: Timestamp.now()
        });
      }
    }

    console.log('Test data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding test data:', error);
    return false;
  }
} 