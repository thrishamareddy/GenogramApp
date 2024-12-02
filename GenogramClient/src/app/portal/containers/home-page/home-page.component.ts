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
    MatTableModule
    ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})

export class HomePageComponent implements OnInit {
  children: any[] = [];
  tableView = false; 
  displayedColumns: string[] = ['name', 'address','language','nationality', 'actions'];

  constructor(private childService: ChildService, private router: Router) {}

  ngOnInit(): void {
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
    console.log('Add child functionality here.');
  }
}
