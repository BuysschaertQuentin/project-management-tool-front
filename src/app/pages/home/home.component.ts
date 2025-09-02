import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.models';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public usersList = signal<User[]>([]);
  constructor(
    private readonly userService: UserService,
    private readonly router: Router
  ) {}

  public testApi() {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.usersList.set(users);
        console.log(users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  public navigateToAnotherPage() {
    this.router.navigate(['/another-page']);
  } 
}
