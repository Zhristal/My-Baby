document.addEventListener('DOMContentLoaded', () => {
    // --- Data for easy updates (JSON-like structure) ---
    const siteData = {
        gallery: [
            { type: 'image', src: 'images/1.jpg', caption: 'Our first date 💕' },
            { type: 'video', src: 'videos/1.mp4', caption: 'First Photo Booth 🥹' },
            { type: 'image', src: 'images/2.jpeg', caption: 'Sunset walks with you are my favorite 🌅' },
            { type: 'image', src: 'images/3.jpg', caption: 'Your laugh is the best sound in the world ❤️' },
            { type: 'image', src: 'images/4.jpg', caption: 'Cozy moments are precious 💖' },
            { type: 'video', src: 'videos/2.mp4', caption: 'Ramen Date hehehe 🍜' },
            { type: 'image', src: 'images/5.jpg', caption: 'Every day is a beautiful world with you ✨' },
            { type: 'image', src: 'images/6.jpeg', caption: 'Always and forever holding your hand 🤗' },
            { type: 'video', src: 'videos/3.mp4', caption: 'Mukbang before MUKBANG 😂' },
            { type: 'image', src: 'images/7.jpg', caption: 'This was such a special day for us 🧑🏻‍❤️‍👩🏻' }
            // Add more entries here! Use 'images/your-image.jpg' and 'videos/your-video.mp4'
            // To add more, simply duplicate one of these lines and change the src and caption.
        ],
        reasons: [
            "Your infectious laugh that brightens my day.",
            "The way your eyes sparkle when you're happy.",
            "Your incredible kindness towards everyone.",
            "Your unwavering support and belief in me.",
            "The comfort I feel when I'm just with you.",
            "Your brilliant mind and captivating conversations.",
            "The little thoughtful things you do.",
            "Your strength and resilience in any challenge.",
            "How you make even ordinary moments special.",
            "Your beautiful heart that loves so deeply.",
            "Your adventurous spirit and willingness to try new things.",
            "The way you challenge me to be a better person.",
            "Your ability to find joy in simple things.",
            "The warmth of your hugs.",
            "Your unique sense of humor.",
            "How you always know how to cheer me up.",
            "Your passion for life and everything you do.",
            "The peacefulness of just being in your presence.",
            "Your radiant smile that lights up the room.",
            "Simply, for being you, my love."
        ]
    };

    // --- Background Music Toggle ---
    const music = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    let isMusicPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            music.pause();
            musicToggle.textContent = '🎵 Play Music';
        } else {
            music.play().catch(error => console.error("Music play failed:", error));
            musicToggle.textContent = '🔇 Pause Music';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // --- Gallery Population and Video/Music Interaction ---
    const galleryGrid = document.getElementById('gallery-grid');

    function populateGallery() {
        galleryGrid.innerHTML = '';
        siteData.gallery.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.setAttribute('draggable', true);

            if (item.type === 'image') {
                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.caption;
                galleryItem.appendChild(img);
            } else if (item.type === 'video') {
                const video = document.createElement('video');
                video.src = item.src;
                video.controls = true;
                video.muted = false;

                // Event listeners to control background music
                video.addEventListener('play', () => {
                    if (!music.paused) {
                        music.pause();
                        isMusicPlaying = true;
                    }
                });

                video.addEventListener('pause', () => {
                    if (isMusicPlaying) {
                        music.play();
                    }
                });
                
                video.addEventListener('ended', () => {
                    if (isMusicPlaying) {
                        music.play();
                    }
                });

                galleryItem.appendChild(video);
            }

            const caption = document.createElement('p');
            caption.classList.add('caption');
            caption.textContent = item.caption;
            galleryItem.appendChild(caption);

            galleryGrid.appendChild(galleryItem);
        });

        // Add drag and drop functionality (conceptual)
        let draggedItem = null;
        galleryGrid.addEventListener('dragstart', (e) => {
            draggedItem = e.target.closest('.gallery-item');
            if (draggedItem) {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', draggedItem.outerHTML);
                setTimeout(() => draggedItem.classList.add('dragging'), 0);
            }
        });
        galleryGrid.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(galleryGrid, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                if (afterElement == null) {
                    galleryGrid.appendChild(draggable);
                } else {
                    galleryGrid.insertBefore(draggable, afterElement);
                }
            }
        });
        galleryGrid.addEventListener('dragend', () => {
            if (draggedItem) {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
                console.log("Gallery order changed (not saved permanently in this demo)");
            }
        });
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.gallery-item:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: -Infinity }).element;
        }
    }
    populateGallery();

    // --- "Reasons I Love You" Animation ---
    const reasonsList = document.getElementById('reasons-list');
    function animateReasons() {
        reasonsList.innerHTML = '';
        siteData.reasons.forEach((reason, index) => {
            const li = document.createElement('li');
            li.textContent = reason;
            reasonsList.appendChild(li);
            setTimeout(() => {
                li.classList.add('visible');
            }, index * 200);
        });
    }
    const reasonsSection = document.querySelector('.reasons-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    const reasonsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateReasons();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    reasonsObserver.observe(reasonsSection);

    // --- Personal Love Letter Reveal ---
    const revealLetterButton = document.getElementById('reveal-letter-button');
    const loveLetterContent = document.getElementById('love-letter-content');
    const envelope = document.getElementById('envelope');
    revealLetterButton.addEventListener('click', () => {
        envelope.classList.add('open');
        revealLetterButton.style.opacity = '0';
        revealLetterButton.style.pointerEvents = 'none';
        setTimeout(() => {
            loveLetterContent.classList.add('revealed');
        }, 800);
    });
});