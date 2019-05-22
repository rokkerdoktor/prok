import { Component, Inject ,OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {CurrentUser} from 'common/auth/current-user';
import {Title} from '../../../../models/title';
import {Observable,BehaviorSubject} from 'rxjs';
import {TitleState} from '../../state/title-state';
import {Select, Store} from '@ngxs/store';
import {Modal} from '../../../../../common/core/ui/dialogs/modal.service';
import {ConfirmModalComponent} from '../../../../../common/core/ui/confirm-modal/confirm-modal.component';
import {Toast} from '../../../../../common/core/ui/toast.service';
import {finalize} from 'rxjs/operators';
import {MESSAGES} from '../../../../toast-messages';
import {AppHttpClient} from '../../../../../common/core/http/app-http-client.service';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import {MatDialog, MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import {FormsModule} from '@angular/forms'
import {User} from '../../../../../common/core/types/models/User';
import { DataService } from './data.service';

export interface DialogData {
  mycommenct: string;
  oldmycommenct:string;
  commentid:number;
}

@Component({
  selector: 'title-comment-panel',
  templateUrl: './title-comment-panel.component.html',
  styleUrls: ['./title-comment-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class TitleCommentPanelComponent {

  public user = new User();
  mycommenct: string;
  logincomment: string;
  public loading$ = new BehaviorSubject(false);
  @Select(TitleState.title) title$: Observable<Title>;
  @Select(TitleState.backdrop) backdropImage$: Observable<string>;
  @Select(TitleState.Comments) comments$: Observable<any[]>;
  private products  = []; 
  private productsObservable : Observable<any[]> ; 
  constructor(
              private dataService: DataService,
              public dialog: MatDialog,
              private location: Location,
              private router: Router,
              private http: AppHttpClient,
              private toast: Toast,
              private modal: Modal,
              private store: Store,
              public currentUser: CurrentUser) {
              const title = this.store.selectSnapshot(TitleState.title);
              this.productsObservable = this.dataService.getComment(title.id);
              }
              
              

  public send(userid){

    const title = this.store.selectSnapshot(TitleState.title);
    console.log(userid);
    this.store.dispatch(this.http.post('comment',
    {
      comment: this.logincomment,
      user_id:userid,
      title_id:title.id,
      season:0,
      episode:0,
    }
    )
    .subscribe(
      this.router.navigateByUrl('/titles/1', {skipLocationChange: false}).then(()=>
      this.router.navigate([this.location.path()]))
    ))
    .pipe(finalize(() => this.loading$.next(true)))
    .subscribe(() => this.toast.open(MESSAGES.COMMENT_ADD_SUCCESS));

  }     

 public szerkesztes(Comment){
  const dialogRef = this.dialog.open(DialogContentExampleDialog,{
    height: '300px',
    width: '100%',

    data: {
      commentid:Comment.id,
      oldmycommenct: Comment.comment
    }});
 }




 public torles(Comment){
  this.modal.show(ConfirmModalComponent, {
    title: 'Komment törlés',
    body:  'Biztos törölni szeretnéd ezt a hozzászólást?',
    ok:    'Törlés'
}).afterClosed().subscribe(confirmed => {
  if ( ! confirmed) return;
  this.loading$.next(true);
  this.store.dispatch(this.http.delete('comment/' + Comment.id)
  .subscribe(
    (data) =>{
      $(function() {
        $("#main-comments").load(location.href+" #main-comments>*","");
     });
    }
  ))
  .pipe(finalize(() => this.loading$.next(false)))
  .subscribe(() => this.toast.open(MESSAGES.COMMENT_REMOVE_SUCCESS));
});
 }


}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: './title-comment-panel-dialog.html',
})
export class DialogContentExampleDialog {
  private kommentem;
  private commentid;
  public loading$ = new BehaviorSubject(false);
  constructor(
    private location: Location,
    private http: AppHttpClient,
    private toast: Toast,
    private store: Store,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { 
    this.kommentem=this.data.oldmycommenct;
    this.commentid=this.data.commentid;
  }

public save(id){
  this.store.dispatch(this.http.put('comment/' + id,
  {comment: this.data.oldmycommenct}
  )
.subscribe(
this.router.navigateByUrl('/titles/1', {skipLocationChange: false}).then(()=>
this.router.navigate([this.location.path()]))
))
.pipe(finalize(() => this.loading$.next(true)))
.subscribe(() => this.toast.open(MESSAGES.COMMENT_UPDATE_SUCCESS));
}

}
