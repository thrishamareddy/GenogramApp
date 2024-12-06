import { Component, Input, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Guardian } from '../../../core/models/guardian';
import { AddGuardianComponent } from '../add-guardian/add-guardian.component';
import { MatTableDataSource } from '@angular/material/table';
import { GenogramComponent } from '../genogram/genogram.component';
import { GuardianService } from '../../../core/services/guardian.service';
import { RemarksDialogComponent } from '../remarks-dialog/remarks-dialog.component';
import { ChildService } from '../../../core/services/child.service';
import { ToastrService } from 'ngx-toastr';
import { NameOf } from '../../../core/utilities/NameOf';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../core/material/material.module';

@Component({
  selector: 'app-guardian-table',
  standalone: true,
  imports: [
    MaterialModule,
    MatPaginator,
    MatSortModule
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './guardian-table.component.html',
  styleUrls: ['./guardian-table.component.scss']
})
export class GuardianTableComponent {
  @Input() guardians: Guardian[] = [];
  dataSource = new MatTableDataSource<Guardian>([]);
  childId: any;
  isDisabled: boolean = true;
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
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
    this.dataSource = new MatTableDataSource(this.guardians);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['guardians']) {
      this.dataSource.data = this.guardians;
      this.checkDisabledState();
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
        // Proceed with the delete operation if confirmed
        const contactId = this.getIdByName(contact);
        this.guardianService.deleteGuardian(contactId).subscribe({
          next: () => {
            this.guardians = this.guardians.filter(g => g.id !== contactId);
            this.dataSource.data = [...this.guardians];
            this.toastr.success("Relation deleted successfully.");
            this.checkDisabledState();
          },
          error: (err) => {
            console.error("Error deleting guardian:", err);
            this.toastr.error(err?.error?.message || "Failed to delete guardian. Please try again.");
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
        if (result.isPrimaryContact) {
          this.guardians = this.guardians.map((guardian) => ({
            ...guardian,
            isPrimaryContact: false
          }));
        }
        if (result.id) {
          this.guardians = this.guardians.map((guardian) =>
            guardian.id === result.id ? { ...guardian, ...result } : guardian
          );
        }
        this.dataSource.data=this.guardians
        this.guardianService.addOrUpdateGuardian(result.id, result).subscribe((data) => {
          
           if(!result.id) {
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
