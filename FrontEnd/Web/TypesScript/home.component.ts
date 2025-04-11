import { Component } from '@angular/core';
import { ListMedicationsComponent } from "../../components/list-medications/list-medications.component";
import { BottleComponent } from '../../components/bottles/bottle/bottle.component';

@Component({
  selector: 'app-home',
  imports: [ListMedicationsComponent, BottleComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
