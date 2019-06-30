import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import {Link} from '../../models/link';
import {Toast} from '../../../common/core/ui/toast.service';
import {MESSAGES} from '../../toast-messages';
import {Observable,BehaviorSubject, Subject} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common'
import {LinkService} from '../../site/shared/link.service';
@Component({
  selector: 'linkapproved',
  templateUrl: './linkapproved.component.html',
  styleUrls: ['./linkapproved.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkapprovedComponent implements OnInit {

  public links : any;

  constructor(    
    public service : LinkService,    
    private toastr : Toast,
    private location: Location,
    private route: ActivatedRoute,
    private store: Store) {
      this.links = this.service.listnotapproved();

     }

  ngOnInit() {

  }

  public server(url){
    var myarr = url.split("/");
    return myarr[2];
  }

  approved(link){
    this.service.approved(link).subscribe(res=>{
      this.toastr.open("Link elfogadva");
      });
      location.reload()
  }

  removed(linkid){
    if(confirm('Biztos törölni akarod')) {
      this.service.delete(linkid).subscribe(res=>{
        this.toastr.open("Sikeresen törölve");
        });
        location.reload()
    }
  }



}
