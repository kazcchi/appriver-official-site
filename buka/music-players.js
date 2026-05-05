// BUKA - Music Players Platform Switcher
document.addEventListener('DOMContentLoaded', () => {
  const platformButtons = document.querySelectorAll('.platform-btn');
  const playerEmbeds = document.querySelectorAll('.player-embed');

  platformButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('coming-soon')) return;

      const platform = button.dataset.platform;

      platformButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      playerEmbeds.forEach(embed => {
        embed.style.display = 'none';
      });

      const targetPlayer = document.getElementById(`${platform}-player`);
      if (targetPlayer) {
        targetPlayer.style.display = 'block';
      }
    });
  });
});
