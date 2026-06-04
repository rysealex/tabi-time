// --- 1. TRIP MANAGEMENT LOGIC ---
let allTrips = [];
const DEFAULT_CONTEXT_ID = 'tabitime_active_trip_id';

// Hook into DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadTrips(); // Populate all trips upon page load
});

// Load All Trips Data Function
function loadTrips() {
    fetch('/api/trips')
        .then((res) => res.json())
        .then((trips) => {
            if (trips.length === 0) {
                renderEmptySelectorContext();
                return;
            }
            allTrips = trips;

            // Inject sample trip IDs for any trips without IDs
            allTrips.forEach((trip, index) => {
                if (!trip.id) trip.id = `trip_sample_${index}`;
            });

            // Initialize select element and active countdown values instantly
            populateActiveTripDropdown();
        });
}

// Populate Active Trip Dropdown Function
function populateActiveTripDropdown() {
    const selectMenu = document.getElementById('active-trip-select');
    if (!selectMenu) return;

    selectMenu.innerHTML = '';

    // Build the dynamic UI elements loop line by line
    allTrips.forEach((trip) => {
        const option = document.createElement('option');
        option.value = trip.id;
        option.textContent = trip.name; // Option text content will be the trip name
        selectMenu.appendChild(option);
    });
}

// Handle Trip Context Change Function
function handleTripContextChange(val) {
    console.log('Selected target ID registered successfully:', val);
    if (val === 'loading' || val === 'none') return;

    localStorage.setItem(DEFAULT_CONTEXT_ID, val);

    // Update the trip countdown modal to match selected trip
    const activeTrip = allTrips.find((t) => t.id === val);
    if (activeTrip) {
        localStorage.setItem('tabitime_return_date', activeTrip.end_date);
        updateCountdown();
    }
}

// Render Empty Selector Context Function
function renderEmptySelectorContext() {
    const selectMenu = document.getElementById('active-trip-select');
    if (selectMenu) {
        selectMenu.innerHTML = `<option value="none">No Trips Found</option>`;
    }
}

// Add, Edit, Delete Functions
function addTrip() {
    // Fetch params from the Add Trip Portal UI
    const name = document.getElementById('add-trip-name').value.trim();
    const startDate = document.getElementById('add-trip-start').value;
    const endDate = document.getElementById('add-trip-end').value;

    if (!name || !startDate || !endDate) {
        alert('Action Required: Please enter all trip details.');
        return;
    }

    fetch('/api/trips_add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, start_date: startDate, end_date: endDate }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                localStorage.setItem(DEFAULT_CONTEXT_ID, data.trip.id);
                alert('New trip successfully added!');
                loadTrips();
                closeAddModal();
            } else {
                alert('Error adding trip. Please try again.');
            }
        })
        .catch((err) => console.error('Critical Add Trip Error:', err));
}

function editTrip(name, startDate, endDate) {
    fetch('/api/trips_edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, start_date: startDate, end_date: endDate }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                loadTrips();
                closeTripModal();
            }
        });
}

function deleteTrip() {
    const id = localStorage.getItem(DEFAULT_CONTEXT_ID);

    if (!id) {
        alert('System Error! Please try again.');
        return;
    }

    fetch('/api/trips_delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                if (localStorage.getItem(DEFAULT_CONTEXT_ID) === id) {
                    localStorage.removeItem(DEFAULT_CONTEXT_ID);
                }
                alert('Trip successfully deleted!');
                loadTrips();
                closeTripModal();
            } else {
                alert('Error deleting trip. Please try again.');
            }
        })
        .ccatch((err) => console.error('Critical Delete Trip Error:', err));
}

