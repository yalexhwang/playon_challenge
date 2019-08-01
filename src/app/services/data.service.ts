import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Game } from '../interfaces/game';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl: string = 'http://search-api.nfhsnetwork.com/search/events/upcoming?size=50&state_association_key=';
  associations: { label: string, key: string}[] = [
    { label: 'GHSA State Association', key: '18bad24aaa' },
    { label: 'Texas State Association (UIL)', key:'542bc38f95' }
  ];
  dateRange: Date[];
  private items: Game[];
  private itemsSubject: Subject<Game[]> = new Subject();
  

  constructor(
    private http: HttpClient
  ) { }

  get itemSource(): Observable<Game[]> {
    return this.itemsSubject.asObservable();
  }

  fetch(key: string): void {
    this.http.get(this.baseUrl + key).subscribe((data: any) => {
      this.items = data.items.map((item: any) => {
        return {
          key: item.key,
          headline: item.publishers[0].broadcasts[0].headline || 'TBD',
          subheadline: item.publishers[0].broadcasts[0].subheadline || 'TBsD',
          startDate: new Date(item.start_time),
        };
      })
      this.filterByDate(this.dateRange);
    });
  }

  filterByDate(dateRange: Date[]): void {
    this.dateRange = dateRange;
    if (dateRange) {
      const start: number = this.convertDate(dateRange[0]);
      const end: number = this.convertDate(dateRange[1], true);
      this.itemsSubject.next(this.items.filter((item: Game) => {
        const gameTime: number = item.startDate.getTime();
        return start <= gameTime && end > gameTime;
      }));      
    } else {
      this.itemsSubject.next(this.items);
    }
  }

  private convertDate(date: Date, isEnd?: boolean): number {
    if (date) {
      if (isEnd) {
        const oneDay: number = 1000 * 60 * 60 * 24;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() + oneDay;
      }
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    }
    return undefined;
  }
}
