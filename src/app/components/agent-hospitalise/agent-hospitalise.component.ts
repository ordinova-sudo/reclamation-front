import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AgentHospitaliseService } from '../../services/agent-hospitalise.service';
import { HopitalService } from '../../services/hopital.service';

@Component({
  selector: 'app-agent-hospitalise',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, MatSnackBarModule],
  templateUrl: './agent-hospitalise.component.html',
  styleUrl: './agent-hospitalise.component.css'
})
export class AgentHospitaliseComponent implements OnInit {
  hopitals: any[] = [];
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private agentService: AgentHospitaliseService,
    private hopitalService: HopitalService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  agentForm = new FormGroup({
    matricule: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required),
    hopital: new FormControl(null, Validators.required),
    poste: new FormControl(''),
    departement: new FormControl('')
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.loadHopitals();
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.agentForm.valid) {
      const { confirmPassword, ...formData } = this.agentForm.value;
      const dataToSend = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`
      };

      this.agentService.createAgent(dataToSend).subscribe({
        next: (res) => {
          this.snackBar.open('Agent ajouté avec succès 🎉', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/home/agent-list']);
        },
        error: (err) => {
          this.snackBar.open("Erreur lors de l'ajout de l'agent ❌", 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      if (this.agentForm.errors?.['passwordMismatch']) {
        this.snackBar.open('Les mots de passe ne correspondent pas ❌', 'Fermer', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    }
  }
}
