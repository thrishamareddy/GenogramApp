
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { format } from 'd3';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private childId: number | null = null;
 private name:string |null=null;
  constructor(private http: HttpClient) {}

  private baseUrl = 'https://localhost:7263/api/Home';
  getChildDetails(Id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${Id}`);
  }
  updateChild(child:User|null): Observable<any> {
    debugger;
    return this.http.post(`${this.baseUrl}/EditChild`,child);
  }
  setChildId(id: number): void {
    this.childId = id;
  }

  getChildId(): number | null {
    return this.childId;
  }
  setChildName(name:string){
    this.name=name;
  }
  getChildName(){
    return this.name;
  }
}
