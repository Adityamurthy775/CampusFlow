export const btech3Curriculum = {
  id: "BTECH-3-CSE-DSA-SEM-1",
  title: "B.Tech Data Science",
  department: "Data Science",
  branch: "CSE-DSA",
  year: 3,
  semester: 1,
  academicYear: "2026-2027",
  effectiveFrom: "2026-06-29",
  subjects: [
    {
      code: "EMA3112",
      name: "Machine Learning",
      credits: 4,
      category: "Core",
      faculty: ["Mrs. T. Venkata Subbamma"]
    },
    {
      code: "EMA3113",
      name: "Web Programming",
      credits: 4,
      category: "Core",
      faculty: ["Mr. R. Siva Kumar"]
    },
    {
      code: "EMA3111",
      name: "Operating System Concepts",
      credits: 3,
      category: "Core",
      faculty: ["Mr. J. Swathi"]
    },
    {
      code: "EMA3112L",
      name: "Machine Learning Lab",
      credits: 3,
      category: "Laboratory",
      room: "H-401",
      faculty: ["Mrs. T. Venkata Subbamma"]
    },
    {
      code: "EMA3113L",
      name: "Web Programming Lab",
      credits: 3,
      category: "Laboratory",
      room: "H-815",
      faculty: ["Mr. R. Siva Kumar"]
    },
    {
      code: "EMA3115",
      name: "Data Visualization Lab",
      credits: 3,
      category: "Laboratory",
      room: "H-901",
      faculty: ["Dr. A. Ravi"]
    },
    {
      code: "ESE3101",
      name: "Problem Solving in Engineering-I",
      credits: 3,
      category: "Engineering Skills",
      room: "E-703",
      faculty: ["Mrs. T. Venkata Subbamma", "Mr. R. Siva Kumar"]
    },
    {
      code: "EAE3103",
      name: "English for Placement Tests",
      credits: 3,
      category: "Placement",
      faculty: ["Dr. Babi Duli"]
    },
    {
      code: "E-703",
      name: "Technical Training",
      credits: 7,
      category: "Training",
      room: "E-703",
      faculty: ["Mr. M. Upendra"]
    },
    {
      code: "EMJ3105",
      name: "Quantitative Aptitude and Logical Reasoning-II",
      credits: 3,
      category: "Placement",
      room: "G-III",
      faculty: ["Dr. Y. Bikash", "Ms. B. Jyothi"]
    },
    {
      code: null,
      name: "IEEE/CS/ISTE Activities",
      credits: 2,
      category: "Activities",
      faculty: ["Dr. Y. Bikash", "Ms. B. Jyothi", "Mr. O. Subhash Chander"]
    },
    {
      code: null,
      name: "Technical Clubs",
      credits: 2,
      category: "Clubs",
      faculty: [
        "Dr. M. Sridevi",
        "Ms. B. Jyothi",
        "Mr. Salar Mohammad",
        "Mrs. Y. Suguana",
        "Mrs. G. Swapna"
      ]
    }
  ],
  weeklySchedule: [
    {
      day: "Monday",
      periods: [
        { time: "09:00-09:55", subject: "Operating System Concepts", code: "EMA3111" },
        { time: "09:55-10:50", subject: "Web Programming", code: "EMA3113" },
        { time: "10:50-11:45", subject: "Web Programming", code: "EMA3113" },
        { time: "11:45-12:40", subject: "Machine Learning", code: "EMA3112" },
        { time: "12:40-01:20", subject: "Lunch", code: null },
        { time: "01:20-02:15", subject: "Machine Learning Lab", code: "EMA3112L" },
        { time: "02:15-03:10", subject: "Machine Learning Lab", code: "EMA3112L" },
        { time: "03:10-04:05", subject: "Operating System Concepts", code: "EMA3111" }
      ]
    },
    {
      day: "Tuesday",
      periods: [
        { time: "09:00-09:55", subject: "Web Programming", code: "EMA3113" },
        { time: "09:55-12:40", subject: "Web Programming Lab", code: "EMA3113L", room: "H-815" },
        { time: "12:40-01:20", subject: "Lunch", code: null },
        { time: "01:20-02:15", subject: "Operating System Concepts", code: "EMA3111" },
        { time: "02:15-03:10", subject: "Machine Learning", code: "EMA3112" },
        { time: "03:10-04:05", subject: "Open Elective-I", code: "OE-I" }
      ]
    },
    {
      day: "Wednesday",
      periods: [
        { time: "09:00-12:40", subject: "Technical Training", code: "E-703", room: "E-703" },
        { time: "12:40-01:20", subject: "Lunch", code: null },
        { time: "01:20-04:05", subject: "Technical Training", code: "E-703", room: "E-703" }
      ]
    },
    {
      day: "Thursday",
      periods: [
        { time: "09:00-09:55", subject: "Web Programming", code: "EMA3113" },
        { time: "09:55-10:50", subject: "Machine Learning", code: "EMA3112" },
        { time: "10:50-11:45", subject: "Open Elective-I", code: "OE-I" },
        { time: "11:45-12:40", subject: "Open Elective-I", code: "OE-I" },
        { time: "12:40-01:20", subject: "Lunch", code: null },
        { time: "01:20-04:05", subject: "Problem Solving in Engineering-I", code: "ESE3101" }
      ]
    },
    {
      day: "Friday",
      periods: [
        { time: "09:00-09:55", subject: "Machine Learning", code: "EMA3112" },
        { time: "09:55-12:40", subject: "Quantitative Aptitude and Logical Reasoning-II", code: "EMJ3105", room: "G-III" },
        { time: "12:40-01:20", subject: "Lunch", code: null },
        { time: "01:20-03:10", subject: "Data Visualization Lab", code: "EMA3115", room: "H-901" },
        { time: "03:10-04:05", subject: "Operating System Concepts", code: "EMA3111" }
      ]
    },
    {
      day: "Saturday",
      periods: [
        { time: "09:00-10:50", subject: "IEEE/CS/ISTE Activities", code: null },
        { time: "10:50-12:40", subject: "Technical Clubs", code: null },
        { time: "12:40-01:20", subject: "Lunch", code: null },
        { time: "01:20-04:05", subject: "Sports", code: null }
      ]
    }
  ]
};
