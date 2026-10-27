document.addEventListener("DOMContentLoaded", () => {
    console.log("About page loaded with assets!");

    // 1. STATS COUNT ANIMATION
    const stats = document.querySelectorAll(".stat-box h2");
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.innerText);
            let count = 0;
            const speed = 20;
            
            const updateCount = () => {
                if (count < target) {
                    count++;
                    stat.innerText = count + "+";
                    setTimeout(updateCount, speed);
                } else {
                    stat.innerText = target + "+";
                }
            };
            updateCount();
        });
    };

    // Trigger animation when stats section visible
    const statsSection = document.querySelector(".stats");
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateStats();
                observer.disconnect();
            }
        });
        observer.observe(statsSection);
    }

    // 2. IMAGE HOVER & CLICK EFFECT
    const sportsCards = document.querySelectorAll(".sports-grid div");
    
    sportsCards.forEach(card => {
        card.addEventListener("click", () => {
            const sportName = card.querySelector("p").innerText;
            alert(`${sportName} Club - Coming Soon! 🏆`);
        });
    });

    // 3. SMOOTH SCROLL & FADE IN ANIMATION
    const allSections = document.querySelectorAll("section");
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    allSections.forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.style.transition = "0.6s ease";
        fadeObserver.observe(section);
    });

    // 4. IMAGE ERROR FALLBACK
    const allImages = document.querySelectorAll("img");
    allImages.forEach(img => {
        img.addEventListener("error", () => {
            console.log(`Image not found: ${img.src}`);
            // If image missing, use nsbm as fallback
            if (!img.src.includes("nsbm.jpg")) {
                img.src = "../assets/nsbm.jpg";
            }
        });
    });
});

console.log("About.js loaded - All assets connected!");