class PlaylistManager {
  constructor() {
    this.playlists = [];
    this.init();
  }

  async init() {
    await this.loadPlaylists();
    this.renderPlaylists();
    this.bindEvents();
  }

  bindEvents() {
    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.searchPlaylists(e.target.value);
    });

    document.getElementById("menuToggle").addEventListener("click", () => {
      this.toggleSidebar();
    });
  }

  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
  }

  renderPlaylists(filteredPlaylists = null) {
    const playlistList = document.getElementById("playlistList");
    const playlists = filteredPlaylists || this.playlists;

    playlistList.innerHTML = "";

    playlists.forEach((playlist) => {
      const li = document.createElement("li");
      li.className = "playlist-item";
      li.innerHTML = `
        <div class="playlist-name">${playlist.name}</div>
        <div class="artist-name">${playlist.artist}</div>
      `;

      li.addEventListener("click", () => {
        this.selectPlaylist(playlist, li);
      });

      playlistList.appendChild(li);
    });
  }

  selectPlaylist(playlist, element) {
    document.querySelectorAll(".playlist-item").forEach((item) => {
      item.classList.remove("active");
    });
    element.classList.add("active");

    this.loadSpotifyPlayer(playlist.id);
  }

  loadSpotifyPlayer(playlistId) {
    const playerContainer = document.getElementById("playerContainer");
    playerContainer.innerHTML = `
      <iframe 
        src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator" 
        width="100%"
        frameBorder="0" 
        allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy">
      </iframe>
    `;
  }

  searchPlaylists(query) {
    if (!query) {
      this.renderPlaylists();
      return;
    }

    const filtered = this.playlists.filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(query.toLowerCase()) ||
        playlist.artist.toLowerCase().includes(query.toLowerCase())
    );

    this.renderPlaylists(filtered);
  }

  async loadPlaylists() {
    try {
      const response = await fetch("playlists.json");
      this.playlists = await response.json();
    } catch (error) {
      console.error("Error loading playlists:", error);
      this.playlists = [];
    }
  }
}

new PlaylistManager();
