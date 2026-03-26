let allPhrases = [];
let filteredPhrases = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadPhrases();
});

function loadPhrases() {
    fetch('/api/phrases')
        .then(res => res.json())
        .then(data => {
            allPhrases = data;
            filteredPhrases = [...allPhrases];
            setupCategories();
            showCard();
        });
}

function setupCategories() {
    const filterContainer = document.getElementById('category-filter');
    const categories = [...new Set(allPhrases.map(p => p.category))];

    filterContainer.innerHTML = '<button onclick="filterPhrases(\'all\', this)" class="cat-btn active">All Categories</button>';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.innerText = cat;
        btn.onclick = function() { filterPhrases(cat, this); };
        filterContainer.appendChild(btn);
    });
}

function filterPhrases(category, btn) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    filteredPhrases = category === 'all' 
        ? [...allPhrases] 
        : allPhrases.filter(p => p.category === category);
    
    currentIndex = 0;
    resetCard();
    showCard();
}

function flipCard() {
    document.getElementById('flashcard').classList.toggle('is-flipped');
}

function resetCard() {
    document.getElementById('flashcard').classList.remove('is-flipped');
}

function showCard() {
    if (filteredPhrases.length === 0) {
        document.getElementById('card-english').innerText = "No Categories Found";
        document.getElementById('card-kanji').innerText = "---";
        return;
    }
    
    const p = filteredPhrases[currentIndex];
    document.getElementById('card-english').innerText = p.english;
    document.getElementById('card-kanji').innerText = p.kanji;
    document.getElementById('card-romaji').innerText = p.romaji;
    document.getElementById('card-cat').innerText = `Category: ${p.category}`;
    
    document.getElementById('card-counter').innerText = `Phrase ${currentIndex + 1} of ${filteredPhrases.length}`;
}

function nextCard() {
    resetCard();
    // Small delay to let the card flip back before changing text
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % filteredPhrases.length;
        showCard();
    }, 250);
}

function prevCard() {
    resetCard();
    setTimeout(() => {
        currentIndex = (currentIndex - 1 + filteredPhrases.length) % filteredPhrases.length;
        showCard();
    }, 250);
}


window.shuffleDeck = function() {
    resetCard();
    setTimeout(() => {
        for (let i = filteredPhrases.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filteredPhrases[i], filteredPhrases[j]] = [filteredPhrases[j], filteredPhrases[i]];
        }
        currentIndex = 0;
        showCard();
    }, 250);
};

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') { flipCard(); e.preventDefault(); } // Space to flip
    if (e.key === 'ArrowRight') nextCard(); // Nav right
    if (e.key === 'ArrowLeft') prevCard(); // Nav left
    if (e.key === 's' || e.key === 'S') shuffleDeck(); // Shuffle
});