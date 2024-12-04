import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChildService } from '../../../core/services/child.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatCard } from '@angular/material/card';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatTableModule,
    MatCard
    ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  
  children: any[] = [];
  tableView = false; 
  displayedColumns: string[] = ['name', 'address','language','nationality', 'dateOfBirth','actions'];
  constructor(private toastr:ToastrService,private childService: ChildService, private router: Router,private dialog:MatDialog) {}
  ngOnInit(): void {
    debugger;
    this.childService.getAllChild().subscribe({
      next: (data) => {
        this.children = data.$values;
      },
      error: (err) => {
        console.error('Error fetching children:', err);
        alert('Failed to fetch children. Please try again later.');
      }
    });
  }

  toggleView(): void {
    this.tableView = !this.tableView;
  }

  navigateToChild(childId: number): void {
    this.router.navigate([`${childId}`]);
  }


  addChild(): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '600px', 
      data: {}
    });
    
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        result.id = 0;  
        this.childService.addChild(result).subscribe((data) => {
          this.children.push(result); 
          window.location.reload();
        });
      }
    });
  }
  
  Delete(child: any) {
    this.childService.Delete(child).subscribe((data)=>{
      this.toastr.success("Child Deleted Successfully");
    })
  }
}
