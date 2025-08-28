import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidoService, Partido } from './services/partido.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly titulo = signal('Marcador de Baloncesto');

  // Puntuaciones
  puntuacionLocal = signal(0);
  puntuacionVisitante = signal(0);

  // Nombres de equipos
  equipoLocal = signal('Local');
  equipoVisitante = signal('Visitante');

  // Período (Cuarto)
  periodo = signal(1);
  maximosPeriodos = 4;

  // Tiempo (en segundos)
  tiempo = signal(600); // 10 minutos
  estaCorriendo = signal(false);
  private intervaloId: any;

  // Faltas
  faltasLocal = signal(0);
  faltasVisitante = signal(0);
  maximasFaltas = 5;

  // Tiempos muertos
  tiemposMuertosLocal = signal(7);
  tiemposMuertosVisitante = signal(7);

  // Estado del partido
  private partidoId: number | null = null;
  partidoIniciado = signal(false);
  guardando = signal(false);
  mensajeEstado = signal('');

  constructor(private partidoService: PartidoService) { }

  ngOnDestroy() {
    this.detenerTemporizador();
  }
  guardarEstadoPartido(estadoPersonalizado?: 'EN_CURSO' | 'FINALIZADO', tiempoComoString: boolean = false) {
    // Preparar los datos del partido - Convertir todo a strings para evitar problemas de tipos
    const partidoData: any = {
      equipoLocal: this.equipoLocal(),
      equipoVisitante: this.equipoVisitante(),
      puntuacionLocal: this.puntuacionLocal().toString(),
      puntuacionVisitante: this.puntuacionVisitante().toString(),
      periodo: this.periodo().toString(),
      tiempoRestante: this.formatearTiempo(this.tiempo()),
      faltasLocal: this.faltasLocal().toString(),
      faltasVisitante: this.faltasVisitante().toString(),
      tiemposMuertosLocal: this.tiemposMuertosLocal().toString(),
      tiemposMuertosVisitante: this.tiemposMuertosVisitante().toString(),
      estado: estadoPersonalizado || 'EN_CURSO',
      fechaCreacion: new Date().toISOString(),
      fechaFinalizacion: estadoPersonalizado === 'FINALIZADO' ? new Date().toISOString() : null
    };

    // Mostrar estado de guardado
    this.guardando.set(true);
    this.mensajeEstado.set('Guardando partido...');

    // Llamar al servicio crearPartido
    this.partidoService.crearPartido(partidoData).subscribe({
      next: (resultado) => {
        if (resultado.resultado === 'EXITO') {
          this.partidoId = resultado.partido.id || null;
          this.partidoIniciado.set(true);
          this.mensajeEstado.set('Partido guardado exitosamente');
        } else {
          this.mensajeEstado.set(`Error: ${resultado.mensaje || 'Error desconocido'}`);
        }
        this.guardando.set(false);
      },
      error: (error) => {
        console.error('Error al guardar el partido:', error);
        console.error('Datos enviados:', partidoData);
        this.mensajeEstado.set('Error al guardar el partido');
        this.guardando.set(false);
      }
    });
  }

  // Métodos para actualizar puntuaciones
  agregarPuntos(equipo: 'local' | 'visitante', puntos: number) {
    if (equipo === 'local') {
      this.puntuacionLocal.update(puntuacion => puntuacion + puntos);
    } else {
      this.puntuacionVisitante.update(puntuacion => puntuacion + puntos);
    }
    // No guardar automáticamente, solo cuando se presione pausa o reiniciar
  }

  restarPuntos(equipo: 'local' | 'visitante', puntos: number) {
    if (equipo === 'local') {
      this.puntuacionLocal.update(puntuacion => Math.max(0, puntuacion - puntos));
    } else {
      this.puntuacionVisitante.update(puntuacion => Math.max(0, puntuacion - puntos));
    }
    // No guardar automáticamente, solo cuando se presione pausa o reiniciar
  }

  // Controles del temporizador
  iniciarTemporizador() {
    if (!this.estaCorriendo() && this.tiempo() > 0) {
      this.estaCorriendo.set(true);
      this.intervaloId = setInterval(() => {
        this.tiempo.update(t => {
          if (t <= 1) {
            this.detenerTemporizador();
            this.siguientePeriodo();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  }

  pausarTemporizador() {
    this.detenerTemporizador();
    // Guardar estado cuando se pausa (estado EN_CURSO, tiempo como número)
    this.guardarEstadoPartido('EN_CURSO', false);
  }

  reiniciarTemporizador() {
    this.detenerTemporizador();
    this.tiempo.set(600);
    // No guardar automáticamente, solo cuando se presione pausa o reiniciar partido
  }

  private detenerTemporizador() {
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
      this.intervaloId = null;
    }
    this.estaCorriendo.set(false);
  }

  // Controles de período
  siguientePeriodo() {
    if (this.periodo() < this.maximosPeriodos) {
      this.periodo.update(p => p + 1);
      this.reiniciarTemporizador();
      // No necesitamos guardar aquí porque reiniciarTemporizador() ya lo hace
    }
  }

  periodoAnterior() {
    if (this.periodo() > 1) {
      this.periodo.update(p => p - 1);
      this.reiniciarTemporizador();
      // No necesitamos guardar aquí porque reiniciarTemporizador() ya lo hace
    }
  }

  // Faltas
  agregarFalta(equipo: 'local' | 'visitante') {
    if (equipo === 'local' && this.faltasLocal() < this.maximasFaltas) {
      this.faltasLocal.update(f => f + 1);
    } else if (equipo === 'visitante' && this.faltasVisitante() < this.maximasFaltas) {
      this.faltasVisitante.update(f => f + 1);
    }
    // No guardar automáticamente, solo cuando se presione pausa o reiniciar
  }

  restarFalta(equipo: 'local' | 'visitante') {
    if (equipo === 'local' && this.faltasLocal() > 0) {
      this.faltasLocal.update(f => f - 1);
    } else if (equipo === 'visitante' && this.faltasVisitante() > 0) {
      this.faltasVisitante.update(f => f - 1);
    }
    // No guardar automáticamente, solo cuando se presione pausa o reiniciar
  }

  // Tiempos muertos
  usarTiempoMuerto(equipo: 'local' | 'visitante') {
    if (equipo === 'local' && this.tiemposMuertosLocal() > 0) {
      this.tiemposMuertosLocal.update(t => t - 1);
    } else if (equipo === 'visitante' && this.tiemposMuertosVisitante() > 0) {
      this.tiemposMuertosVisitante.update(t => t - 1);
    }
    // No guardar automáticamente, solo cuando se presione pausa o reiniciar
  }

  // Reiniciar puntuaciones
  reiniciarMarcador() {
    // Capturar datos actuales ANTES de resetear
    const datosActuales = {
      equipoLocal: this.equipoLocal(),
      equipoVisitante: this.equipoVisitante(),
      puntuacionLocal: this.puntuacionLocal(),
      puntuacionVisitante: this.puntuacionVisitante(),
      periodo: this.periodo(),
      tiempoRestante: this.formatearTiempo(this.tiempo()),
      faltasLocal: this.faltasLocal(),
      faltasVisitante: this.faltasVisitante(),
      tiemposMuertosLocal: this.tiemposMuertosLocal(),
      tiemposMuertosVisitante: this.tiemposMuertosVisitante(),
      estado: 'FINALIZADO' as const
    };

    // Mostrar estado de guardado
    this.guardando.set(true);
    this.mensajeEstado.set('Finalizando partido actual...');

    // Enviar datos actuales a la API con estado FINALIZADO
    this.partidoService.crearPartido(datosActuales).subscribe({
      next: (resultado) => {
        if (resultado.resultado === 'EXITO') {
          this.mensajeEstado.set('Partido finalizado guardado exitosamente');
        } else {
          this.mensajeEstado.set(`Error al finalizar: ${resultado.mensaje || 'Error desconocido'}`);
        }
        this.guardando.set(false);

        // Resetear información después de guardar (o intentar guardar)
        this.resetearInformacion();
      },
      error: (error) => {
        console.error('Error al finalizar el partido:', error);
        this.mensajeEstado.set('Error al finalizar el partido');
        this.guardando.set(false);

        // Resetear información incluso si falla el guardado
        this.resetearInformacion();
      }
    });
  }

  // Método auxiliar para resetear toda la información
  private resetearInformacion() {
    this.puntuacionLocal.set(0);
    this.puntuacionVisitante.set(0);
    this.periodo.set(1);
    this.tiempo.set(600);
    this.faltasLocal.set(0);
    this.faltasVisitante.set(0);
    this.tiemposMuertosLocal.set(7);
    this.tiemposMuertosVisitante.set(7);
    this.detenerTemporizador();
    this.partidoId = null;
    this.partidoIniciado.set(false);
  }

  // Formatear tiempo como MM:SS
  formatearTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  }

  // Obtener nombre del período
  obtenerNombrePeriodo(): string {
    const numeroPeriodo = this.periodo();
    if (numeroPeriodo <= 4) {
      return `${numeroPeriodo}º Cuarto`;
    } else {
      return `Prórroga ${numeroPeriodo - 4}`;
    }
  }
}
