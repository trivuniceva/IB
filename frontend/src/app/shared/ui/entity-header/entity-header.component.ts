import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-entity-header',
  imports: [],
  templateUrl: './entity-header.component.html',
  styleUrl: './entity-header.component.scss'
})
export class EntityHeaderComponent {
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() imageUrl: string = '';

}
