import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { catchError, delay, fromEvent, of, pairwise, switchMap, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Chart from 'chart.js/auto';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-drawing',
  templateUrl: 'drawing.component.html',
  styleUrls: ['./drawing.component.css'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ opacity: 0 }),
            animate('1s ease-out', 
                    style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ opacity: 1 }),
            animate('0.4s ease-in', 
                    style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class DrawingComponent {

  constructor(private http: HttpClient) { }

  @ViewChild('canvas') public canvas: ElementRef | undefined;

  @Input() public width = 28 * 7;
  @Input() public height = 28 * 7;

  public predicting: boolean = false;
  private cx: CanvasRenderingContext2D | undefined;
  private pixels = new Array(28);
  public digit: number[] = [];
  public prediction: number[] = [];
  public chart: any;

  public ngAfterViewInit() {

    const canvasEl: HTMLCanvasElement = this.canvas?.nativeElement;

    this.cx = canvasEl.getContext('2d')!;
    const dpi = window.devicePixelRatio;
    this.cx.scale(dpi, dpi);
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    canvasEl.style.width = "196";
    canvasEl.style.height = "196";

    if (!this.cx) throw 'Cannot get context';

    this.cx.lineWidth = 7;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = 'rgb(255, 255, 255)';

    this.init_pixels();

    this.captureEvents(canvasEl);
    this.captureTouchEvents(canvasEl);

    this.createChart()

    console.log(this.digit);

  }


  private init_pixels() {
    for (var i = 0; i < this.pixels.length; i++) {
      this.pixels[i] = new Array(this.pixels.length);
      for (var j = 0; j < this.pixels.length; j++) {
        this.pixels[i][j] = 0;
      }
    }
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap(e => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove').pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(canvasEl, 'mouseup')),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, 'mouseleave')),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            // takeUntil(of(this.predicting==false)),
            pairwise()
          );
        })
      )
      .subscribe((res) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevMouseEvent = res[0] as MouseEvent;
        const currMouseEvent = res[1] as MouseEvent;

        // previous and current position with the offset
        const prevPos = {
          x: prevMouseEvent.clientX - rect.left,
          y: prevMouseEvent.clientY - rect.top
        };

        const currentPos = {
          x: currMouseEvent.clientX - rect.left,
          y: currMouseEvent.clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private captureTouchEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap(e => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'touchmove').pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(canvasEl, 'touchend')),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, 'touchcancel')),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            // takeUntil(of(this.predicting==false)),
            pairwise()
          );
        })
      )
      .subscribe((res) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevTouchEvent = res[0] as TouchEvent;
        const currTouchEvent = res[1] as TouchEvent;

        // previous and current position with the offset
        const prevPos = {
          x: prevTouchEvent.touches[0].clientX - rect.left,
          y: prevTouchEvent.touches[0].clientY - rect.top,
        };
        
        const currentPos = {
          x: currTouchEvent.touches[0].clientX - rect.left,
          y: currTouchEvent.touches[0].clientY - rect.top
        };


        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  fill_pixels(x: number, y: number) {
    // console.log('hola', x)
      this.pixels[Math.round(y / 7)][Math.round(x / 7)] = 1;
      this.digit = []
      for (var i = 0; i < this.pixels.length; i++) {
        for (var j = 0; j < this.pixels.length; j++) {
          this.digit.push(this.pixels[i][j]);
        }
      };
  }

  private drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number }
  ) {

    console.log('prev: ', prevPos)
    console.log('curr: ', currentPos)

    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.moveTo(currentPos.x, currentPos.y); // from
      this.cx.lineTo(prevPos.x, prevPos.y);
      this.cx.stroke();
    }
    // console.log('x: ' + Math.floor(currentPos.x / 8) + '\n' + 'y: ' + Math.floor(currentPos.y / 8))
    this.fill_pixels(currentPos.x, currentPos.y)
    // this.pixels[Math.round(currentPos.y / 9)][Math.round(currentPos.x / 9)] = 1;
    // this.digit = []
    // for (var i = 0; i < this.pixels.length; i++) {
    //   for (var j = 0; j < this.pixels.length; j++) {
    //     this.digit.push(this.pixels[i][j]);
    //   }
    // };
  }
  makePrediction() {
    this.predicting = true
    this.prediction = [];
    console.log(this.digit);
    const headers = new Headers();
    const data = JSON.stringify({'pixels': this.digit })
    this.http.post<number[]>('https://mnist-api-830cf7012d80.herokuapp.com/predict', data, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }).pipe(delay(1)).pipe(
      catchError(() => {
        this.predicting = false;
        return of()
      })
    ).subscribe(async (res: any) => {
      this.prediction = res.result as number[]
      this.predicting = false
      this.updateChart()
      // this.createChart()
    })
  };


  clear() {
    this.cx?.clearRect(1, 1, 28 * 7, 28 * 7);
    this.cx?.closePath();
    this.init_pixels()
    this.digit = []
    this.prediction = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.predicting = false
    this.updateChart()
  };

  updateChart() {
    this.chart.data.datasets[0].data = this.prediction
    this.chart.update();
    this.predicting = false
    console.log(this.chart.data)
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [
          {
            label: "Prediction",
            data: this.prediction,
            backgroundColor: 'rgb(214, 89, 5)'
          }
        ]
      },
      options: {
        aspectRatio: 1.1,
        responsive: true,
      }

    });
    this.chart.canvas.parentNode.style.width = '300px';
  };

}
