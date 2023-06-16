import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { fromEvent, pairwise, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'HandWritten Digits Recognition';


}
