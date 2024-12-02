import { Component, Input } from '@angular/core';
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
  
  templateUrl: './guardian-table.component.html',
  styleUrls: ['./guardian-table.component.scss']
})
export class GuardianTableComponent {
  @Input() guardians: Guardian[] = [];
  childId:any;
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
      },
      error: (err) => {
        console.error("Error deleting guardian:", err);
        this.toastr.error(err?.error?.message || "Failed to delete guardian. Please try again.");
      }
    });
  }

  editGuardian(contact:any) {
    debugger
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
          // If the new guardian is marked as primary, reset all primary contact flags
          if (data.isPrimaryContact === true) {
            this.guardians = this.guardians.map((guardian) => ({
              ...guardian,
              isPrimaryContact: false
            }));
          }
    
          // If updating an existing guardian, update the guardian's data
          if (result.id) {
            this.guardians = this.guardians.map((guardian) =>
              guardian.id === data.id ? { ...guardian, ...data } : guardian
            );
          } else {
            // If adding a new guardian, add to the array
            this.guardians = [...this.guardians, { ...data }];
          }
    
          if (data.id) {
            this.toastr.success('Relation Updated successfully');
          } else {
            this.toastr.success('Relation Created successfully');
          }
          setTimeout(() => {
            location.reload(); 
          }, 2000);
        });
      }
    });
    
    
    
  }
  
  viewGenogram() {
    const nodes = this.guardians.map(g => ({
      id: g.id.toString(),
      label: `${g.firstName} ${g.lastName}`
    }));
    const childId = this.childService.getChildId()?.toString();
    const name = this.childService.getChildName();
    if (childId) {
      if (!nodes.some(node => node.id === childId)) {
        nodes.push({
          id: childId,
          label: `${name}`
        });
      }
    } else {
      console.warn('Child not found');
    }
    const links = this.getLinksForGenogram();
    console.log('Nodes:', nodes);
    console.log('Links:', links);
    const dialogRef = this.dialog.open(GenogramComponent, {
      width: '600px',
      height: '600px',
      data: {
        nodes: nodes,
        links: links
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
}
