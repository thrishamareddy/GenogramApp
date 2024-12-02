import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-remarks-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './remarks-dialog.component.html',
  styleUrl: './remarks-dialog.component.scss'
})
export class RemarksDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { remarks: string }) {}
}
