const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Import models
const Admin = require("./models/adminSchema");
const Sclass = require("./models/sclassSchema");
const Subject = require("./models/subjectSchema");
const Student = require("./models/studentSchema");
const Teacher = require("./models/teacherSchema");
const Notice = require("./models/noticeSchema");
const Complain = require("./models/complainSchema");
const Fee = require("./models/feeSchema");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const seedDatabase = async () => {
    try {
        console.log("Starting to seed database...");

        // Find the admin with given credentials
        const admin = await Admin.findOne({ email: "dawood@gmail.com" });
        
        if (!admin) {
            console.log("Admin not found! Please register with email: dawood@gmail.com and password: 1234567890");
            process.exit(1);
        }

        const adminId = admin._id;
        console.log(`Found admin: ${admin.name}`);

        // Create Classes
        console.log("Creating classes...");
        const classes = [
            { sclassName: "Grade 1", school: adminId },
            { sclassName: "Grade 2", school: adminId },
            { sclassName: "Grade 3", school: adminId },
            { sclassName: "Grade 4", school: adminId },
            { sclassName: "Grade 5", school: adminId },
        ];

        const createdClasses = await Sclass.insertMany(classes);
        console.log(`Created ${createdClasses.length} classes`);

        // Create Subjects for each class
        console.log("Creating subjects...");
        const subjects = [];
        const subjectNames = [
            { name: "Mathematics", code: "MATH" },
            { name: "English", code: "ENG" },
            { name: "Science", code: "SCI" },
            { name: "History", code: "HIST" },
            { name: "Geography", code: "GEO" }
        ];

        for (const cls of createdClasses) {
            for (const sub of subjectNames) {
                subjects.push({
                    subName: sub.name,
                    subCode: `${sub.code}${cls.sclassName.replace(/\s/g, '')}`,
                    sessions: Math.floor(Math.random() * 20) + 30, // 30-50 sessions
                    sclassName: cls._id,
                    school: adminId
                });
            }
        }

        const createdSubjects = await Subject.insertMany(subjects);
        console.log(`Created ${createdSubjects.length} subjects`);

        // Create Teachers
        console.log("Creating teachers...");
        const teacherNames = [
            "John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis",
            "David Wilson", "Lisa Anderson", "James Taylor", "Mary Martinez",
            "Robert Garcia", "Jennifer Rodriguez"
        ];

        const teachers = [];
        for (let i = 0; i < teacherNames.length; i++) {
            const randomClass = createdClasses[Math.floor(Math.random() * createdClasses.length)];
            const classSubjects = createdSubjects.filter(s => s.sclassName.toString() === randomClass._id.toString());
            const randomSubject = classSubjects[Math.floor(Math.random() * classSubjects.length)];

            const salt = await bcrypt.genSalt(10);
            const hashedPass = await bcrypt.hash("teacher123", salt);

            teachers.push({
                name: teacherNames[i],
                email: `${teacherNames[i].toLowerCase().replace(/\s/g, '')}@school.com`,
                password: hashedPass,
                role: "Teacher",
                school: adminId,
                teachSubject: randomSubject._id,
                teachSclass: randomClass._id
            });
        }

        const createdTeachers = await Teacher.insertMany(teachers);
        console.log(`Created ${createdTeachers.length} teachers`);

        // Update subjects with teacher references
        for (const teacher of createdTeachers) {
            await Subject.findByIdAndUpdate(teacher.teachSubject, { teacher: teacher._id });
        }

        // Create Students
        console.log("Creating students...");
        const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia"];
        const lastNames = ["Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas"];

        const students = [];
        let rollNum = 1;

        for (const cls of createdClasses) {
            const studentsPerClass = Math.floor(Math.random() * 10) + 15; // 15-25 students per class
            
            for (let i = 0; i < studentsPerClass; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash("student123", salt);

                students.push({
                    name: `${firstName} ${lastName}`,
                    rollNum: rollNum++,
                    password: hashedPass,
                    sclassName: cls._id,
                    school: adminId,
                    role: "Student",
                    examResult: [],
                    attendance: []
                });
            }
        }

        const createdStudents = await Student.insertMany(students);
        console.log(`Created ${createdStudents.length} students`);

        // Create Notices
        console.log("Creating notices...");
        const notices = [
            {
                title: "School Reopening",
                details: "School will reopen on January 15th, 2025. Please ensure all students are present.",
                date: new Date("2025-01-10"),
                school: adminId
            },
            {
                title: "Parent-Teacher Meeting",
                details: "Parent-teacher meeting scheduled for January 25th, 2025 at 10:00 AM.",
                date: new Date("2025-01-20"),
                school: adminId
            },
            {
                title: "Sports Day",
                details: "Annual sports day will be held on February 5th, 2025. All students must participate.",
                date: new Date("2025-01-22"),
                school: adminId
            },
            {
                title: "Winter Break",
                details: "School will be closed for winter break from December 20th to January 5th.",
                date: new Date("2024-12-15"),
                school: adminId
            },
            {
                title: "Exam Schedule",
                details: "Mid-term examinations will begin from February 10th, 2025. Time table will be shared soon.",
                date: new Date("2025-01-28"),
                school: adminId
            }
        ];

        const createdNotices = await Notice.insertMany(notices);
        console.log(`Created ${createdNotices.length} notices`);

        // Create Complaints
        console.log("Creating complaints...");
        const complaints = [];
        for (let i = 0; i < 8; i++) {
            const randomStudent = createdStudents[Math.floor(Math.random() * createdStudents.length)];
            const complainTexts = [
                "The classroom ventilation needs improvement",
                "Library books are not sufficient for the class",
                "Playground equipment needs maintenance",
                "Cafeteria food quality could be better",
                "Bus arrival time is inconsistent",
                "Need more computer lab sessions",
                "Sports equipment is outdated",
                "Need better wifi connectivity"
            ];

            complaints.push({
                user: randomStudent._id,
                complaint: complainTexts[i],
                school: adminId,
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
            });
        }

        const createdComplaints = await Complain.insertMany(complaints);
        console.log(`Created ${createdComplaints.length} complaints`);

        // Create Fees
        console.log("Creating fees...");
        const fees = [];
        const feeAmounts = [5000, 6000, 7000, 8000, 9000];
        const periods = ["Monthly", "Quarterly", "Yearly"];

        for (let i = 0; i < createdClasses.length; i++) {
            fees.push({
                sclass: createdClasses[i]._id,
                amount: feeAmounts[i],
                period: periods[Math.floor(Math.random() * periods.length)],
                school: adminId
            });
        }

        const createdFees = await Fee.insertMany(fees);
        console.log(`Created ${createdFees.length} fee structures`);

        console.log("\n✅ Database seeded successfully!");
        console.log("\n📊 Summary:");
        console.log(`- Classes: ${createdClasses.length}`);
        console.log(`- Subjects: ${createdSubjects.length}`);
        console.log(`- Teachers: ${createdTeachers.length}`);
        console.log(`- Students: ${createdStudents.length}`);
        console.log(`- Notices: ${createdNotices.length}`);
        console.log(`- Complaints: ${createdComplaints.length}`);
        console.log(`- Fee Structures: ${createdFees.length}`);
        console.log("\n🔐 Login Credentials:");
        console.log(`Admin: dawood@gmail.com / 1234567890`);
        console.log(`Teachers: [teachername]@school.com / teacher123`);
        console.log(`Students: Use roll number as username / student123`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
