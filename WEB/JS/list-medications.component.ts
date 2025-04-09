import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface Container {
  id: number;
  name_container: string;
  init_time: string;
  hours: number;
  days: number;
}

@Component({
  selector: 'app-list-medications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-medications.component.html',
  styleUrls: ['./list-medications.component.css'],
})
export class ListMedicationsComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  // Usamos ambos: observable para async pipe y array local para modificaciones
  containers$!: Observable<Container[]>;
  containers: Container[] = [];
  
  user = { containers: [] as Container[] };
  showModal = false;
  selectedContainer: Container | null = null;
  days: number[] = [1, 2, 3, 4, 5, 6, 7];

  openModal(med: Container) {
    this.selectedContainer = { ...med };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedContainer = null;
  }

  saveChanges() {
    if (!this.selectedContainer) return;
    
    const index = this.containers.findIndex(c => c.id === this.selectedContainer!.id);
    if (index > -1) {
      this.containers[index] = { ...this.selectedContainer };
      this.containers$ = of([...this.containers]); // Actualizamos el observable
      this.cdr.detectChanges();
    }
    this.closeModal();
  }

  ngOnInit() {
    this.containers$ = timer(500).pipe(
      map(() => [
        { id: 1, name_container: 'Antihistamínicos', init_time: '08:00', hours: 30, days: 3 },
        { id: 2, name_container: 'Analgésicos', init_time: '12:30', hours: 60, days: 5 },
        { id: 3, name_container: 'Vitaminas', init_time: '18:00', hours: 15, days: 7 },
        { id: 4, name_container: 'Antiinflamatorios', init_time: '20:45', hours: 85, days: 2 }
      ]),
      tap(containers => {
        this.containers = containers;
        this.user.containers = containers;
        this.cdr.detectChanges();
      })
    );
  }
}