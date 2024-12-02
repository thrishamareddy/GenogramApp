import { Component, Input } from '@angular/core';
import { ChildService } from '../../../core/services/child.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { User } from '../../../core/models/user';
import { MaterialModule } from '../../../core/material/material.module';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'], 
})
export class UserProfileComponent {
  @Input() user:User|null=null;
  constructor(private dialog: MatDialog, private childService: ChildService) {}

  openEditDialog(): void {
    debugger
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '650px',
      data: { user: this.user },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const date = new Date(result.dateOfBirth);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); 
        const day = String(date.getDate()).padStart(2, "0");
        result.dateOfBirth = `${year}-${month}-${day}`;
        this.updateUser(result); 
      }
    });
  }

  updateUser(updatedUser: any): void {
    this.childService.updateChild(updatedUser).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        alert('Failed to update user. Please try again.');
      },
    });
  }
  
}