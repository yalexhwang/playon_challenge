import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Game } from '../../interfaces/game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  games: Game[];
  assocationKey: string;
  associationOptions: any[];
  dateRange: Date[] = [];
  datePickerConfig: any = {
    containerClass: 'theme-red'
  };

  constructor(
    private dataSvc: DataService
  ) {}

  ngOnInit() {
    this.dataSvc.itemSource.subscribe((data: Game[]) => this.games = data);
    this.associationOptions = this.dataSvc.associations;
    this.assocationKey = this.associationOptions[0].key;
    this.getData(this.assocationKey);
    this.filterByDate(this.dateRange);
  }

  getData(key: string) {
    this.dataSvc.fetch(key);
  }

  filterByDate(range: Date[]) {
    this.dataSvc.filterByDate(range);
  }

}
