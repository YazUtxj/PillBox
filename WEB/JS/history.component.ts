import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule} from '@angular/material/datepicker'
import { TableComponent } from '../../components/table/table.component';


@Component({
  selector: 'app-history',
  imports: [MatCardModule,  MatDatepickerModule, CommonModule, TableComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
    
}
