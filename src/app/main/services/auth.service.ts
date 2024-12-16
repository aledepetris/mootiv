import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticated: boolean = false;

    // Método para iniciar sesión
    login(username: string, password: string): boolean {
        if (username === 'admin' && password === '123456789admin') {
            this.isAuthenticated = true;
            localStorage.setItem('isLoggedIn', 'true'); // Persistencia
            return true;
        }
        return false;
    }

    // Método para cerrar sesión
    logout(): void {
        this.isAuthenticated = false;
        localStorage.removeItem('isLoggedIn');
    }

    // Método para verificar si el usuario está autenticado
    isLoggedIn(): boolean {
        return this.isAuthenticated || localStorage.getItem('isLoggedIn') === 'true';
    }
}
