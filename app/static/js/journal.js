// 1. Define Map Styles
const darkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
    attribution: '&copy; CartoDB' 
});
const stamenTerrain = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; Stadia Maps & Stamen Design',
});
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    attribution: '&copy; Esri' 
});

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

// 3. Distance Helper
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const km = R * c;
    return {
        km: km.toFixed(1),
        miles: (km * 0.621371).toFixed(1)
    };
}

// 4. Fetch Points
fetch('/api/points')
    .then(res => res.json())
    .then(points => {
        if (points.length === 0) return;

        const bounds = [];

        // Draw Path Segments
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i+1];
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
        }

        // Add Point Markers
        points.forEach((p, index) => {
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

            const popupContent = `
                <div class="w-52 p-0 bg-slate-800">
                    <img src="/static/photos/${p.img}" 
                        class="rounded-md mb-3 w-full h-32 object-cover shadow-sm" 
                        alt="Travel Photo">
                    
                    <div class="px-2 pb-2 space-y-2">
                        <div class="flex justify-between items-center border-b border-slate-700 pb-1">
                            <span class="text-[10px] font-bold text-blue-400 uppercase tracking-tighter italic">Stop #${index + 1}</span>
                            <span class="text-[10px] font-mono text-white">${photoTime}</span>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <p class="text-[10px] text-slate-500 uppercase font-bold">Altitude</p>
                                <p class="text-[10px] font-mono text-white">${altitude}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-[10px] text-slate-500 uppercase font-bold">Coords</p>
                                <p class="text-[10px] font-mono text-white">${p.lat.toFixed(2)}, ${p.lon.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent, {
                maxWidth: 240,
                minWidth: 220,
                offset: [0, -5]
            });
        });

        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    });