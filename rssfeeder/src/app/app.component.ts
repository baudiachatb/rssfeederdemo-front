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
  private page: string;
  public link: string;
  public path: string;
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

  onClickRssList(link: any, tieude: string) {
    this.path = tieude;
    this.listContent = null;
    this.http.get(`http://localhost:9000/getdata/content?page=${this.page}&&url=` + link).subscribe(
      listLinkContent => {
        this.listContent = listLinkContent;
      }
    );
  }

  onClickContent(link: any) {
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = null;
    this.http.get(`http://localhost:9000/getdata/post?page=${this.page}&&url=` + link).pipe(
      pluck('content')
    ).subscribe(
      (content: string) => {
        console.log(content);
        content.replace(/Dân trí/gmu,'');
        contentEl.innerHTML = (content + `<div class="link" style = "position: absolute;right: 2px; font-size: 0.8em; color: f666666;
         text-decoration: underline;">${this.link} ${this.path}`);
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
    this.path = null;
    switch (type) {
      case 'VnExpress':
        this.page = 'vnexpress';
        this.link = 'VnExpress.net //';
        this.http.get('http://localhost:9000/getdata/rsscontent?page=vnexpress').subscribe(
          data => {
            this.listRss = data;
          }
        );
        break;
      case 'Dantri':
        this.link = 'Dantri.com.vn //';
        this.page = 'dantri';
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
