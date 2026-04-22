import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AgentHospitaliseService } from '../../services/agent-hospitalise.service';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    this.agentService.getAllAgents().subscribe({
      next: (data) => {
        this.agents = data;
        this.filteredAgents = data;
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
