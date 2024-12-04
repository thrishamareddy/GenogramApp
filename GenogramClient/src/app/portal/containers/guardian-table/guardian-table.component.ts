import { Component, Input, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Guardian } from '../../../core/models/guardian';
import { AddGuardianComponent } from '../add-guardian/add-guardian.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { GenogramComponent } from '../genogram/genogram.component';
import { MatMenuModule } from '@angular/material/menu';
import { GuardianService } from '../../../core/services/guardian.service';
import { RemarksDialogComponent } from '../remarks-dialog/remarks-dialog.component';
import { Edge } from '@swimlane/ngx-graph';
import { ChildService } from '../../../core/services/child.service';
import { ToastrService } from 'ngx-toastr';
import { NameOf } from '../../../core/utilities/NameOf';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-guardian-table',
  standalone: true,
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule, 
    ReactiveFormsModule, 
    CommonModule,
    MatMenuModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './guardian-table.component.html',
  styleUrls: ['./guardian-table.component.scss']
})
export class GuardianTableComponent {
  @Input() guardians: Guardian[] = [];
  childId:any;
  nodes:any[]=[];
  links:any[]=[];
  isDisabled:Boolean=true;
  displayedColumns: string[] = NameOf.those<Guardian>([
    'actions',
    'firstName',
    'lastName',
    'relationship',
    'phone',
    'email',
    'isPrimaryContact',
    'remarks',
  ]);
  constructor(
    private toastr: ToastrService,
    private childService: ChildService,
    private dialog: MatDialog,
    private guardianService: GuardianService,
    private route:ActivatedRoute
  ) {  
    const childIdParam = this.route.snapshot.paramMap.get('childId');
    if (childIdParam !== null) {
      this.childId = +childIdParam||1;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['guardians']) {
      this.checkDisabledState();
      
    }
  }

  checkDisabledState(): void {
    const childId = this.childService.getChildId();
    this.isDisabled = !(this.guardians.length > 0 && childId);
  }
  showRemarks(remarks: string): void {
    this.dialog.open(RemarksDialogComponent, {
      data: { remarks },
      width: '400px'
    });
  }
  deleteGuardian(contact: Guardian): void {
    const contactId=this.getIdByName(contact);
    this.guardianService.deleteGuardian(contactId).subscribe({
      next: (response: any) => {
        this.guardians = this.guardians.filter(g => g.id !== contactId); 
        this.toastr.success("Relation deleted successfully."); 
        this.checkDisabledState();
      },
      error: (err) => {
        console.error("Error deleting guardian:", err);
        this.toastr.error(err?.error?.message || "Failed to delete guardian. Please try again.");
      }
    });
  }
  editGuardian(contact:any) {
    this.openAddGuardianDialog(contact);
  }
  openAddGuardianDialog(guardian1:any): void {
    console.log(guardian1);
    const dialogRef = this.dialog.open(AddGuardianComponent, {
      data: { guardian: guardian1,guardians:this.guardians,childId:this.childId },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      if (result !== false) {
        this.guardianService.addOrUpdateGuardian(result.id, result).subscribe((data) => {
          if (data.isPrimaryContact === true) {
            this.guardians = this.guardians.map((guardian) => ({
              ...guardian,
              isPrimaryContact: false
            }));
          }
          if (result.id) {
            this.guardians = this.guardians.map((guardian) =>
              guardian.id === data.id ? { ...guardian, ...data } : guardian
            );
          } else {
            this.guardians = [...this.guardians, { ...data }];
          }
          if (data.id) {
            this.toastr.success('Relation Updated successfully');
          } else {
            this.toastr.success('Relation Created successfully');
            setTimeout(() => {
              location.reload(); 
            }, 2000);
          }
          
        });
      }
    });
    
  }
  
  viewGenogram(): void {
    
    const padding = 30; 
    const nodes = this.guardians.map(guardian => ({
      id: guardian.id.toString(),
      label: `${guardian.firstName} ${guardian.lastName}`,
      dimension: {
        width: this.calculateTextWidth(`${guardian.firstName} ${guardian.lastName}`) + padding,
        height: 30,
      },
      icon:'user.svg'
    }));
  
    const childId = this.childService.getChildId()?.toString();
    const childName = this.childService.getChildName();
    
    if (childId&&childName) {
      const isChildNodePresent = nodes.some(node => node.id === childId);
      if (!isChildNodePresent) {
        nodes.push({
          id: childId,
          label: childName,
          dimension: {
            width: this.calculateTextWidth(childName) + padding,
            height: 30,
          },
          icon:'user.svg'
        });
      }
    } else {
      console.warn('Child not found in the system.');
    }
  
    const links = this.getLinksForGenogram();
  
    const dialogRef = this.dialog.open(GenogramComponent, {
      panelClass: 'custom-dialog-container',
      width: '80vw',
      height: '80vh', 
      data: {
        nodes: nodes,
        links: links,
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Genogram dialog closed with result:', result);
      }
    });
  }
  
  getLinksForGenogram(): Edge[] {
    const links: Edge[] = [];
    const childId = this.childService.getChildId()?.toString();
    if (!childId) {
      console.warn('No child ID found. Please ensure a valid child ID is available.');
      return links;
    }
    const guardians = this.guardians.filter((g) => g.relationship === 'Father' || g.relationship === 'Mother' || g.relationship === 'Brother' || g.relationship === 'Sister' || g.relationship === 'Grandmother' || g.relationship === 'Grandfather' || g.relationship === 'Guardian');
    guardians.forEach(guardian => {
      links.push({
        id: `link-${guardian.id}-${childId}`,
        target: guardian.id.toString(),
        source: childId,
        label: guardian.relationship
      });
    });
    const createLink = (sourceId: string, targetId: string, label: string) => {
      const linkKey = [sourceId, targetId].sort().join('-');
      if (!existingLinks.has(linkKey)) {
        existingLinks.add(linkKey);
        links.push({
          id: `link-${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          label
        });
      }
    };
    const parents = this.guardians.filter(g => g.relationship === 'Mother' || g.relationship === 'Father');
    const siblings = this.guardians.filter(g => g.relationship === 'Sister' || g.relationship === 'Brother');
    const existingLinks = new Set<string>();
    siblings.forEach(sibling => {
      parents.forEach(parent => {
        createLink(sibling.id.toString(), parent.id.toString(), parent.relationship);
      });
    });
    return links;
  }
  getIdByName(relationship: Guardian): number|null  {
    const foundRelationship = this.guardians.find(
      rel =>
        rel.firstName === relationship.firstName &&
        rel.lastName === relationship.lastName &&
        rel.relationship === relationship.relationship &&
        rel.phone === relationship.phone &&
        rel.email === relationship.email
    );
    return foundRelationship ? foundRelationship.id : null;
  }
  calculateTextWidth(text: string ): number {
    const labelWidth=text.length*9;
    return labelWidth;
  
   }
}
