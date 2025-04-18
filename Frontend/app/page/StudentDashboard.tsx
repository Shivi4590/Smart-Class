"use client";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
=======
>>>>>>> af0fcc9 (changes done)
import React, { useState, useEffect } from "react";
import axios from "axios";
import GreetingCard from "../components/GreetingCard";
import OverviewGraph from "../components/OverviewGraph";
import Calender from "../components/Calender";
import AnnouncementSection from "../components/AnnouncementSection";
import HomeworkSection from "../components/HomeworkSection";

<<<<<<< HEAD
interface Announcement {
  title: string;
  date: string;
  content: string;
  isImportant: boolean;
}

// Update the Homework interface to include additional details
interface Homework {
  subject: string;
  title: string;
  dueDate: string;
  isCompleted: boolean;
  content?: string; // Optional additional fields
  totalMarks?: number;
}

// Define the API response shapes
interface AnnouncementResponse {
  title: string;
  created_at: string;
  content: string;
  is_important: boolean;
}

interface HomeworkResponse {
  id: number;
  title: string;
  content: string;
  professor: string;
  publishDate: string;
  submissionDate: string; // This is your due date
  fileLink: string | null;
  fileName: string | null;
  submission: any | null;
  totalMarks: number;
}

function StudentDashboard() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState({
    announcements: true,
    homeworks: true,
  });
  const [error, setError] = useState<{
    announcements: string | null;
    homeworks: string | null;
  }>({
    announcements: null,
    homeworks: null,
  });
  const handleViewAllAnnouncements = () => {
    router.push("/student/announcements");
  };
  const handleViewAllHomework = () => {
    router.push("/student/announcements#homework"); // Using hash for homework section
  };
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

  useEffect(() => {
    const fetchAnnouncements = async () => {
=======
// Define proper interfaces for your data types
interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
}

interface Homework {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'Completed' | 'Pending' | 'Overdue';
  subject: string;
  isCompleted: boolean;
}

interface LoadingState {
  announcements: boolean;
  homeworks: boolean;
}

interface ErrorState {
  announcements: string | null;
  homeworks: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const StudentDashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    announcements: false,
    homeworks: false
  });
  const [error, setError] = useState<ErrorState>({
    announcements: null,
    homeworks: null
  });

  const fallbackAnnouncements: Announcement[] = [
    {
      id: 1,
      title: "Welcome to the New Semester",
      content: "We hope you're ready for an exciting new semester!",
      date: "2024-03-01",
      isImportant: true
    },
    // Add more fallback announcements if needed
  ];

  const fallbackHomeworks: Homework[] = [
    {
      id: 1,
      title: "Mathematics Assignment",
      description: "Complete exercises from Chapter 3",
      dueDate: "2024-03-15",
      status: "Pending",
      subject: "Mathematics",
      isCompleted: false
    },
    // Add more fallback homework if needed
  ];

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(prev => ({ ...prev, announcements: true }));
>>>>>>> af0fcc9 (changes done)
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/student/announcement`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          // Transform API response to match our component's expected format
          const formattedAnnouncements = response.data.data.map(
<<<<<<< HEAD
            (announcement: AnnouncementResponse) => ({
              title: announcement.title,
              date: new Date(announcement.created_at).toLocaleDateString(),
              content: announcement.content,
              isImportant: announcement.is_important,
            })
          );
          setAnnouncements(formattedAnnouncements);
=======
            (announcement: Announcement) => ({
              id: announcement.id,
              title: announcement.title,
              content: announcement.content,
              date: announcement.date,
              isImportant: announcement.isImportant,
            })
          );
          setAnnouncements(formattedAnnouncements);
          setError(prev => ({ ...prev, announcements: null }));
>>>>>>> af0fcc9 (changes done)
        } else {
          setError((prev) => ({
            ...prev,
            announcements: "Failed to fetch announcements",
          }));
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError((prev) => ({
          ...prev,
          announcements: "Error fetching announcements",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, announcements: false }));
      }
    };

<<<<<<< HEAD
    // Then update the fetchHomeworks function
    const fetchHomeworks = async () => {
=======
    const fetchHomeworks = async () => {
      setLoading(prev => ({ ...prev, homeworks: true }));
>>>>>>> af0fcc9 (changes done)
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/student/homework`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          // Transform API response to match our component's expected format
<<<<<<< HEAD
          console.log(response.data.data);
          const formattedHomeworks = response.data.data.map(
            (homework: HomeworkResponse) => {
              // Parse the date carefully
              let dueDate = "No date specified";
              try {
                if (homework.submissionDate) {
                  const date = new Date(homework.submissionDate);
                  if (!isNaN(date.getTime())) {
                    dueDate = date.toLocaleDateString();
                  }
                }
              } catch (e) {
                console.error(
                  "Error parsing date:",
                  homework.submissionDate,
                  e
                );
              }

              return {
                subject: homework.professor || "Unknown", // Use professor name as the subject
                title: homework.title,
                dueDate: dueDate,
                isCompleted: homework.submission !== null, // Consider homework completed if submission exists
              };
            }
          );
          setHomeworks(formattedHomeworks);
=======
          const formattedHomeworks = response.data.data.map(
            (homework: Homework) => ({
              id: homework.id,
              title: homework.title,
              description: homework.description,
              dueDate: homework.dueDate,
              status: homework.status,
              subject: homework.subject,
              isCompleted: homework.isCompleted,
            })
          );
          setHomeworks(formattedHomeworks);
          setError(prev => ({ ...prev, homeworks: null }));
>>>>>>> af0fcc9 (changes done)
        } else {
          setError((prev) => ({
            ...prev,
            homeworks: "Failed to fetch homeworks",
          }));
        }
      } catch (err) {
        console.error("Error fetching homeworks:", err);
        setError((prev) => ({
          ...prev,
          homeworks: "Error fetching homeworks",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, homeworks: false }));
      }
    };

    fetchAnnouncements();
    fetchHomeworks();
