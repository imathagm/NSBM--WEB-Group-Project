// Stats Counter Animation
document.addEventListener("DOMContentLoaded", () => {
    console.log("About Page Loaded - risma-work branch");
    
    // Image fallback if not found
    document.querySelectorAll("img").forEach(img => {
        img.addEventListener("error", function() {
            this.src = "../assets/hero.jpg";
        });
    });

    // Club card click
    document.querySelectorAll(".club-card").forEach(card => {
        card.addEventListener("click", () => {
            alert(card.querySelector("h4").innerText + " Club - Coming Soon!");
        });
    });
});