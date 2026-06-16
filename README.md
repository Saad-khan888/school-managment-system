# School Management System

A comprehensive school management system built with MERN stack (MongoDB, Express, React, Node.js) featuring role-based access control for Admin, Teachers, and Students.

## Features

### 👨‍💼 Admin Features
- **Dashboard**: Overview of students, teachers, classes, and fee collection
- **Class Management**: Create and manage classes
- **Subject Management**: Add subjects to classes
- **Student Management**: Add, view, update, and delete students
- **Teacher Management**: Assign teachers to subjects and classes
- **Attendance Tracking**: Monitor student attendance
- **Exam Management**: Record and manage student marks
- **Notice Board**: Create and manage school notices
- **Complaint Management**: View and handle complaints
- **Fee Management**: 
  - Set fee structures for each class (Monthly/Quarterly/Yearly)
  - Track fee payments per student
  - View payment history by period

### 👨‍🏫 Teacher Features
- **Dashboard**: Overview of assigned classes and students
- **Class Details**: View students in assigned class
- **Attendance**: Mark and manage student attendance
- **Marks Entry**: Record exam results for students
- **Complaints**: Submit complaints to admin

### 👨‍🎓 Student Features
- **Dashboard**: Personal academic overview
- **Subjects**: View enrolled subjects
- **Attendance**: Check attendance records
- **Marks**: View exam results
- **Complaints**: Submit complaints to admin
- **Notices**: View school announcements

## Tech Stack

**Frontend:**
- React 18.2
- Redux Toolkit (State Management)
- Material-UI (UI Components)
- React Router v6 (Navigation)
- Vite (Build Tool)
- Axios (HTTP Client)
- Styled Components
- Recharts (Data Visualization)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Bcrypt (Password Hashing)
- JWT Authentication
- CORS

## Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (local or Atlas)
- Git

### Clone Repository
```bash
git clone https://github.com/Saad-khan888/school-managment-system.git
cd school-managment-system
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection:
```env
MONGO_URL=mongodb://127.0.0.1/school
PORT=5000
```

5. Start the backend server:
```bash
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory (from project root):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
VITE_BASE_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Seeding Database (Optional)

To populate the database with dummy data:

```bash
cd backend
node seedData.js
```

This will create:
- 5 Classes (Grade 1-5)
- 25 Subjects (5 per class)
- 10 Teachers
- 75-125 Students
- 5 Notices
- 8 Complaints
- 5 Fee Structures

**Default Login Credentials after seeding:**
- **Admin**: dawood@gmail.com / 1234567890
- **Teachers**: [firstname][lastname]@school.com / teacher123
- **Students**: Roll number / student123

## Project Structure

```
school-management-system/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   ├── seedData.js       # Database seeding script
│   └── package.json
│
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── assets/       # Images and icons
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   │   ├── admin/    # Admin pages
│   │   │   ├── teacher/  # Teacher pages
│   │   │   └── student/  # Student pages
│   │   ├── redux/        # Redux store and slices
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── vite.config.js    # Vite configuration
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /AdminReg` - Register admin
- `POST /AdminLogin` - Admin login
- `POST /StudentLogin` - Student login
- `POST /TeacherLogin` - Teacher login

### Classes
- `POST /SclassCreate` - Create class
- `GET /SclassList/:id` - Get all classes
- `GET /Sclass/:id` - Get class details
- `DELETE /Sclass/:id` - Delete class

### Students
- `POST /StudentReg` - Register student
- `GET /Students/:id` - Get all students
- `GET /Student/:id` - Get student details
- `PUT /Student/:id` - Update student
- `DELETE /Student/:id` - Delete student
- `PUT /StudentAttendance/:id` - Mark attendance
- `PUT /UpdateExamResult/:id` - Update exam results

### Teachers
- `POST /TeacherReg` - Register teacher
- `GET /Teachers/:id` - Get all teachers
- `GET /Teacher/:id` - Get teacher details
- `PUT /TeacherSubject` - Update teacher subject
- `DELETE /Teacher/:id` - Delete teacher

### Subjects
- `POST /SubjectCreate` - Create subject
- `GET /ClassSubjects/:id` - Get class subjects
- `GET /Subject/:id` - Get subject details
- `DELETE /Subject/:id` - Delete subject

### Notices
- `POST /NoticeCreate` - Create notice
- `GET /NoticeList/:id` - Get all notices
- `DELETE /Notice/:id` - Delete notice

### Complaints
- `POST /ComplainCreate` - Create complaint
- `GET /ComplainList/:id` - Get all complaints

### Fees
- `POST /FeeCreate` - Set class fee
- `GET /FeeList/:id` - Get all fees
- `POST /FeePayment` - Mark fee paid
- `GET /ClassPayments/:classId/:period` - Get payment status

## Features in Detail

### Fee Management System
The fee management system allows:
1. **Setting Fees**: Admin sets fee amount and period (Monthly/Quarterly/Yearly/One-time) for each class
2. **Payment Tracking**: Mark students as paid for specific periods
3. **Payment History**: View which students paid in which periods
4. **Auto-Reset**: Payment status resets based on the selected period
5. **Collection Summary**: View total students paid and amount collected per period

### Attendance System
- Mark attendance for individual students
- Track attendance by subject
- View attendance history and percentages
- Clear attendance records if needed

### Examination System
- Record marks for each subject
- View student performance
- Track exam results over time

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For support, email your-email@example.com or open an issue in the repository.

## Acknowledgments

- Material-UI for the component library
- Redux Toolkit for state management
- Vite for blazing fast development experience
