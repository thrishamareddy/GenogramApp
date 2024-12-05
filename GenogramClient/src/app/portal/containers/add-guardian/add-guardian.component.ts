import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Relationship } from '../../../core/Enums/relationship.enum';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../core/material/material.module';

@Component({
  selector: 'app-add-guardian',
  templateUrl: './add-guardian.component.html',
  styleUrls: ['./add-guardian.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class AddGuardianComponent {
  guardianForm: FormGroup;
  guardians: any[] = []; 
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  relationships = Object.values(Relationship);

  constructor(
    private toastr:ToastrService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddGuardianComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { guardian:any ,guardians:any,childId:any}
  ) {
    this.guardianForm = this.fb.group({
      id:[''],
      firstName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/),Validators.minLength(3)]],
      lastName: ['',[Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      relationship: ['', Validators.required],
      email: ['', [Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      phone: ['',[Validators.required,Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      isPrimaryContact: [false],
      remarks: [''],
      childId:['']
    });

    if (data?.guardians) {
      this.guardians = data.guardians; 
    }
    this.guardianForm.patchValue({
      id:this.data?.guardian?.id||0,
      firstName: this.data?.guardian?.firstName||'',
      lastName: this.data?.guardian?.lastName||'',
      relationship: this.data?.guardian?.relationship||'',
      email: this.data?.guardian?.email||'',
      phone: this.data?.guardian?.phone||'',
      isPrimaryContact: this.data?.guardian?.isPrimaryContact||false,
      remarks: this.data?.guardian?.remarks||'',
      childId:this.data?.guardian?.childId||+this.data.childId,
    });
  }

  getAvailableRelationships(): string[] {
    const maxCounts = {
      [Relationship.Father]: 1,
      [Relationship.Mother]: 1,
      [Relationship.Grandfather]: 2,
      [Relationship.Grandmother]: 2,
    };
  
    const currentCounts = (this.guardians || []).reduce(
      (acc: Record<string, number>, guardian) => {
        acc[guardian.relationship] = (acc[guardian.relationship] || 0) + 1;
        return acc;
      },
      {}
    );
  
    const currentRelationship = this.guardianForm.get('relationship')?.value;
  
    return this.relationships.filter((rel) => {
      const maxCount = maxCounts[rel as keyof typeof maxCounts] || Infinity;
      const currentCount = currentCounts[rel] || 0;
  
      return rel === currentRelationship || currentCount < maxCount;
    });
  }
  
  getRemainingRelationshipMessage(): string {
    const remainingRelationships = this.getAvailableRelationships();
    return `Available relationships: ${remainingRelationships.join(', ')}`;
  }
}
