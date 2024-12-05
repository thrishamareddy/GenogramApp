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
  childId: any;
  isDisabled: boolean = true;

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
    private route: ActivatedRoute
  ) {
    const childIdParam = this.route.snapshot.paramMap.get('childId');
    this.childId = childIdParam ? +childIdParam : null;
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
    const contactId = this.getIdByName(contact);
    this.guardianService.deleteGuardian(contactId).subscribe({
      next: () => {
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

  editGuardian(contact: any): void {
    this.openAddGuardianDialog(contact);
  }

  openAddGuardianDialog(guardian: any): void {
    const dialogRef = this.dialog.open(AddGuardianComponent, {
      data: { guardian, guardians: this.guardians, childId: this.childId },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== false) {
        this.guardianService.addOrUpdateGuardian(result.id, result).subscribe((data) => {
          if (data.isPrimaryContact) {
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
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
          this.toastr.success(data.id ? 'Relation Updated successfully' : 'Relation Created successfully');
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
      icon: guardian.isPrimaryContact
        ? 'primary.png'
        : 'user.svg',
      rank: 'second',
    }));
  
    this.guardians.sort((a, b) => {
      const priorityOrder: { [key: string]: number } = {
        mother: 1,
        sister: 2,
        brother: 3,
        father: 4,
      };
      const priorityA = priorityOrder[a.relationship.toLowerCase()] || 99;
      const priorityB = priorityOrder[b.relationship.toLowerCase()] || 99;
  
      return priorityA - priorityB;
    });
  
    const childId = this.childService.getChildId()?.toString();
    const childName = this.childService.getChildName();
  
    if (childId && childName) {
      const isChildNodePresent = nodes.some(node => node.id === childId);
      if (!isChildNodePresent) {
        nodes.push({
          id: childId,
          label: childName,
          dimension: {
            width: this.calculateTextWidth(childName) + padding,
            height: 30,
          },
          icon: 'user.svg',
          rank: `level-${childId}`,
        });
      }
    } else {
      console.warn('Child not found in the system.');
    }
  
    const links = this.getLinksForGenogram(childId);
  
    const dialogRef = this.dialog.open(GenogramComponent, {
      panelClass: 'custom-dialog-container',
      width: '80vw',
      height: '80vh',
      data: {
        nodes: nodes,
        links: links,
        childName: childName,
        relationships: this.guardians, 
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Genogram dialog closed with result:', result);
      }
    });
  }
  
  
  getLinksForGenogram(childId: any): any[] {
    const links: any[] = [];
    const existingLinks = new Set<string>();
    const guardians = this.guardians.filter(g =>
      ['father', 'mother', 'brother', 'sister', 'grandmother', 'grandfather', 'guardian'].includes(
        g.relationship.toLowerCase()
      )
    );
  
    guardians.forEach(guardian => {
      const guardianId = guardian.id.toString();
      const isAbove = ['grandfather', 'grandmother', 'guardian'].includes(guardian.relationship.toLowerCase());
      const sourceId = isAbove ? guardianId : childId;
      const targetId = isAbove ? childId : guardianId;
  
      links.push({
        id: `link-${guardianId}-${childId}`,
        source: sourceId,
        target: targetId,
        label: guardian.isPrimaryContact
          ? `${guardian.relationship} (P)`
          : guardian.relationship || 'Relation',
        reverseArrow: isAbove,
        primary: guardian.isPrimaryContact,
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
          label,
        });
      }
    };
  
    const parents = this.guardians.filter(g =>
      ['mother', 'father'].includes(g.relationship.toLowerCase())
    );
    const siblings = this.guardians.filter(g =>
      ['sister', 'brother'].includes(g.relationship.toLowerCase())
    );
  
    siblings.forEach(sibling => {
      const siblingId = sibling.id.toString();
      parents.forEach(parent => {
        createLink(siblingId, parent.id.toString(), parent.relationship);
      });
    });
  
    return links;
  }
  
  
  
  getIdByName(relationship: Guardian): number | null {
    const found = this.guardians.find(
      g =>
        g.firstName === relationship.firstName &&
        g.lastName === relationship.lastName &&
        g.relationship === relationship.relationship &&
        g.phone === relationship.phone &&
        g.email === relationship.email
    );
    return found ? found.id : null;
  }

  calculateTextWidth(text: string): number {
    return text.length * 9;
  }
}
