import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/main/services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
    email: string = '';
    password: string = '';

    constructor(private authService: AuthService, private router: Router) { }

    login(): void {
        if (this.authService.login(this.email, this.password)) {
            Swal.fire('¡Éxito!', 'Inicio de sesión correcto.', 'success');
            this.router.navigate(['/']); // Redirige al dashboard
        } else {
            Swal.fire('Error', 'Credenciales incorrectas.', 'error');
        }
    }
}
