import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChildService } from '../../../core/services/child.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import {  MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

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
    MatCardModule,
    MatPaginator
    ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  children: any[] = [];
  dataSource = new MatTableDataSource<any>([]); 
  tableView :any;
  displayedColumns: string[] = ['name', 'address', 'language', 'nationality', 'dateOfBirth', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  constructor(
    private toastr: ToastrService,
    private childService: ChildService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadChildren(); 
  }

  loadChildren(): void {
    this.childService.getAllChild().subscribe({
      next: (data) => {
        this.children = data.$values;
        this.dataSource.data = this.children; 
      },
      error: (err) => {
        console.error('Error fetching children:', err);
        alert('Failed to fetch children. Please try again later.');
      },
    });
  }

  toggleView(): void {
    this.tableView = !this.tableView;
  }

  
  navigateToChild(childId:number):void{
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
        this.childService.addChild(result).subscribe({
          next: (data) => {
            this.children.push(data); 
            this.dataSource.data = this.children; 
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          },
          error: (err) => {
            console.error('Error adding child:', err);
            this.toastr.error("Failed to add child. Please try again.");
          }
        });
      }
    });
  }

  Delete(child: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#006a6a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.childService.Delete(child).subscribe({
          next: () => {
            this.toastr.success('Child Deleted Successfully');
            this.children = this.children.filter((c) => c.id !== child.id);
            this.dataSource.data = this.children;
          },
          error: (err) => {
            console.error('Error deleting child:', err);
            this.toastr.error('Failed to delete child. Please try again.');
          }
        });
      } else {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your child record is safe :)',
          icon: 'error',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#006a6a' 
        });
      }
    });
  }
  
}