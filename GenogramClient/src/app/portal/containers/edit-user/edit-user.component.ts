import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../core/material/material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field'
@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports:[MatInputModule, FormsModule, MatFormFieldModule,MatInputModule,MatNativeDateModule,MatDatepickerModule,MaterialModule,ReactiveFormsModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
  providers: [
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}
 ]
})
export class EditUserComponent {

    editForm: FormGroup;   
profileImage: any;
    constructor(
      private toastr:ToastrService,
      private dialogRef: MatDialogRef<EditUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder
    ) {
      debugger;
      this.editForm = this.fb.group({
        id:[data.user.id],
        name: [data.user.name, Validators.required],
        address: [data.user.address, Validators.required],
        nationality: [data.user.nationality],
        language: [data.user.language],
        dateOfBirth: [data.user.dateOfBirth|| ''],
        imagePath:[data.user.imagePath||'']
      });
      if (data.user.imagePath) {
        this.profileImage = data.user.imagePath;  
      }
    }
  
    onSave(): void {
      debugger

      if (this.editForm.valid) {
        
        this.dialogRef.close(this.editForm.value);
        this.toastr.success("User updated successfully.");
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
          debugger
          this.profileImage = reader.result as string; 
          this.editForm.patchValue({ imagePath: this.profileImage }); 
        };
        reader.readAsDataURL(file); 
      }
    }
  }
