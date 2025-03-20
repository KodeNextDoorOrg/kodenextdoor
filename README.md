# KodeNextDoor - Modern Web Agency Website

A modern, responsive website for a web development agency built with Next.js, Tailwind CSS, Framer Motion, and Firebase.

## Features

- 🔥 Firebase integration for dynamic content
- 🎨 Modern, responsive design
- 🚀 Server-side rendering with Next.js 14
- 🧰 Tailwind CSS for styling
- 🎬 Smooth animations with Framer Motion
- 🔐 Admin dashboard for content management
- 📱 Mobile-friendly interface
- 🌙 Dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/kodenextdoor.git
cd kodenextdoor
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up Firebase:
   - Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (Email/Password at minimum)
   - Enable Storage (for images)
   
4. Create a `.env.local` file based on the `.env.local.example`:
```bash
cp .env.local.example .env.local
```

5. Update the `.env.local` file with your Firebase project details:
   - Get your Firebase configuration from Project Settings > General > Your apps > Web app

6. Run the development server:
```bash
npm run dev
# or
yarn dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Structure

### Firestore Collections

The application uses the following Firestore collections:

- `projects`: Portfolio project items
- `services`: Service offerings
- `companyStats`: Company statistics
- `contactInfo`: Contact information
- `businessHours`: Business hours
- `contactSubmissions`: Form submissions

### Firebase API

The application provides a modular API for interacting with Firebase:

```javascript
// Import the Firebase API
import { FirebaseAPI } from '@/lib/firebase';

// Example: Fetch all projects
const { success, projects } = await FirebaseAPI.getAllProjects();

// Example: Add a new contact submission
const { success, id } = await FirebaseAPI.saveContactSubmission({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  message: 'Hello, I need a website!',
  isRead: false,
});
```

## Admin Dashboard

The admin dashboard is available at `/admin` and allows you to:

- Manage projects
- Manage services
- Update company stats
- View and manage contact form submissions

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
