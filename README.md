# Hospital Management System (HMS)

A comprehensive Hospital Management System built with React, TypeScript, and Tailwind CSS. This system provides role-based access control for different hospital staff and includes modules for patient management, billing, appointments, and lab results.

## 🚀 Features

### Core Modules

#### 1. **Reception Module**
- Patient registration and management
- Billing and invoice creation with PDF generation
- Appointment scheduling
- Patient search and filtering
- Role-based access to patient records

#### 2. **Doctor Module**
- Patient dashboard with treatment history
- Appointment management
- Treatment record updates
- Lab results viewing
- Patient medical history access

#### 3. **Lab Module**
- Lab test management
- Results upload and management
- Test status tracking
- Patient test history

#### 4. **Admin Module**
- User management for all roles
- Hospital activity reports
- System-wide dashboard
- Data analytics and insights

### Technical Features

- **Authentication & Authorization**: JWT-based with role-based access control
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Search & Filtering**: Advanced search across all modules
- **Pagination**: Efficient data loading and navigation
- **PDF Generation**: Automated invoice and report generation
- **Data Validation**: Comprehensive form validation
- **Error Handling**: Robust error management
- **Local Storage**: Client-side data persistence for demo

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Routing**: React Router DOM

## 🎯 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hospital-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser

## 👥 Demo Accounts

The system comes with pre-configured demo accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | dr.smith@hospital.com | doctor123 |
| Reception | reception@hospital.com | reception123 |
| Lab | lab@hospital.com | lab123 |

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Common/          # Reusable components
│   ├── Dashboard/       # Dashboard components
│   ├── Layout/          # Layout components
│   ├── Patients/        # Patient management
│   └── Billing/         # Billing system
├── context/             # React Context providers
├── data/                # Mock data and utilities
├── types/               # TypeScript definitions
└── App.tsx              # Main application component
```

## 🔧 Backend Integration Guide

This frontend is designed to easily connect to a backend API. Here's the expected structure:

### Database Schema (MySQL with Prisma)

```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'reception', 'lab') NOT NULL,
  phone VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE patients (
  id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(255),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  address TEXT,
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(255),
  medical_history TEXT,
  allergies TEXT,
  blood_group VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Additional tables for appointments, treatments, lab_tests, bills...
```

### API Endpoints

```javascript
// Authentication
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

// Patients
GET    /api/patients
POST   /api/patients
GET    /api/patients/:id
PUT    /api/patients/:id
DELETE /api/patients/:id

// Billing
GET    /api/bills
POST   /api/bills
GET    /api/bills/:id
PUT    /api/bills/:id

// And more...
```

### Environment Variables

Create a `.env` file for backend configuration:

```env
DATABASE_URL="mysql://user:password@localhost:3306/hospital_db"
JWT_SECRET="your-super-secret-jwt-key"
AWS_S3_BUCKET="your-s3-bucket-name"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
```

## 🔐 Security Features

- **Role-based Access Control**: Different permissions for each user role
- **Input Validation**: Client and server-side validation
- **Password Hashing**: Secure password storage (backend)
- **JWT Authentication**: Secure session management
- **Data Sanitization**: Protection against XSS and injection attacks

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Collapsible sidebar with touch-friendly controls
- **Mobile**: Mobile-first design with hamburger menu

## 🎨 UI/UX Features

- **Professional Healthcare Theme**: Calming blue and white color scheme
- **Intuitive Navigation**: Role-based menu structure
- **Advanced Search**: Real-time filtering and pagination
- **Interactive Dashboards**: Visual data representation
- **Loading States**: Smooth user experience during data operations
- **Error Messages**: Clear, actionable error feedback

## 📊 Data Management

- **Local Storage**: Demo data persistence
- **Mock Data**: Realistic sample data for testing
- **CRUD Operations**: Complete data management functionality
- **Data Validation**: Comprehensive form validation
- **Export Features**: PDF generation for reports and invoices

## 🧪 Testing the System

1. **Login with different roles** to see role-based access
2. **Add patients** through the reception interface
3. **Create bills** and generate PDF invoices
4. **Search and filter** across different modules
5. **Test responsive design** on different screen sizes

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment (Recommended Stack)
- **Database**: MySQL with Prisma ORM
- **API**: Node.js/Express.js
- **File Storage**: AWS S3 or similar
- **Hosting**: Digital Ocean, AWS, or similar

## 📈 Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **Mobile App**: React Native version
- **Advanced Analytics**: Detailed reporting dashboard
- **Telemedicine**: Video consultation integration
- **Inventory Management**: Medical supply tracking
- **Appointment Reminders**: SMS/Email notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Email: support@hospital-management.com
- Documentation: [Link to detailed docs]

---

**Note**: This is a frontend demo with mock data. For production use, integrate with a proper backend API, implement real authentication, and add comprehensive security measures.