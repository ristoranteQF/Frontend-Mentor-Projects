class PlanetsApp {
    // Constants
    static DEFAULT_PLANET = "Earth";
    static PLANET_DATA_URL = "data.json";
  
    constructor() {
      this.planetsData = [];
      this.init();
    }
  
    // Initialize the app
    init() {
      document.addEventListener("DOMContentLoaded", () => {
        this.renderNavbar();
        this.processPlanetData();
      });
    }
  
    // Render the navbar
    renderNavbar() {
      const navbar = document.querySelector(".navbar");
      navbar.innerHTML = `
        <div class="logo-container">
          <h2 class="logo">THE PLANETS</h2>
        </div>
        <div class="links">
          <a href="index.html?name=Mercury">MERCURY</a>
          <a href="index.html?name=Venus">VENUS</a>
          <a href="index.html?name=Earth">EARTH</a>
          <a href="index.html?name=Mars">MARS</a>
          <a href="index.html?name=Jupiter">JUPITER</a>
          <a href="index.html?name=Saturn">SATURN</a>
          <a href="index.html?name=Uranus">URANUS</a>
          <a href="index.html?name=Neptune">NEPTUNE</a>
        </div>
      `;
    }
  
    // Fetch planet data
    async fetchPlanetData() {
      try {
        const response = await fetch(PlanetsApp.PLANET_DATA_URL);
        if (!response.ok) throw new Error("Failed to fetch planet data");
        return await response.json();
      } catch (error) {
        console.error("Error loading data:", error);
        return [];
      }
    }
  
    // Process planet data and render UI
    async processPlanetData() {
      this.planetsData = await this.fetchPlanetData();
      if (this.planetsData.length === 0) {
        console.error("Planets data is still empty!");
        return;
      }
  
      const urlParams = new URLSearchParams(window.location.search);
      const planetName = urlParams.get("name") || PlanetsApp.DEFAULT_PLANET;
  
      const planet = this.planetsData.find((p) => p.name === planetName);
      if (!planet) {
        console.error(`Planet "${planetName}" not found`);
        return;
      }
  
      this.renderMainContainer(planet);
      this.renderBottomContainer(planet);
      this.setupDetailsFunctionality(planet);
    }
  
    // Render main planet container dynamically
    renderMainContainer(planet) {
      const links = document.querySelectorAll(".links a");
      links.forEach((link) => link.classList.remove("active-link"));
  
      const activeLink = Array.from(links).find(
        (link) => link.textContent === planet.name.toUpperCase()
      );
      if (activeLink) activeLink.classList.add("active-link");
  
      const mainContainer = document.querySelector(".main-container");
      mainContainer.innerHTML = `
        <div class="planet-container">
          <img class="planet-image" src="${planet.images.planet}" alt="${planet.name}">
        </div>
        <div class="planet-details-container">
          <div class="planet-details">
            <h1 class="planet-title">${planet.name.toUpperCase()}</h1>
            <p class="planet-description">${planet.overview.content}</p>
            <div class="source-link-container">
              <span style="color: lightgrey;">Source : </span>
              <a class="source-link" style="text-decoration: underline; color: grey;" href="${planet.overview.source}" target="_blank">Wikipedia</a>
            </div>
          </div>
          <div class="planet-buttons">
            <div class="planet-button overview planet-button-active-color">
              <span style="color: grey;">01</span>
              <p style="margin-right: 1.5rem; padding: 1rem 1.5rem;">OVERVIEW</p>
            </div>
            <div class="planet-button internal">
              <span style="color: grey;">02</span>
              <p style="margin-right: 1.5rem; padding: 1rem 1.5rem;">INTERNAL STRUCTURE</p>
            </div>
            <div class="planet-button surface">
              <span style="color: grey;">03</span>
              <p style="margin-right: 1.5rem; padding: 1rem 1.5rem;">SURFACE GEOLOGY</p>
            </div>
          </div>
        </div>
      `;
    }
  
    // Render planet details dynamically
    renderBottomContainer(planet) {
      const bottomContainerDetails = document.querySelector(".bottom-container-details");
      bottomContainerDetails.innerHTML = `
        <div class="detail-container">
          <span style="color: grey;">ROTATION TIME</span>
          <h2>${planet.rotation}</h2>
        </div>
        <div class="detail-container">
          <span style="color: grey;">REVOLUTION TIME</span>
          <h2>${planet.revolution}</h2>
        </div>
        <div class="detail-container">
          <span style="color: grey;">RADIUS</span>
          <h2>${planet.radius}</h2>
        </div>
        <div class="detail-container">
          <span style="color: grey;">AVERAGE TEMP</span>
          <h2>${planet.temperature}</h2>
        </div>
      `;
    }
  
    // Handle button clicks
    setupDetailsFunctionality(planet) {
      const planetButtons = document.querySelector(".planet-buttons");
      const planetImage = document.querySelector(".planet-image");
      const planetDescription = document.querySelector(".planet-description");
      const sourceLink = document.querySelector(".source-link");
  
      planetButtons.addEventListener("click", (event) => {
        const target = event.target.closest(".planet-button");
        if (!target) return;
  
        // Remove active class from all buttons
        document.querySelectorAll(".planet-button").forEach((btn) => {
          btn.classList.remove("planet-button-active-color");
        });
  
        // Add active class to the clicked button
        target.classList.add("planet-button-active-color");
  
        // Update content based on the clicked button
        if (target.classList.contains("overview")) {
          planetImage.src = planet.images.planet;
          planetDescription.textContent = planet.overview.content;
          sourceLink.href = planet.overview.source;
        } else if (target.classList.contains("internal")) {
          planetImage.src = planet.images.internal;
          planetDescription.textContent = planet.structure.content;
          sourceLink.href = planet.structure.source;
        } else if (target.classList.contains("surface")) {
          planetImage.style.marginTop = "-3rem";
          planetImage.src = planet.images.geology;
          planetDescription.textContent = planet.geology.content;
          sourceLink.href = planet.geology.source;
        }
      });
    }
  }
  
  // Instantiate the app
  new PlanetsApp();