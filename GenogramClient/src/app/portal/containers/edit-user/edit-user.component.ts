import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MaterialModule } from '../../../core/material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    MaterialModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS }
  ]
})
export class EditUserComponent {
  editForm: FormGroup;
  profileImage: string | null = null;
  isEditMode: boolean;

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.isEditMode = !!data?.user;

    this.editForm = this.fb.group({
      id: [data?.user?.id || null],
      name: [data?.user?.name || '', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      address: [data?.user?.address || '', Validators.required],
      nationality: [data?.user?.nationality || '', Validators.required],
      language: [data?.user?.language || '', Validators.required],
      dateOfBirth: [data?.user?.dateOfBirth || '', Validators.required],
      imagePath: [data?.user?.imagePath || 'public/noImage.jpg']
    });

    if (this.isEditMode && data?.user?.imagePath) {
      this.profileImage = data.user.imagePath;
    }
  }

  onSave(): void {
    if (this.editForm.valid) {
      const action = this.isEditMode ? 'updated' : 'added';
      this.dialogRef.close(this.editForm.value);
      this.toastr.success(`User ${action} successfully.`);
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.editForm.patchValue({ imagePath: this.profileImage });
      };
      reader.readAsDataURL(file);
    }
  }
}
