// Music Players Platform Switcher
document.addEventListener('DOMContentLoaded', () => {
    const platformButtons = document.querySelectorAll('.platform-btn');
    const playerEmbeds = document.querySelectorAll('.player-embed');

    // Platform switching functionality
    platformButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Skip if coming soon
            if (button.classList.contains('coming-soon')) {
                return;
            }

            const platform = button.dataset.platform;

            // Update active button
            platformButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show corresponding player
            playerEmbeds.forEach(embed => {
                embed.style.display = 'none';
            });

            const targetPlayer = document.getElementById(`${platform}-player`);
            if (targetPlayer) {
                targetPlayer.style.display = 'block';
            }

            console.log(`Switched to ${platform} player`);
        });
    });

    // Initialize with Spotify as default
    console.log('Music Players initialized - Spotify active by default');
});