import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgentHospitaliseService } from '../../services/agent-hospitalise.service';
import { HopitalService } from '../../services/hopital.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agent-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './agent-details.component.html',
  styleUrl: './agent-details.component.css'
})
export class AgentDetailsComponent implements OnInit {
  agentId: number | null = null;
  loading: boolean = true;
  editMode: boolean = false;
  hopitals: any[] = [];

  agentForm = new FormGroup({
    matricule: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', Validators.required),
    hopital: new FormControl(null, Validators.required),
    hopitalNom: new FormControl(''),
    poste: new FormControl(''),
    departement: new FormControl('')
  });

  constructor(
    private agentService: AgentHospitaliseService,
    private hopitalService: HopitalService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadHopitals();
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.agentId = +id;
        this.loadAgentDetails(this.agentId);
      }
    } else {
      this.loading = false;
    }
  }

  loadHopitals(): void {
    this.hopitalService.getAllHopitalsNoPagination().subscribe({
      next: (data) => {
        this.hopitals = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des hôpitaux', err);
      }
    });
  }

  loadAgentDetails(id: number): void {
    this.agentService.getAgentById(id).subscribe({
      next: (data) => {
        this.agentForm.patchValue({
          ...data,
          hopitalNom: data.hopital?.nom || ''
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails', err);
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des détails', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  compareHopitals(h1: any, h2: any): boolean {
    return h1 && h2 ? h1.id === h2.id : h1 === h2;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode && this.agentId) {
      this.loadAgentDetails(this.agentId);
    }
  }

  onSubmit(): void {
    if (this.agentForm.valid && this.agentId) {
      const formData = {
        ...this.agentForm.value,
        fullName: `${this.agentForm.value.firstName} ${this.agentForm.value.lastName}`
      };

      this.agentService.updateAgent(this.agentId, formData).subscribe({
        next: (res) => {
          this.snackBar.open('Agent modifié avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.editMode = false;
          this.loadAgentDetails(this.agentId!);
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la modification ❌', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/home/agent-list']);
  }
}
