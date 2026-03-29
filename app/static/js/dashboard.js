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

// Disabled for now
// // --- 2. CURRENCY LOGIC ---
// let exchangeRate = 150.00; // Default until API loads
// let isUsdToJpy = true;

// const inputTop = document.getElementById('input-top');
// const inputBottom = document.getElementById('input-bottom');
// const labelTop = document.getElementById('label-top');
// const labelBottom = document.getElementById('label-bottom');
// const swapBtn = document.getElementById('swap-btn');

// function updateCurrency() {
//     fetch('/api/currency')
//         .then(res => res.json())
//         .then(data => {
//             exchangeRate = data.rate;
//             document.getElementById('current-rate').innerText = `¥${data.rate}`;
//             renderChart(data.history);
//         });
// }

// inputTop.addEventListener('input', (e) => {
//     const val = e.target.value;
//     if (isUsdToJpy) {
//         inputBottom.value = (val * exchangeRate).toFixed(0);
//     } else {
//         inputBottom.value = (val / exchangeRate).toFixed(2);
//     }
// });

// swapBtn.addEventListener('click', () => {
//     isUsdToJpy = !isUsdToJpy;
//     inputTop.value = '';
//     inputBottom.value = '';
//     if (isUsdToJpy) {
//         labelTop.innerText = '$';
//         labelBottom.innerText = '¥';
//         inputTop.placeholder = 'USD';
//     } else {
//         labelTop.innerText = '¥';
//         labelBottom.innerText = '$';
//         inputTop.placeholder = 'JPY';
//     }
// });

// function renderChart(historyData) {
//     const ctx = document.getElementById('currencyChart').getContext('2d');
//     new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: ['', '', '', '', '', '', ''],
//             datasets: [{
//                 data: historyData,
//                 borderColor: '#22c55e',
//                 borderWidth: 2,
//                 pointRadius: 0,
//                 fill: true,
//                 backgroundColor: 'rgba(34, 197, 94, 0.1)',
//                 tension: 0.4
//             }]
//         },
//         options: {
//             plugins: { legend: { display: false } },
//             scales: { x: { display: false }, y: { display: false } },
//             responsive: true,
//             maintainAspectRatio: false
//         }
//     });
// }
// updateCurrency();
