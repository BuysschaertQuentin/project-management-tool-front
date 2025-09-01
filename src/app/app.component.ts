import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { User } from '../models/user.models';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private readonly userService : UserService
  ) {}

  public testApi() {
    this.userService.getUsers().subscribe({
      next: (users: User) => {
        console.log(users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }
}
