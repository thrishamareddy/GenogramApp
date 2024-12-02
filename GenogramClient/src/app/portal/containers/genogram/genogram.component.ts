import { CommonModule } from '@angular/common';
import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Edge, NgxGraphModule, Node } from '@swimlane/ngx-graph';
import { ChildService } from '../../../core/services/child.service';

@Component({
  selector: 'app-genogram',
  templateUrl: './genogram.component.html',
  styleUrls: ['./genogram.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxGraphModule],
})
export class GenogramComponent {
  nodes: Node[] = [];
  links: Edge[] = [];
  width = window.innerWidth;
  height = window.innerHeight;
  name:any;
  
  onResize(event: Event): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
  
  constructor(
    private childService:ChildService,
    public dialogRef: MatDialogRef<GenogramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nodes: Node[]; links: Edge[] }
  ) {
    this.nodes = data.nodes; 
    this.links = data.links;
    this.name=this.childService.getChildName();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}

