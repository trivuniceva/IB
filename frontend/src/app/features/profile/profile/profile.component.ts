import {Component, OnInit} from '@angular/core';
import {User} from '../../../core/model/user.model';
import {CommonModule, NgIf} from '@angular/common';
import {TabsComponent} from '../../../shared/ui/tabs/tabs.component';
import {EntityHeaderComponent} from '../../../shared/ui/entity-header/entity-header.component';
import {AuthService} from '../../../core/service/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    TabsComponent,
    EntityHeaderComponent,

  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  user: User | null = null;
  showEditPopup: boolean = false;

  activeTab = 'My Reports';
  tabs = ['My Reports', 'View History', 'Recommendations'];
  hideSidebar = false;

  recommendations: any[] = [];
  statCards: { label: string; value: string; period: string; risk: number }[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
  }

  onTabChange(tab: string) {
    this.activeTab = tab;
    this.hideSidebar = tab === 'View History' || tab === 'Recommendations';
  }

  closeEditPopup() {
    this.showEditPopup = false;
  }

  openEditPopup() {
    this.showEditPopup = true;
  }
}
