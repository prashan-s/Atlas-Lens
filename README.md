[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# AtlasLens

AtlasLens is a modern web application that allows users to explore countries around the world, view detailed information about each country, and save their favorite countries. The application features a beautiful glass morphism design and a user-friendly interface.

## Features

- Search countries by name
- Filter countries by region
- View detailed country information
- User authentication
- Save favorite countries
- Responsive glass morphism design

## Technologies Used

- React
- Vite
- Tailwind CSS
- Firebase (Authentication & Firestore)
- REST Countries API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration.
   The variable names should match those expected in `src/services/firebase.js`:
   ```
   VITE_ATLAS_LENS_FIREBASE_API_KEY=your_api_key
   VITE_ATLAS_LENS_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_ATLAS_LENS_FIREBASE_PROJECT_ID=your_project_id
   VITE_ATLAS_LENS_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_ATLAS_LENS_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_ATLAS_LENS_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src`
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/pages` - Main application pages
  - `/services` - API and Firebase services
  - `/assets` - Static assets

## Contributing

Feel free to submit issues and pull requests.

## License

MIT