// Modal Toggle Functions
function openTripModal() {
    const selectMenu = document.getElementById('active-trip-select');
    if (!selectMenu) return;

    const selectedValue = selectMenu.value;

    // Gatekeeper Check: Enforce picking a trip before opening the portal
    if (selectedValue === 'loading' || selectedValue === 'none' || !selectedValue) {
        alert(
            'Action Required: Please select a valid trip context before launching management controls.'
        );
        return;
    }

    // Capture the human-readable text name of the option element currently selected
    const selectedTripName = selectMenu.options[selectMenu.selectedIndex].text;

    // Inject the active trip name straight into our modal preview text node
    document.getElementById('modal-active-trip-display').innerText = selectedTripName;

    // Open the modal container layout safely
    document.getElementById('trip-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function openAddModal() {
    document.getElementById('add-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeTripModal() {
    document.getElementById('trip-modal').classList.add('hidden');
    document.body.style.overflow = '';
}

function closeAddModal() {
    document.getElementById('add-modal').classList.add('hidden');
    document.body.style.overflow = '';

    // Clear the inputs
    document.getElementById('add-trip-name').value = '';
    document.getElementById('add-trip-start').value = '';
    document.getElementById('add-trip-end').value = '';
}

// --- 2. TIME LOGIC ---
function updateClocks() {
    fetch('/api/time')
        .then((res) => res.json())
        .then((data) => {
            document.getElementById('jp-time').innerText = data.japan;
            document.getElementById('jp-date').innerText = data.japan_date;
            document.getElementById('home-time').innerText = data.home;
            document.getElementById('home-date').innerText = data.home_date;
        });
}
setInterval(updateClocks, 60000);
updateClocks();

// --- 3. TRIP COUNTDOWN LOGIC ---

function updateCountdown() {
    // 1. Pull from LocalStorage (Default to a future date if empty)
    const savedDate = localStorage.getItem('tabitime_return_date') || '2026-05-28';

    const target = new Date(savedDate + 'T00:00:00');
    const now = new Date();
    const diff = target - now;
    const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

    // 2. Format Target: Day (Mon), Month (Mar) Day Number (30)
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = target.toLocaleDateString('en-US', options);
    // Result format: "Wed, Apr 15"

    document.getElementById('countdown-days').innerText = daysLeft > 0 ? daysLeft : 0;
    document.getElementById('return-date-display').innerText = `Target: ${formattedDate}`;

    // Set the input field to the current saved date for convenience
    document.getElementById('date-input').value = savedDate;
}

// Modal Toggle Functions
function openDateModal() {
    document.getElementById('date-modal').classList.remove('hidden');
}

function closeDateModal() {
    document.getElementById('date-modal').classList.add('hidden');
}

function saveReturnDate() {
    const newDate = document.getElementById('date-input').value;
    if (newDate) {
        localStorage.setItem('tabitime_return_date', newDate);
        updateCountdown();
        closeDateModal();
    }
}

// Ensure this runs when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
});

// Disabled for now
// --- 4. CURRENCY LOGIC ---
let exchangeRate = 150.0; // Default until API loads
let isUsdToJpy = true;

const inputTop = document.getElementById('input-top');
const inputBottom = document.getElementById('input-bottom');
const labelTop = document.getElementById('label-top');
const labelBottom = document.getElementById('label-bottom');
const swapBtn = document.getElementById('swap-btn');

function updateCurrency() {
    fetch('/api/currency')
        .then((res) => res.json())
        .then((data) => {
            exchangeRate = data.rate;
            document.getElementById('current-rate').innerText = `¥${data.rate}`;
            renderChart(data.history);
        });
}

inputTop.addEventListener('input', (e) => {
    const val = e.target.value;
    if (isUsdToJpy) {
        inputBottom.value = (val * exchangeRate).toFixed(0);
    } else {
        inputBottom.value = (val / exchangeRate).toFixed(2);
    }
});

swapBtn.addEventListener('click', () => {
    isUsdToJpy = !isUsdToJpy;
    inputTop.value = '';
    inputBottom.value = '';
    if (isUsdToJpy) {
        labelTop.innerText = '$';
        labelBottom.innerText = '¥';
        inputTop.placeholder = 'USD';
    } else {
        labelTop.innerText = '¥';
        labelBottom.innerText = '$';
        inputTop.placeholder = 'JPY';
    }
});

function renderChart(historyData) {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', '', ''],
            datasets: [
                {
                    data: historyData,
                    borderColor: '#22c55e',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true,
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                },
            ],
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } },
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}
updateCurrency();
