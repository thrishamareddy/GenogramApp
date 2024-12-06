import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Edge, NgxGraphModule, Node, Orientation } from '@swimlane/ngx-graph';
import { ChildService } from '../../../core/services/child.service';
import * as shape from 'd3-shape';  
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-genogram',
  templateUrl: './genogram.component.html',
  styleUrls: ['./genogram.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxGraphModule,MatIconModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ] 
})
export class GenogramComponent {
  constructor(
    private childService:ChildService,
    public dialogRef: MatDialogRef<GenogramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nodes: Node[]; links: Edge[] }
  ) {
    this.nodes = data.nodes; 
    this.links = data.links;
    this.name=this.childService.getChildName();
  }
  curve: any = shape.curveLinear;
  graphWidth: number = window.innerWidth;
  graphHeight: number = window.innerHeight;
  calculateNodeWidth(label: string): number {
    const baseWidth = 60;
    const labelWidth = label.length * 8; 
    return baseWidth + labelWidth;
  }
  nodes: Node[] = [];
  links: Edge[] = [];
  name:any;
  layoutConfig = {  
    orientation:'TB',
    edgePadding:10,
    rankPadding:100,
    nodePadding: 10
  };
  onNodeClick(node: any): void {
    console.log('Node clicked:', node);
  }
  
  onLinkHover(link: any): void {
    console.log('Hovered over link:', link);
  }
  
  closeGenogram() {
    this.dialogRef.close();
    }
  
}

