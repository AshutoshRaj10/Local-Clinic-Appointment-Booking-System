# CareSync Clinic 🏥

CareSync Clinic is a modern, responsive web application designed for seamlessly discovering specialists, checking live wait times, locating nearby healthcare facilities, and booking appointment time slots in real time.

---

## ✨ Features

- **Live Wait Time Tracker:** Real-time simulation updating clinic queue wait times automatically.
- **Dynamic Specialist Directory:** Fetches active specialists, availability, and ratings directly from a Supabase backend.
- **Appointment Booking System:** Interactive slot selection interface with real-time slot lock simulation and dynamic confirmation states.
- **Geolocation Integration:** Uses Browser Geolocation API to display nearby medical clinics.
- **User Authentication:** Supabase Auth integration allowing secure patient logins for booking validation.
- **Graceful Offline Fallback:** Includes defensive fallbacks rendering test states if database connectivity drops.
- **Emergency Alert System:** Prominent emergency header bar for critical care navigation.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (CSS Custom Properties & Grid/Flexbox), JavaScript (ES6+)
- **Typography:** Inter (via Google Fonts)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL Database & Authentication)

---

## 📁 Project Structure

```text
├── index.html        # Main HTML structure and page layout
├── style.css         # Custom styling, design tokens, and animations
├── script.js        # Core application logic and Supabase client integration
└── README.md         # Project documentation
