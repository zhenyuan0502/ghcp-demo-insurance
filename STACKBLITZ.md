# Insurance Quote Application

A modern insurance quote management system built with React and TypeScript, featuring a clean Material-UI interface.

## 🚀 Quick Start on StackBlitz

This application is optimized to run on StackBlitz with a mock backend service. All data is stored in localStorage for demonstration purposes.

### Features

- **Quote Management**: Create, view, and manage insurance quotes
- **Multiple Insurance Types**: Life, Auto, Home, and Health insurance
- **Real-time Premium Calculation**: Automatic premium calculation based on coverage and age
- **Status Management**: Approve, reject, or keep quotes pending
- **Responsive Design**: Works on desktop and mobile devices

### Getting Started

1. **Fork this project** on StackBlitz
2. **Wait for dependencies to install** (this happens automatically)
3. **The app will start automatically** and open in the preview pane
4. **Navigate to different pages** using the navigation bar

### Sample Data

The application comes with sample quotes pre-loaded for demonstration. You can:
- View existing quotes in the Dashboard
- Create new quotes using the Quote Form
- Update quote statuses by clicking the status badges in the Dashboard

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.tsx   # Quote management dashboard
│   │   ├── QuoteForm.tsx   # New quote creation form
│   │   └── Home.tsx        # Landing page
│   └── services/           # API and mock services
│       ├── apiService.ts   # Main API service with fallback
│       └── mockAPI.ts      # Mock backend for StackBlitz
```

### Technology Stack

- **Frontend**: React 19, TypeScript, Material-UI
- **Forms**: React Hook Form with Yup validation
- **Routing**: React Router DOM
- **HTTP Client**: Axios (with mock fallback)
- **Build Tool**: Create React App

### Local Development

If you want to run this locally with the full backend:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the Python Flask backend
4. Run both frontend and backend servers

The application will automatically detect if it's running in StackBlitz and use the mock API, or connect to the real backend when running locally.

### Demo Features

- **Create Quotes**: Fill out the comprehensive quote form
- **View Dashboard**: See all quotes with filtering and status updates
- **Premium Calculation**: Automatic calculation based on insurance type, coverage, and age
- **Persistent Data**: All changes are saved to localStorage in StackBlitz

### Contributing

Feel free to fork this project and submit pull requests for improvements!
