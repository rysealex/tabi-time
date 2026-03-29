document.addEventListener('DOMContentLoaded', () => {
    loadGallery();
});

function loadGallery() {
    fetch('/api/points')
        .then((res) => res.json())
        .then((points) => {
            const container = document.getElementById('gallery-container');
            if (!points || points.length === 0) {
                container.innerHTML = `<p class="text-center text-slate-500 py-20 italic">No photos found in the archive.</p>`;
                return;
            }

            container.innerHTML = ''; // Clear loader

            // 1. Group by Date (YYYY/MM/DD)
            const groups = {};
            points.forEach((p) => {
                const date = p.time.split(' ')[0];
                if (!groups[date]) groups[date] = [];
                groups[date].push(p);
            });

            // 2. Sort Dates Descending (Newest First)
            const sortedDates = Object.keys(groups).sort().reverse();

            // Global index for photo numbering
            let globalIndex = points.length;

            // 3. Build the UI
            sortedDates.forEach((date) => {
                const section = document.createElement('section');

                // Header
                const header = document.createElement('div');
                header.className = 'date-header';
                header.innerHTML = `
                    <div class="date-line"></div>
                    <span class="date-label">${formatLabel(date)}</span>
                    <div class="date-line"></div>
                `;

                // Grid
                const grid = document.createElement('div');
                grid.className = 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4';

                groups[date].forEach((p) => {
                    const item = document.createElement('div');
                    item.className =
                        'gallery-item aspect-square cursor-pointer border border-slate-800 rounded-sm';
                    const currentIndex = globalIndex;
                    item.onclick = () => openLightbox(p, currentIndex);

                    item.innerHTML = `
                        <img src="/static/photos/${p.img}" 
                             class="w-full h-full object-cover transition duration-500 hover:scale-105" 
                             loading="lazy">
                    `;
                    grid.appendChild(item);
                    globalIndex--; // Decrement global index for next photo
                });

                section.appendChild(header);
                section.appendChild(grid);
                container.appendChild(section);
            });
        });
}

// Helper to format date labels
function formatLabel(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Lightbox Controls
window.openLightbox = function (photoData, entryNumber) {
    const modal = document.getElementById('lightbox');

    // Set Image and Download Link
    const fullPath = `/static/photos/${photoData.img}`;
    document.getElementById('lightbox-img').src = fullPath;
    document.getElementById('lb-download').href = fullPath;

    // Inject Metadata
    document.getElementById('lb-id').innerText = `#${String(entryNumber).padStart(3, '0')}`;
    document.getElementById('lb-alt').innerText = photoData.alt
        ? `${Math.round(photoData.alt)}m`
        : '---';
    document.getElementById('lb-time').innerText = photoData.time || 'Unknown';
    document.getElementById('lb-coords').innerText =
        `${photoData.lat.toFixed(4)}, ${photoData.lon.toFixed(4)}`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
};

window.closeLightbox = function () {
    const modal = document.getElementById('lightbox');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
};

// Close on 'Esc' key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});
