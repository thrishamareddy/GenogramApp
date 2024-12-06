import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs'
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { GuardianTableComponent } from '../guardian-table/guardian-table.component';
import { User } from '../../../core/models/user';
import { Guardian } from '../../../core/models/guardian';
import { ChildService } from '../../../core/services/child.service';
import { GuardianService } from '../../../core/services/guardian.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
@Component({
  selector: 'app-profile-container',
  standalone: true,
  imports: [CommonModule, MatTabsModule, UserProfileComponent, GuardianTableComponent, HeaderComponent],
  templateUrl:'./profile-container.component.html',
  styleUrl: './profile-container.component.scss'
})

export class ProfileContainerComponent implements OnInit {

  user:User|null=null;
  guardians: Guardian[]=[] ;
  selectedTabIndex = 2;
  constructor(private route:ActivatedRoute, private childService: ChildService, private guardianService:GuardianService) {}
  
  fetchChildDetails(): void {
    const childId = this.route.snapshot.paramMap.get('childId')|| '1';
    const Id = parseInt(childId, 10); 
    this.childService.setChildId(Id);
    this.childService.getChildDetails(Id).subscribe({
      next: (data) => {
        this.user = data;
        this.guardians=data.guardians.$values;
        this.childService.setChildName(data.name);
      },
      error: (err) => {
        console.error('Failed to fetch child details:', err);
      }
      
    });
  }
  ngOnInit() {
    this.fetchChildDetails();
  }
}

