import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'rssfeeder';

  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  constructor(
    private http: HttpClient
  ) {

  }
  public listRss: any;
  public listContent: any;
  ngOnInit(): void {
    this.http.get('http://localhost:9000/getdata/rsscontent').subscribe(
      data => {
        this.listRss = data;
      }
    );
  }

  onClickRssList(link: any) {
    this.listContent = null;
    this.http.get('http://localhost:9000/getdata/content?url=' + link).subscribe(
      listLinkContent => {
        this.listContent = listLinkContent;
      }
    );
  }

  onClickContent(link: any) {
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = null;
    this.http.get('http://localhost:9000/getdata/post?url=' + link).pipe(
      pluck('content')
    ).subscribe(
      (content: string) => {
        contentEl.innerHTML = content;
      }
    );
  }

  onTakeImage() {
    html2canvas(document.getElementById('content'), { allowTaint: true, useCORS: true }).then(canvas => {
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/jpg');
      this.downloadLink.nativeElement.download = 'image.jpg';
      this.downloadLink.nativeElement.click();
    });
  }

  onClickWebPage(type: string) {
    this.listRss = null;
    switch (type) {
      case 'VnExpress':
        this.http.get('http://localhost:9000/getdata/rsscontent?page=vnexpress').subscribe(
          data => {
            this.listRss = data;
          }
        );
        break;
      case 'Dantri':
        this.http.get('http://localhost:9000/getdata/rsscontent?page=dantri').subscribe(
          data => {
            this.listRss = data;
          }
        );
        break;
      default: { }
    }
  }
}