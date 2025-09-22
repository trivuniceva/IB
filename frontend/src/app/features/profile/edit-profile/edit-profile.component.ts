import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InputComponent} from '../../../shared/ui/input/input.component';
import {ButtonComponent} from '../../../shared/ui/button/button.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {User} from '../../../core/model/user.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    InputComponent,
    ButtonComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();

  private selectedFile: File | null = null;
  public password = '';
  public confirmPassword = '';

  closePopup() {
    this.close.emit();
  }

  onFileSelected($event: Event) {

  }

  saveProfileInfo() {

  }
}
