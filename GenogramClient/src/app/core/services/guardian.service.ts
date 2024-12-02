import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardianService {
  
  private apiUrl = 'https://localhost:7263/api/Guardian'; 
  deleteGuardian(contactId: number|null) {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${contactId}`,{});
  }
  constructor(private http: HttpClient) {}

  addOrUpdateGuardian(id:any,guardian:any): Observable<any> {
    debugger;
    const url = id
      ? `${this.apiUrl}/Guardian/${id}`
      : `${this.apiUrl}/Guardian`;
  
    return this.http.post(url, guardian, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  
}
