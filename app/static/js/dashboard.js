// --- 1. TIME LOGIC ---
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

// --- 2. TRIP COUNTDOWN LOGIC ---
function updateCountdown() {
    // 1. Pull from LocalStorage (Default to a future date if empty)
    const savedDate = localStorage.getItem('tabitime_return_date') || '2026-04-15';

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

// --- 3. CURRENCY LOGIC ---
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
