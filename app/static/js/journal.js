// 1. Map Layers
const darkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CartoDB' });
const stamenTerrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', { attribution: '&copy; Stadia Maps' });
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; Esri' });

// 2. Initialize Map
const map = L.map('map', {
    center: [36.2048, 138.2529],
    zoom: 6,
    layers: [stamenTerrain]
});

const baseMaps = {
    "<span class='text-slate-900 font-sans'>Mountain Terrain</span>": stamenTerrain,
    "<span class='text-slate-900 font-sans'>Dark Protocol</span>": darkMatter,
    "<span class='text-slate-900 font-sans'>Satellite View</span>": satellite
};
L.control.layers(baseMaps).addTo(map);

// 3. Global State
let allPoints = [];
let markers = [];
let segments = [];

// 4. Distance Helper
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const km = R * c;
    return { km: km.toFixed(1), miles: (km * 0.621371).toFixed(1) };
}

// 5. Main Render Function
function renderMap(filteredPoints) {
    // Clear existing layers
    markers.forEach(m => map.removeLayer(m));
    segments.forEach(s => map.removeLayer(s));
    markers = [];
    segments = [];

    const bounds = [];

    // Draw Segments
    for (let i = 0; i < filteredPoints.length - 1; i++) {
        const p1 = filteredPoints[i];
        const p2 = filteredPoints[i+1];
        const dist = calculateDistance(p1.lat, p1.lon, p2.lat, p2.lon);

        const segment = L.polyline([[p1.lat, p1.lon], [p2.lat, p2.lon]], {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.6,
            dashArray: '8, 12',
            interactive: true
        }).addTo(map);

        segment.on('mouseover', function(e) {
            this.setStyle({ color: '#60a5fa', opacity: 1, weight: 6 });
            L.popup({ closeButton: false, className: 'dist-tooltip', offset: [0, -10] })
                .setLatLng(e.latlng)
                .setContent(`<div class="text-[10px] font-mono p-1 text-white text-center">${dist.km} km<br>${dist.miles} mi</div>`)
                .openOn(map);
        });

        segment.on('mouseout', function(e) {
            this.setStyle({ color: '#3b82f6', opacity: 0.6, weight: 4 });
            map.closePopup();
        });
        segments.push(segment);
    }

    // Draw Markers
    filteredPoints.forEach((p, index) => {
        bounds.push([p.lat, p.lon]);
        const marker = L.circleMarker([p.lat, p.lon], {
            radius: 8,
            fillColor: "#3b82f6",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(map);

        const photoTime = p.time ? p.time : "Unknown";
        const altitude = p.alt ? `${Math.round(p.alt)}m` : "---";
        const globalIndex = allPoints.findIndex(point => point.img === p.img);
        const entryID = String(globalIndex + 1).padStart(3, '0');

        const popupContent = `
            <div class="w-52 p-0 bg-slate-800">
                <img src="/static/photos/${p.img}" 
                    class="rounded-md mb-3 w-full h-32 object-cover shadow-sm" 
                    alt="Travel Photo">
                
                <div class="px-2 pb-1 space-y-1">
                    <div class="grid grid-cols-2 gap-2 border-b border-slate-700 pb-2">
                        <div>
                            <p class="text-[10px] text-slate-500 uppercase font-bold">Entry ID</p>
                            <p class="text-[10px] font-bold text-blue-400 uppercase tracking-tighter italic">#${entryID}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] text-slate-500 uppercase font-bold">Captured</p>
                            <p class="text-[10px] font-mono text-white uppercase">${photoTime}</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <p class="text-[10px] text-slate-500 uppercase font-bold">Altitude</p>
                            <p class="text-[10px] font-mono text-white">${altitude}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] text-slate-500 uppercase font-bold">GPS Coords</p>
                            <p class="text-[10px] font-mono text-white">${p.lat.toFixed(2)}, ${p.lon.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        marker.bindPopup(popupContent, { maxWidth: 240, minWidth: 220, offset: [0, -5] });
        markers.push(marker);
    });

    if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [80, 80], animate: true, duration: 1 });
    } else if (bounds.length === 1) {
        map.setView(bounds[0], 10, { animate: true, duration: 1});
    }
}

// 6. Filter Function
window.filterByDay = function(date, btn) {
    // 1. Remove active class from ALL buttons
    document.querySelectorAll('.day-btn').forEach(b => {
        b.classList.remove('active');
    });

    // 2. Add active class to the one we just clicked (btn)
    if (btn) {
        btn.classList.add('active');
    }

    // 3. Run the map filtering logic
    if (date === 'all') {
        renderMap(allPoints);
    } else {
        const filtered = allPoints.filter(p => p.time.startsWith(date));
        renderMap(filtered);
    }
};

// 7. Initial Fetch & Picker Setup
fetch('/api/points')
    .then(res => res.json())
    .then(points => {
        if (points.length === 0) return;
        allPoints = points;

        const picker = document.getElementById('day-filter');
        // Extract unique dates from the points
        const uniqueDates = [...new Set(allPoints.map(p => p.time.split(' ')[0]))];

        uniqueDates.forEach((date, index) => {
            const btn = document.createElement('button');
            btn.className = 'day-btn px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest';
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            }).toUpperCase();
            btn.innerText = formattedDate;
            btn.onclick = function() { filterByDay(date, this); };
            picker.appendChild(btn);
        });

        // Set "Full Trip" as default
        const allBtn = picker.querySelector('button'); 
        renderMap(allPoints);
    });