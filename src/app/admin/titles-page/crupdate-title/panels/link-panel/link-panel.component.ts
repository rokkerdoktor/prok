import {Link} from '../../../../../models/link';
import {Title} from '../../../../../models/title';
import { Component, OnInit } from '@angular/core';
import {Toast} from '../../../../../../common/core/ui/toast.service';
import {MESSAGES} from '../../../../../toast-messages';
import {LinkService} from '../../../../../site/shared/link.service';
import {Observable,BehaviorSubject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {LinkModalComponent} from './link-modal/link-modal.component';
import {CrupdateTitleState} from '../../state/crupdate-title-state';
import {ActivatedRoute} from '@angular/router';
import {Modal} from '../../../../../../common/core/ui/dialogs/modal.service';
import { Location } from '@angular/common';

@Component({
  selector: 'link-panel',
  templateUrl: './link-panel.component.html',
  styleUrls: ['./link-panel.component.scss']
})
export class LinkPanelComponent implements OnInit {

  @Select(CrupdateTitleState.title) title$: Observable<Title>;

  constructor(
    public service : LinkService,
    private toastr : Toast,
    private modal: Modal,
    private location: Location,
    private route: ActivatedRoute,
    private store: Store) { 
    }
public titleid:number;
interval: any;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.titleid=params.id;
    });
    this.service.refreshList(this.titleid);
  }

  public server(url){
    var myarr = url.split("/");
    return myarr[2];
  }
  public linkok(id){
    alert(id);
  }
  public linkedit(){
    alert("edit");
  }
  public OpenModal(link?: Link) {
    this.modal.open(
      LinkModalComponent,
        {link},
        {panelClass: 'crupdate-tag-modal-container'}
    ).beforeClosed().subscribe(newLink => {
      this.service.update(newLink).subscribe(res=>{
        this.service.refreshList(this.titleid);
        this.toastr.open("Sikeresen Szerkesztve");
        location.reload()
        });
    });
}


  public linkdelete(id){
    if(confirm('Biztos törölni akarod')) {
      this.service.delete(id).subscribe(res=>{
        this.toastr.open("Sikeresen törölve");
        location.reload()
        });
        this.service.refreshList(this.titleid);
    }
  }



  public addnew(){
    this.modal.open(
      LinkModalComponent,
        {panelClass: 'crupdate-tag-modal-container'}
    ).beforeClosed().subscribe(newLink => {
      console.log(newLink);
      this.service.create(newLink).subscribe(res=>{
        this.toastr.open("Link hozzáadva!");
        location.reload()
        });
    });

  }
}
