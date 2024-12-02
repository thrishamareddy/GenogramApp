import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Edge, NgxGraphModule, Node } from '@swimlane/ngx-graph';
import { ChildService } from '../../../core/services/child.service';
import * as shape from 'd3-shape';  
@Component({
  selector: 'app-genogram',
  templateUrl: './genogram.component.html',
  styleUrls: ['./genogram.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxGraphModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ] 
})
export class GenogramComponent {
  nodes: Node[] = [];
  links: Edge[] = [];
  width = window.innerWidth;
  height = window.innerHeight;
  name:any;
  layoutConfig = {
    rankDir: 'TB',  
    nodeSep: 50,    
    edgeSep: 50,    
    rankSep: 100,  
    marginX: 0, 
    marginY: 0,  
  };
  curve: any = shape.curveLinear;
  graphWidth: number = window.innerWidth;
  graphHeight: number = window.innerHeight;
  calculateNodeWidth(label: string): number {
    const baseWidth = 60;
    const labelWidth = label.length * 8; 
    return baseWidth + labelWidth;
  }
  
  onNodeClick(node: any): void {
    console.log('Node clicked:', node);
  }
  
  onLinkHover(link: any): void {
    console.log('Hovered over link:', link);
  }
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