<<<<<<< HEAD
  }, []);

  // Rest of your component remains the same
  // Fallback data in case API fails
  const fallbackAnnouncements = [
    {
      title: "School reopening",
      date: "10th May 2022",
      content:
        "School will reopen on 10th May 2022. Please make sure you have all the necessary items.",
      isImportant: true,
    },
    {
      title: "PTA Meeting",
      date: "12th May 2022",
      content:
        "PTA meeting will be held on 12th May 2022. Please make sure you attend the meeting.",
      isImportant: false,
    },
    {
      title: "New Admission",
      date: "15th May 2022",
      content:
        "New admission will be held on 15th May 2022. Please make sure you have all the necessary documents.",
      isImportant: true,
    },
  ];

  const fallbackHomeworks = [
    {
      subject: "Mathematics",
      title: "Solve the given problems",
      dueDate: "15th May 2022",
      isCompleted: false,
    },
    {
      subject: "Science",
      title: "Complete the given assignment",
      dueDate: "20th May 2022",
      isCompleted: false,
    },
    {
      subject: "English",
      title: "Write an essay on your favorite book",
      dueDate: "25th May 2022",
      isCompleted: false,
    },
  ];
=======
  }, [API_URL]);
>>>>>>> af0fcc9 (changes done)

  return (
    <div className="flex-1 bg-gradient-to-b from-purple-100 via-white to-white p-1 md:p-2 lg:p-4 overflow-auto">
      <div className="flex flex-col lg:flex-row gap-6 relative z-10 max-w-7xl mx-auto w-full">
        <div className="w-full lg:w-8/12">
          <GreetingCard name="Student" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <AnnouncementSection
<<<<<<< HEAD
              announcements={
                announcements.length > 0 ? announcements : fallbackAnnouncements
              }
              loading={loading.announcements}
              error={error.announcements}
            />

=======
              announcements={announcements.length > 0 ? announcements : fallbackAnnouncements}
              loading={loading.announcements}
              error={error.announcements}
            />
>>>>>>> af0fcc9 (changes done)
            <HomeworkSection
              homeworks={homeworks.length > 0 ? homeworks : fallbackHomeworks}
              loading={loading.homeworks}
              error={error.homeworks}
            />
          </div>
          <div className="mt-2 bg-white rounded-xl shadow-md p-4">
            <OverviewGraph />
          </div>
        </div>
        <div className="w-full lg:w-4/12 h-full">
          <div className="sticky top-6 bg-white rounded-xl shadow-md">
            <Calender />
          </div>
        </div>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default StudentDashboard;
=======
export default StudentDashboard;
>>>>>>> af0fcc9 (changes done)
