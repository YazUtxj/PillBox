import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Bottle3dComponent } from '../../components/bottles/bottle3d/bottle3d.component';
import { MatCardModule} from '@angular/material/card'
import { MatListModule } from '@angular/material/list'
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Bottle3dWhiteComponent } from '../../components/bottles/bottle3d-white/bottle3d-white.component';
import { Bottle3dBlackComponent } from '../../components/bottles/bottle3d-black/bottle3d-black.component';
import { Bottle3dBlueWhiteComponent } from '../../components/bottles/bottle3d-blue-white/bottle3d-blue-white.component';
import { Bottle3dWhiteBlueComponent } from '../../components/bottles/bottle3d-white-blue/bottle3d-white-blue.component';
import { MatTableModule } from '@angular/material/table'
import { MatDividerModule } from '@angular/material/divider';
import gsap from 'gsap';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [
    MatIconModule, 
    MatToolbarModule, 
    Bottle3dComponent, 
    MatCardModule, 
    MatListModule, 
    CommonModule, 
    MatButtonModule,  
    Bottle3dWhiteComponent, 
    Bottle3dBlackComponent, 
    Bottle3dBlueWhiteComponent, 
    Bottle3dWhiteBlueComponent,
    MatTableModule,
    MatDividerModule, 
    RouterModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  displayedColumns: string[] = ['feature', 'pillbox', 'competitors'];
  comparisonData = [
    {
      feature: 'Dispensación Automática',
      pillbox: true,
      pillboxText: 'Sistema integrado',
      competitors: false,
      competitorsText: 'Solo recordatorios'
    },
    {
      feature: 'Monitoreo en Tiempo Real',
      pillbox: true,
      pillboxText: 'Plataforma web y móvil',
      competitors: false,
      competitorsText: 'Solo local'
    },
    {
      feature: 'Alertas Múltiples',
      pillbox: true,
      pillboxText: 'Sonoras, visuales y push',
      competitors: false,
      competitorsText: 'Máximo 2 tipos'
    }
  ];

  features = [
    {
      title: 'Configuración Personalizada',
      description: 'Programa horarios específicos para cada medicamento vía app'
    },
    {
      title: 'Alertas Inteligentes',
      description: 'Notificaciones en 3 niveles: sonoras, luminosas y móviles'
    },
    {
      title: 'Dispensación Controlada',
      description: 'Sistema mecánico seguro que libera solo la dosis requerida'
    },
    {
      title: 'Sincronización en la Nube',
      description: 'Registro automático y acceso desde cualquier dispositivo'
    }
  ];

  bottles = ['default', 'white', 'black', 'blue-white', 'white-blue'];

  @ViewChildren('bottleEl') bottleElements!: QueryList<ElementRef>;

  onMouseOver(index: number) {
    gsap.to(this.bottleElements.toArray()[index].nativeElement, {
      scale: 1.3,
      duration: 0.3,
      ease: 'power1.out'
    });
  }

  onMouseLeave(index: number) {
    gsap.to(this.bottleElements.toArray()[index].nativeElement, {
      scale: 1,
      duration: 0.3,
      ease: 'power1.in'
    });
  }
}