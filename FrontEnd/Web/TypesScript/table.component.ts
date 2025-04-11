import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  displayedColumns: string[] = ['nombre', 'dosis', 'horario', 'estado', 'tomar', 'aTiempo'];
  dataSource: Medicamento[] = DATA;

  marcarComoTomado(element: Medicamento) {
    const now = new Date();
    const [horaStr, periodo] = element.horario.split(' ');
    const [horas, minutos] = horaStr.split(':').map(Number);

    let horaProgramada = new Date();
    horaProgramada.setHours(periodo === 'PM' && horas !== 12 ? horas + 12 : horas);
    horaProgramada.setMinutes(minutos);
    horaProgramada.setSeconds(0);

    const diferencia = Math.abs(now.getTime() - horaProgramada.getTime());
    const minutosDeDiferencia = diferencia / (1000 * 60);

    element.tomado = true;
    element.aTiempo = minutosDeDiferencia <= 15; // tolerancia de 15 minutos
  }
}

export interface Medicamento {
  nombre: string;
  dosis: number;
  horario: string;
  tomado?: boolean;
  aTiempo?: boolean | null;
}

const DATA: Medicamento[] = [
  { nombre: 'Paracetamol', dosis: 500, horario: '08:00 AM', tomado: false, aTiempo: null },
  { nombre: 'Ibuprofeno', dosis: 200, horario: '12:00 PM', tomado: false, aTiempo: null },
  { nombre: 'Metformina', dosis: 850, horario: '06:00 PM', tomado: false, aTiempo: null },
];
