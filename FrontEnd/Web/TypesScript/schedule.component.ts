import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule} from '@angular/material/datepicker'

@Component({
  selector: 'app-schedule',
  imports: [MatCardModule,  MatDatepickerModule, CommonModule ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  selected : Date = new Date()
}
