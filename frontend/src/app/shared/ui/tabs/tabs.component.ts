import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tabs',
  imports: [
    CommonModule,
  ],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements OnInit{
  @Input() tabs: string[] = [];
  @Output() tabChange = new EventEmitter<string>();

  @Input() activeTab: string = '';

  ngOnInit(): void {
    if (!this.activeTab && this.tabs.length > 0) {
      this.activeTab = this.tabs[0];
      this.tabChange.emit(this.activeTab);
    }
  }

  selectTab(tab: string) {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }
}
