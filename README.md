<h1 align="center">
  Tabi旅Time<br>
  <small>Your Personal Nihon Travel Nexus & Dashboard</small>
</h1>

## 📄 Overview
**Tabi旅Time** is the culmination of my repeated travels across Japan. Having visited the archipelago multiple times for vacation, I noticed a recurring challenge: the digital fragmentation of memories. Photos, GPS coordinates, and travel logs often end up scattered across different cloud services and devices. 

I built this system to act as a centralized, private command center for my upcoming journeys. Stationed on a **Raspberry Pi 5** in my home in the United States, the dashboard remains globally accessible via a **Tailscale** mesh network. Whether I am navigating the crowded streets of Shinjuku or hiking the rural trails of Kumano Kodo, I can securely beam data back to my home server in America from across the world.

Beyond personal utility, TabiTime serves as a **Live Spectator Portal**. By sharing specific nodes via Tailscale, my family members can securely access the dashboard in real-time, following my GPS progress and viewing high-res gallery updates as they happen—staying connected across continents without the need for public social media.

---

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
  <img src="docs/screenshots/dashboard_main.png" alt="TabiTime Dashboard" width="800" style="border-radius: 15px; border: 1px solid #334155;"/>
</p>
The core interface serves as a high-level overview of the trip's status. Designed with a dark-slate aesthetic and vibrant accents, it provides instant access to all sub-modules while maintaining a clean, distraction-free layout.

---

### 🕒 Dual-Zone Clock
<p align="center">
  <img src="docs/screenshots/clock_card.png" alt="Dual-Zone Clock" width="295" style="vertical-align: top; margin-right: 15px;"/>
</p>

- **Real-Time Sync:** Displays live time and date for both **Japan (JST)** and **Home (PST)**, critical for tracking time zone differences during travel.
- **Visual Pulse:** Includes a dynamic CSS ping indicator to confirm the background time-synchronization service is active.

---

### 📅 Trip Countdown
<p align="center">
  <img src="docs/screenshots/countdown_card.png" alt="Trip Countdown" width="295" style="vertical-align: top;"/>
</p>

- **Interactive Persistence:** Features a custom modal for users to input their return date.
- **Client-Side Storage:** Utilizes `localStorage` to persist the return target across browser sessions without backend overhead.
- **Dynamic Calculation:** Automatically updates the Days Remaining metrics every time the dashboard is accessed.

---

### 🍱 NihonGo!
<p align="center">
  <img src="docs/screenshots/nihongo_card.png" alt="NihonGo!" width="295" style="vertical-align: top; margin-right: 15px;"/>
</p>

- **Intermediate Focus:** A curated database of Japanese phrases specifically for navigation, dining, and travel logistics.
- **Contextual Cards:** Provides Kanji, Romaji, and English breakdowns to bridge the gap between textbook and street Japanese.

---

### 💴 Currency Converter
<p align="center">
  <img src="docs/screenshots/converter_card.png" alt="Currency Converter Main" width="295" style="border-radius: 10px;"/>
  <br>
  <img src="docs/screenshots/converter_ex1.png" alt="Currency Converter USD to JPY" width="295" style="border-radius: 10px; margin-top: 10px;"/>
  <img src="docs/screenshots/converter_ex2.png" alt="Currency Converter JPY to USD" width="295" style="border-radius: 10px; margin-top: 10px;"/>
</p>

- **Live Rate Integration:** Pulls the current USD/JPY exchange rate via API to ensure financial accuracy.
- **Visual Trends:** Integrated **Chart.js** visualization displays recent rate fluctuations.
- **Instant Swapping:** Sleek interface supports immediate input swapping (USD ⇄ JPY) with automatic recalculation.

---

### 🗺️ Travel Journal
<p align="center">
  <img src="docs/screenshots/journal_main.png" alt="Travel Journal Main" width="800" style="border-radius: 15px; border: 1px solid #334155;"/>
</p>

- **Dynamic Topography:** Utilizes **OpenTopoMap** to visualize elevation data, crucial for tracking mountain treks.
- **Chronological Trace:** Maps the journey as a connected path, highlighting movement across the Japanese archipelago.
<p align="center">
  <img src="docs/screenshots/journal_modal.png" alt="Travel Journal Waypoint Modal" width="800" style="border-radius: 15px; border: 1px solid #334155; margin-top: 20px;"/>
</p>

- **Waypoint Intelligence:** Each coordinate point features a custom popup detailing **Entry ID**, **Captured Time**, **Altitude**, and **GPS Accuracy**. It also includes a high-resolution preview of the media captured at that precise location.
<p align="center">
  <img src="docs/screenshots/journal_distance.png" alt="Travel Journal Haversine Distance" width="800" style="border-radius: 15px; border: 1px solid #334155; margin-top: 20px;"/>
</p>

- **Haversine Distance Mapping:** Interactive polylines calculate the exact distance between waypoints in both kilometers and miles, providing real-time trip mileage statistics upon hover.
<p align="center">
  <img src="docs/screenshots/journal_map2.png" alt="Travel Journal Map Two" width="395" style="border-radius: 10px; margin-right: 5px;"/>
  <img src="docs/screenshots/journal_map3.png" alt="Travel Journal Map Three" width="395" style="border-radius: 10px;"/>
</p>

- **Multi-Layer Switching:** Allows immediate toggling between map types, including **Dark Protocol** (high-contrast navigation) and **Satellite View** (photorealistic context).
- **Temporal Filtering:** Supports dynamic date toggling to focus the map visualization exclusively on waypoints and media captured on a specific day of the trip.

---

### 📸 Photo Gallery
<p align="center">
  <img src="docs/screenshots/gallery_main.png" alt="Photo Gallery Main" width="800" style="border-radius: 15px; border: 1px solid #334155;"/>
</p>

- **Zero-Touch P2P Pipeline:** Displays photosSynced directly from iPhone via the Syncthing/Tailscale pipeline over a WireGuard mesh network.
- **Event-Driven Assembly:** Watchdog services trigger automated EXIF parsing and HEIC-to-JPG conversion upon arrival, populating the gallery in real-time.
<p align="center">
  <img src="docs/screenshots/gallery_pic.png" alt="Photo Gallery HCI Lightbox" width="800" style="border-radius: 15px; border: 1px solid #334155; margin-top: 20px;"/>
</p>

- **HCI Lightbox Engineering:** A custom-built image viewer with Thumb Zone ergonomics, placing critical **Close** and **Save** actions at the bottom of the screen for seamless one-handed mobile navigation.
- **Metadata Overlays:** Overlays technical EXIF data on every image, providing exact context for **Altitude**, **GPS Coordinates**, and **Timestamp**.

---

<p align="center">
  &copy; 2026 <a href="https://alexryse.com">Alex Ryse</a> | Built for Japan <span style="color: #ec4899;">旅</span><br>
  <em>Powered by Raspberry Pi 5 & Syncthing Automation</em>
</p>
