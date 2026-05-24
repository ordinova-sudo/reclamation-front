import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AgentHospitaliseService } from '../../services/agent-hospitalise.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PAGINATION_CONFIG } from '../../config/pagination.config';

@Component({
  selector: 'app-agent-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, MatSnackBarModule],
  templateUrl: './agent-list.component.html',
  styleUrl: './agent-list.component.css'
})
export class AgentListComponent implements OnInit {
  agents: any[] = [];
  filteredAgents: any[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE;

  constructor(
    private agentService: AgentHospitaliseService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAgents();
    } else {
      this.loading = false;
    }
  }

  loadAgents(): void {
    this.agentService.getAllAgents(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        this.agents = response.content || [];
        this.filteredAgents = this.agents;
        this.totalPages = response.totalPages || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des agents', err);
        this.loading = false;
      }
    });
  }

  filterAgents(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAgents = this.agents;
    } else {
      this.filteredAgents = this.agents.filter(agent =>
        agent.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadAgents();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAgents();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAgents();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  viewAgentDetails(id: number): void {
    this.router.navigate(['/home/agent-details', id]);
  }

  createAgent(): void {
    this.router.navigate(['/home/addAgent']);
  }

  deleteAgent(event: Event, id: number, fullName: string): void {
    event.stopPropagation();
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'agent "${fullName}" ?`)) {
      this.agentService.deleteAgent(id).subscribe({
        next: () => {
          this.snackBar.open('Agent supprimé avec succès 🗑️', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.loadAgents();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          this.snackBar.open('Erreur lors de la suppression ❌', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
