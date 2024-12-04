
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  getAllChild(): Observable<any>{
    debugger
    return this.http.get(`${this.baseUrl}/ChildDetails`);
  }
  getChildDetails(Id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${Id}`);
  }
  updateChild(child:User|null): Observable<any> {
    return this.http.post(`${this.baseUrl}/EditChild`,child);
  }
  addChild(child:User|null):Observable<any>{
    return this.http.post(`${this.baseUrl}/CreateChild`,child);
  }
  Delete(child: any) {
    debugger
    const jsonChild = JSON.stringify(child); 
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: jsonChild
    };
    return this.http.delete(`${this.baseUrl}/DeleteChild`, options);
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
