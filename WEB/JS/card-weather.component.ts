import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-weather.component.html',
  styleUrls: ['./card-weather.component.css'] 
})
export class CardWeatherComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  private intervalId: any;

  @ViewChild('sun') sun!: ElementRef;
  @ViewChild('moon') moon!: ElementRef;
  @ViewChild('sunshine') sunshine!: ElementRef;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        const now = new Date();

        this.ngZone.run(() => {
          this.currentDate = now;
          this.updateCelestialBodies(now);
        });
      }, 1000);
    });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private updateCelestialBodies(now: Date) {
    const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const progress = totalSeconds / 86400;

    const sunAngle = progress * 360;
    const moonAngle = (sunAngle + 180) % 360;
    const radius = 80;

    this.updatePosition(this.sun.nativeElement, sunAngle, radius);
    this.updatePosition(this.moon.nativeElement, moonAngle, radius);

    const isDay = sunAngle > 90 && sunAngle < 270;
    this.sun.nativeElement.style.opacity = isDay ? '1' : '0';
    this.sunshine.nativeElement.style.opacity = isDay ? '0.4' : '0';
    this.moon.nativeElement.style.opacity = isDay ? '0' : '1';
  }

  private updatePosition(element: HTMLElement, angle: number, radius: number) {
    const rad = angle * (Math.PI / 180);
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    element.style.transform = `translate(${x}px, ${y}px)`;
  }
}
