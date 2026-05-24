import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HopitalService } from '../../services/hopital.service';
import { SamuService } from '../../services/samu.service';
import { DashboardService, DashboardStatsDTO } from '../../services/dashboard.service';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css'
})
export class HomeDashboardComponent implements OnInit {
  private map: any;
  private L: any;
  hopitals: any[] = [];
  samus: any[] = [];
  loading: boolean = true;
  private mapInitialized: boolean = false;
  userLocation: { lat: number, lng: number } | null = null;
  userMarker: any = null;
  nearestSamusMarkers: any[] = [];
  nearestSamus: any[] = [];
  dashboardStats: DashboardStatsDTO | null = null;
  statsLoading: boolean = true;

  constructor(
    private hopitalService: HopitalService,
    private samuService: SamuService,
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const leaflet = await import('leaflet');
        this.L = leaflet.default || leaflet;
        this.loadData();
        this.loadDashboardStats();
        setTimeout(() => { this.initMap(); }, 500);
      } catch (error) {
        console.error('Erreur Leaflet:', error);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.map) { this.map.remove(); }
  }

  loadDashboardStats(): void {
    this.statsLoading = true;
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.dashboardStats = data;
        this.statsLoading = false;
      },
      error: () => {
        this.statsLoading = false;
      }
    });
  }

  loadData(): void {
    this.hopitalService.getAllHopitalsNoPagination().subscribe({
      next: (data) => {
        this.hopitals = data.filter((h: any) => h.latitude && h.longitude);
        if (this.mapInitialized) { this.addHopitalMarkers(); }
      },
      error: () => {}
    });
    this.samuService.getAllSamusNoPagination().subscribe({
      next: (data) => {
        this.samus = data.filter((s: any) => s.latitude && s.longitude);
        if (this.mapInitialized) { this.addSamuMarkers(); }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  initMap(): void {
    if (!isPlatformBrowser(this.platformId) || !this.L) { return; }
    const mapElement = document.getElementById('map');
    if (!mapElement) { return; }
    
    this.map = this.L.map('map').setView([34.0, 9.0], 7);
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18
    }).addTo(this.map);
    
    this.mapInitialized = true;
    
    if (this.hopitals.length > 0) { this.addHopitalMarkers(); }
    if (this.samus.length > 0) { this.addSamuMarkers(); }
  }

  getUserLocation(): void {
    if (!isPlatformBrowser(this.platformId) || !navigator.geolocation) { return; }
    if (this.userMarker && this.map) { this.map.removeLayer(this.userMarker); }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        if (this.map && this.L) {
          this.addUserMarker();
          this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
        }
      },
      () => { alert('Erreur géolocalisation'); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  addUserMarker(): void {
    if (!this.map || !this.L || !this.userLocation) { return; }
    
    const icon = this.L.divIcon({
      html: '<span style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background-color:#4CAF50;color:white">📍</span>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    
    this.userMarker = this.L.marker([this.userLocation.lat, this.userLocation.lng], { icon }).addTo(this.map);
    this.userMarker.bindPopup(`
      <div style="text-align: center; min-width: 180px;">
        <strong style="font-size: 16px; color: #4CAF50;">📍 Votre position</strong><br>
        <hr style="margin: 8px 0; border: none; border-top: 1px solid #ecf0f1;">
        <div style="text-align: left; font-size: 13px;">
          <strong>Latitude:</strong> ${this.userLocation.lat.toFixed(6)}<br>
          <strong>Longitude:</strong> ${this.userLocation.lng.toFixed(6)}
        </div>
      </div>
    `).openPopup();
  }

  addHopitalMarkers(): void {
    if (!this.map || !this.L) { return; }
    
    this.hopitals.forEach(h => {
      const icon = this.L.divIcon({
        html: '<span style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background-color:#3498db;color:white">🏥</span>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      this.L.marker([h.latitude, h.longitude], { icon }).addTo(this.map).bindPopup(`
        <div style="text-align: center; min-width: 250px;">
          <strong style="font-size: 16px; color: #3498db;">🏥 ${h.nom}</strong><br>
          <em style="color: #7f8c8d;">${h.type}</em><br>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #ecf0f1;">
          <div style="text-align: left; font-size: 13px; line-height: 1.6;">
            <strong>📍 Gouvernorat:</strong> ${h.gouvernorat || 'N/A'}<br>
            <strong>🏙️ Ville:</strong> ${h.ville || 'N/A'}<br>
            <strong>� Adresse:</strgong> ${h.adresse || 'N/A'}<br>
            <strong>📞 Téléphone:</strong> ${h.numeroTelephone || 'N/A'}<br>
            <strong>📧 Email:</strong> ${h.email || 'N/A'}<br>
            ${h.siteWeb ? '<strong>🌐 Site Web:</strong> <a href="' + h.siteWeb + '" target="_blank">' + h.siteWeb + '</a><br>' : ''}
            ${h.heureOuverture ? '<strong>🕐 Ouverture:</strong> ' + h.heureOuverture + '<br>' : ''}
            ${h.heureFermeture ? '<strong>🕐 Fermeture:</strong> ' + h.heureFermeture + '<br>' : ''}
            ${h.description ? '<strong>📝 Description:</strong> ' + h.description + '<br>' : ''}
            <strong>⚕️ Urgence:</strong> ${h.urgence ? 'Oui' : 'Non'}
          </div>
        </div>
      `);
    });
  }

  addSamuMarkers(): void {
    if (!this.map || !this.L) { return; }
    
    this.samus.forEach(s => {
      const icon = this.L.divIcon({
        html: '<span style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background-color:#e74c3c;color:white">🚑</span>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      
      this.L.marker([s.latitude, s.longitude], { icon }).addTo(this.map).bindPopup(`
        <div style="text-align: center; min-width: 250px;">
          <strong style="font-size: 16px; color: #e74c3c;">🚑 ${s.nom}</strong><br>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #ecf0f1;">
          <div style="text-align: left; font-size: 13px; line-height: 1.6;">
            <strong>📍 Gouvernorat:</strong> ${s.gouvernorat || 'N/A'}<br>
            <strong>🏙️ Ville:</strong> ${s.ville || 'N/A'}<br>
            <strong>� Adresse:</strong> ${s.adresse || 'N/A'}<br>
            <strong>� Téléphone:</strongg> ${s.numeroTelephone}<br>
            <strong>📧 Email:</strong> ${s.email || 'N/A'}<br>
            ${s.hopitalNom ? '<strong>🏥 Hôpital:</strong> ' + s.hopitalNom + '<br>' : ''}
            <strong>📍 Coordonnées:</strong> ${s.latitude.toFixed(4)}, ${s.longitude.toFixed(4)}
          </div>
        </div>
      `);
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  findNearestSamus(): void {
    if (!this.userLocation || this.samus.length === 0) { 
      alert('Veuillez d\'abord vous localiser');
      return; 
    }
    
    this.nearestSamusMarkers.forEach(m => this.map.removeLayer(m));
    this.nearestSamusMarkers = [];
    
    const samusWithDistance = this.samus.map(samu => ({
      ...samu,
      distance: this.calculateDistance(this.userLocation!.lat, this.userLocation!.lng, samu.latitude, samu.longitude)
    }));
    
    this.nearestSamus = samusWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 4);
    
    this.nearestSamus.forEach((samu, i) => {
      const line = this.L.polyline([[this.userLocation!.lat, this.userLocation!.lng], [samu.latitude, samu.longitude]], { color: '#4CAF50', weight: 3, opacity: 0.7, dashArray: '10, 10' }).addTo(this.map);
      this.nearestSamusMarkers.push(line);
      
      const icon = this.L.divIcon({
        html: '<span style="width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;background-color:#ff9800;color:white;border:3px solid #4CAF50">🚑</span>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });
      
      const marker = this.L.marker([samu.latitude, samu.longitude], { icon }).addTo(this.map).bindPopup(`
        <div style="text-align: center; min-width: 250px;">
          <strong style="font-size: 16px; color: #ff9800;">🚑 SAMU #${i+1}</strong><br>
          <strong style="font-size: 14px; color: #2c3e50;">${samu.nom}</strong><br>
          <hr style="margin: 8px 0; border: none; border-top: 1px solid #ecf0f1;">
          <div style="text-align: left; font-size: 13px; line-height: 1.6;">
            <strong>📍 Gouvernorat:</strong> ${samu.gouvernorat || 'N/A'}<br>
            <strong>🏙️ Ville:</strong> ${samu.ville || 'N/A'}<br>
            <strong>📍 Adresse:</strong> ${samu.adresse || 'N/A'}<br>
            <strong>📞 Téléphone:</strong> ${samu.numeroTelephone}<br>
            <strong>📧 Email:</strong> ${samu.email || 'N/A'}<br>
            ${samu.hopitalNom ? '<strong>🏥 Hôpital:</strong> ' + samu.hopitalNom + '<br>' : ''}
            <strong style="color: #4CAF50;">📏 Distance:</strong> <span style="color: #4CAF50; font-weight: bold; font-size: 14px;">${samu.distance.toFixed(2)} km</span>
          </div>
        </div>
      `);
      this.nearestSamusMarkers.push(marker);
    });
    
    const bounds = this.L.latLngBounds([[this.userLocation.lat, this.userLocation.lng], ...this.nearestSamus.map(s => [s.latitude, s.longitude])]);
    this.map.fitBounds(bounds, { padding: [50, 50] });
    
    alert('🚑 Les 4 SAMU les plus proches trouvés');
  }
}
