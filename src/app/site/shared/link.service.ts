import {Injectable} from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {Link} from '../../models/link';


@Injectable({
    providedIn: 'root'
})
export class LinkService {

    /* readonly rootURL = "http://localhost/filmgo/secure/"; */
    list : Link[];
    link: Link;
    constructor(private http: HttpClient) {}

    refreshList(id:number){
        /* this.http.get(this.rootURL+'link/'+id) */
        this.http.get('secure/link/'+id)
        .toPromise().then(res => this.list = res as Link[]);
    }

    delete(id: number) {
        /* return this.http.delete(this.rootURL+'link/'+id); */
        return this.http.delete('secure/link/'+id);
    }
    update(link: Link){
        /* return this.http.put(this.rootURL+'link/'+link.id, link); */
        return this.http.put('secure/link/'+link.id, link);
      }
      create(link: Link){
        /* return this.http.put(this.rootURL+'link/'+link.id, link); */
        return this.http.post('secure/link', link);
      }
      listnotapproved(){
        return this.http.get('secure/linklist'); 
      }
      approved(link: Link){
        return this.http.put('secure/linkapproved/'+link.id, link);
      }
}
