<h1 align="center">
  Tabi旅Time<br>
  <small>Your Personal Nihon Travel Nexus & Dashboard</small>
</h1>

## 📄 Overview
**Tabi旅Time** is the culmination of my repeated travels across Japan. Having visited the archipelago multiple times for vacation, I noticed a recurring challenge: the digital fragmentation of memories. Photos, GPS coordinates, and travel logs often end up scattered across different cloud services and devices. 

I built this system to act as a centralized, private command center for my upcoming journeys. Stationed on a **Raspberry Pi 5** in my home in the United States, the dashboard remains globally accessible via a **Tailscale** mesh network. Whether I am navigating the crowded streets of Shinjuku or hiking the rural trails of Kumano Kodo, I can securely beam data back to my home server in America from across the world.

Beyond personal utility, TabiTime serves as a **Live Spectator Portal**. By sharing specific nodes via Tailscale, my family members can securely access the dashboard in real-time, following my GPS progress and viewing high-res gallery updates as they happen—staying connected across continents without the need for public social media.

### 🛠️ Tech Stack
<p align="center">
    <img src="https://img.shields.io/badge/Raspberry_Pi_5-C51A4A?style=for-the-badge&logo=raspberry-pi&logoColor=white" />
    <img src="https://img.shields.io/badge/Tailscale-4433E8?style=for-the-badge&logo=tailscale&logoColor=white" />
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" />
    <br>
    <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

---

## 🚀 Key Features

### 🖥️ Dashboard
<p align="center">
  <img src="docs/screenshots/dashboard_full.png" alt="TabiTime Dashboard" width="800" style="border-radius: 15px; border: 1px solid #334155;"/>
</p>
The core interface serves as a high-level overview of the trip's status. Designed with a dark-slate aesthetic and vibrant accents, it provides instant access to all sub-modules while maintaining a clean, distraction-free layout.

---

### 🕒 Dual-Zone Clock
<p align="center">
  <img src="docs/screenshots/clock_card.png" alt="Dual Clock Feature" width="400" />
</p>
- **Real-Time Sync:** Displays live time and date for both **Japan (JST)** and **Home (PST)**.
- **Visual Pulse:** Includes a dynamic CSS "ping" indicator to confirm the background time-synchronization service is active.

### 📅 Trip Countdown
<p align="center">
  <img src="docs/screenshots/countdown_card.png" alt="Interactive Countdown" width="400" />
</p>
- **Interactive Persistence:** Features a custom modal for users to input their return date.
- **Client-Side Storage:** Utilizes `localStorage` to persist the return target across browser sessions without backend overhead.
- **Dynamic Calculation:** Automatically updates the "Days Remaining" metrics every time the dashboard is accessed.

### 🍱 NihonGo!
<p align="center">
  <img src="docs/screenshots/nihongo_card.png" alt="Language Suite" width="400" />
</p>
- **Intermediate Focus:** A curated database of Japanese phrases specifically for navigation, dining, and travel logistics.
- **Contextual Cards:** Provides Kanji, Romaji, and English breakdowns to bridge the gap between "textbook" and "street" Japanese.

### 💴 Currency Converter
<p align="center">
  <img src="docs/screenshots/currency_card.png" alt="Currency Converter" width="400" />
</p>
- **Live Rate Integration:** Pulls the current USD/JPY exchange rate via API to ensure financial accuracy.
- **Visual Trends:** Integrated **Chart.js** visualization displays recent rate fluctuations.
- **Bi-Directional Converter:** A sleek, interactive calculator allows for instant toggling between Dollar and Yen inputs.

### 🗺️ Travel Journal
<p align="center">
  <img src="docs/screenshots/journal_view.png" alt="GPS Travel Journal" width="800" style="border-radius: 15px; border: 1px solid #334155;"/>
</p>
- **Polyline Mapping:** Visualizes the journey as a connected path, calculating exact distances between waypoints using the Haversine formula.
- **Data-Rich Markers:** Each coordinate point features a custom popup detailing **Entry ID**, **Altitude**, and **GPS Accuracy**.
- **Topographic Layers:** Leverages **OpenTopoMap** to provide geographical context to hikes and mountain treks.

### 📸 Photo Gallery
<p align="center">
  <img src="docs/screenshots/gallery_view.png" alt="Automated Photo Gallery" width="800" style="border-radius: 15px; border: 1px solid #334155;"/>
</p>
- **High-Res Archive:** Displays photos synced directly from iPhone via the Syncthing/Tailscale pipeline.
- **HCI Lightbox:** A custom-engineered image viewer with "Thumb Zone" ergonomics, placing close and save actions at the bottom for effortless mobile navigation.
- **Metadata Transparency:** Overlays technical EXIF data on every image, including the exact altitude of the capture.

---

<p align="center">
  &copy; 2026 <a href="https://alexryse.com">Alex Ryse</a> | Built for Japan <span style="color: #ec4899;">旅</span><br>
  <em>Powered by Raspberry Pi 5 & Syncthing Automation</em>
</p>
