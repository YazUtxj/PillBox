import { Component } from '@angular/core';
import { PillComponent } from "../../pill/pill.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottle',
  imports: [PillComponent, CommonModule],
  templateUrl: './bottle.component.html',
  styleUrl: './bottle.component.css'
})
export class BottleComponent {
  waterLevel: number = 50;
  waves = [1, 2, 3]; // Para las 3 ondas

  getWaveState(index: number) {
      return {
          'empty': this.waterLevel === 0,
          'low': this.waterLevel > 0 && this.waterLevel <= 25,
          'medium': this.waterLevel > 25 && this.waterLevel <= 75,
          'high': this.waterLevel > 75 && this.waterLevel < 100,
          'full': this.waterLevel === 100
      };
  }

  getWaveSpeed(index: number) {
      const baseSpeeds = ['50s', '45s', '40s'];
      if(this.waterLevel === 100) return '1s';
      return `${parseInt(baseSpeeds[index]) - (this.waterLevel * 0.3)}s`;
  }

  // Métodos para cambiar el nivel
  updateLevel(newLevel: number) {
      this.waterLevel = Math.min(Math.max(newLevel, 0), 100);
  }
  increaseLevel() {
    this.waterLevel = Math.min(this.waterLevel + 10, 100);
  }
  
  decreaseLevel() {
    this.waterLevel = Math.max(this.waterLevel - 10, 0);
  }

  // Array que contiene las píldoras, inicializado con 4 elementos (puede ser vacio si quieres comenzar sin ninguno)
  containers: any[] = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  // Agregar una píldora si no se supera el límite de 4
  addContainer() {
    if (this.containers.length < 4) {
      const newContainer = { id: this.generateId() };
      this.containers.push(newContainer);
    } else {
      console.log('Máximo de 4 contenedores alcanzado');
    }
  }

  // Eliminar una píldora según su id
  removeContainer(id: number) {
    this.containers = this.containers.filter(container => container.id !== id);
  }

  // Método para generar un id único (puedes ajustar la lógica según tu necesidad)
  private generateId(): number {
    return this.containers.length ? Math.max(...this.containers.map(p => p.id)) + 1 : 1;
  }
}
