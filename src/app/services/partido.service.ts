import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Partido {
    id?: number;
    equipoLocal: string;
    equipoVisitante: string;
    puntuacionLocal: number;
    puntuacionVisitante: number;
    periodo: number;
    tiempoRestante: number;
    faltasLocal: number;
    faltasVisitante: number;
    tiemposMuertosLocal: number;
    tiemposMuertosVisitante: number;
    estado: 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO' | 'SUSPENDIDO';
    fechaCreacion?: Date;
    fechaFinalizacion?: Date;
}

export interface ResultadoPartido {
    partido: Partido;
    resultado: 'EXITO' | 'ERROR';
    mensaje?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PartidoService {
    private apiUrl: string;

    constructor(private http: HttpClient) {
        // Configurar la URL del backend desde variables de entorno
        this.apiUrl = this.getBackendUrl();
    }

    private getBackendUrl(): string {
        // En desarrollo usar localhost, en producción usar el nombre del contenedor
        const isProduction = window.location.hostname !== 'localhost';
        return isProduction ? 'http://localhost:5260/api/scoreboard' : 'http://localhost:5260/api/scoreboard';
    }

    // Crear un nuevo partido
    crearPartido(partido: Omit<Partido, 'id' | 'fechaCreacion'> | { equipoLocal: string; equipoVisitante: string; puntuacionLocal: number; puntuacionVisitante: number; periodo: number; tiempoRestante: string | number; faltasLocal: number; faltasVisitante: number; tiemposMuertosLocal: number; tiemposMuertosVisitante: number; estado: 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO' | 'SUSPENDIDO'; }): Observable<ResultadoPartido> {
        return this.http.post<ResultadoPartido>(this.apiUrl, partido)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Ocurrió un error desconocido';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Error del lado del servidor
            errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
        }

        console.error('Error en la comunicación con el backend:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
