import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-wrapper',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './user-wrapper.component.html',
  styleUrl: './user-wrapper.component.css'
})
export class UserWrapperComponent {

}
