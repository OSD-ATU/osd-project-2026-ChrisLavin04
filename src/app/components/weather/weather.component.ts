import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface WeatherDay {
  date: string;
  temp: number;
  code: number;
  description: string;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  weather: WeatherDay[] = [];
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Open-Meteo Weather API to find Weather in Ireland (lat: 53.3498, lon: -6.2603)
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=53.3498&longitude=-6.2603&daily=temperature_2m_max,weathercode&timezone=auto&past_days=5&forecast_days=5';
    this.http.get<any>(url).subscribe({
      next: (data) => {
        const days: WeatherDay[] = [];
        const dates = data.daily.time;
        const temps = data.daily.temperature_2m_max;
        const codes = data.daily.weathercode;
            for (let i = 0; i < dates.length; i++) {
              days.push({
                date: dates[i],
                temp: temps[i],
                code: codes[i],
                description: this.getDescription(codes[i])
              });
            }
        // Sort by date ascending (earliest first)
        days.sort((b,a ) => a.date.localeCompare(b.date));
        this.weather = days;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load weather data.';
        this.loading = false;
      }
    });
  }

  getDateLabel(dateStr: string): string {
    const today = new Date();
    const d = new Date(dateStr);
    // Calculate difference in days to label "Today" and "Tomorrow"
    today.setHours(0,0,0,0);
    d.setHours(0,0,0,0);
    const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 0) return `${dateStr} (Today)`;
    if (diff === 1) return `${dateStr} (Tomorrow)`;
    return dateStr;
  }
  // Map Open-Meteo weather codes to descriptions
  getDescription(code: number): string {
    if (code === 0) return 'Clear';
    else if (code === 1 || code === 2 || code === 3) return 'Cloudy';
    else if ((code >= 45 && code <= 48)) return 'Fog';
    else if ((code >= 51 && code <= 67)) return 'Drizzle/Rain';
    else if ((code >= 71 && code <= 77)) return 'Snow';
    else if ((code >= 80 && code <= 82)) return 'Rain Showers';
    else if ((code >= 95 && code <= 99)) return 'Thunderstorm';
    else return 'Other';
  }
}
