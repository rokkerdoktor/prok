import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import * as $ from 'jquery';
import {CurrentUser} from 'common/auth/current-user';
import {Title} from '../../../../models/title';
import {MESSAGES} from '../../../../toast-messages';
import {Observable,BehaviorSubject} from 'rxjs';
import {TitleState} from '../../state/title-state';
import {Select, Store} from '@ngxs/store';
import { encodeUriFragment } from '@angular/router/src/url_tree';
import {Toast} from '../../../../../common/core/ui/toast.service';
@Component({
  selector: 'title-linksubmit-panel',
  templateUrl: './title-linksubmit-panel.component.html',
  styleUrls: ['./title-linksubmit-panel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleLinksubmitPanelComponent implements OnInit {
  @Select(TitleState.title) title$: Observable<Title>;
  constructor(
    private toast: Toast,
    private store: Store,
    public currentUser: CurrentUser
  ) { }

  ngOnInit() {
    const title = this.store.selectSnapshot(TitleState.title);

    $(function() {
      $(document).ready(function(){  

     
        var i=1;  
        $('#add').click(function(){  
             i++;  
             if(title.is_series==false){
              $('#dynamic_field').append('<tr id="row'+i+'">                                         <td><input type="text" name="link[]" placeholder="Link" class="form-control name_list" /></td>                                           <td><select class="form-control name_list"  name="hang[]">                                      <option>Magyar</option> 									<option>Angol</option>                                     <option>Angol ,magyar felirat</option>                                                        <option>Egyéb, magyar felirat</option>                                     <option>Egyéb</option>                                 </select></td>        <td ><select  class="form-control name_list" name="minoseg[]">                                   <option >Mozis</option>   <option >TV Felvétel</option>   <option >DVD Minőség</option>   <option >DVD Minőség (mozis hanggal)</option>   <option >R5/TS</option>   <option >R5</option>   <option>HD RIP</option> <option>BDRip</option>                              </select></td>                                                                          <td><button type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">X</button></td></tr>');  
       
             }else{
              $('#dynamic_field').append('<tr id="row'+i+'">                                         <td><input type="text" name="link[]" placeholder="Link" class="form-control name_list" /></td>                                           <td><select class="form-control name_list"  name="hang[]">                                      <option>Magyar</option> 									<option>Angol</option>                                     <option>Angol ,magyar felirat</option>                                                        <option>Egyéb, magyar felirat</option>                                     <option>Egyéb</option>                                 </select></td>        <td  ><input type="text" name="evad[]" placeholder="Évad" maxlength="3" class="form-control name_list" /></td><td ><input type="text" name="episode[]" placeholder="Epizód" maxlength="3" class="form-control name_list" /></td>                                               <td><button type="button" name="remove" id="'+i+'" class="btn btn-danger btn_remove">X</button></td></tr>');  
       
             }
 });  
        $(document).on('click', '.btn_remove', function(){  
             var button_id = $(this).attr("id");   
             $('#row'+button_id+'').remove();  
        });  
        $('#submit').click(function(){            
             $.ajax({  
                  url:"linkdb.php",  
                  method:"POST",  
                  data:$('#add_name').serialize(),  
                  success:function(data)  
                  {  
                  $("#add_name").slideToggle();  
                   alert(data);
                  }  
             });  
        });  
   });  
   });
  }

  public showid(){
    const title = this.store.selectSnapshot(TitleState.title);
    return title.id;
  }
  public showapproved(){
    if(this.currentUser.hasPermission("titles.update")){
      return 1;
    }else{
      return 0;
    }
  }
}
