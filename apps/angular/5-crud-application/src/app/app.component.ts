import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { randText } from '@ngneat/falso';

interface Todo {
  id: number;
  title: string;
  body: string;
  userId: number;
}

@Component({
  imports: [MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    @if (isLoading) {
      <div class="spinner-container">
        <mat-spinner class="spinner colored-spinner" />
      </div>
    }

    @for (todo of todos(); track todo.id) {
      <div class="todo-item">
        <p>{{ todo.title }}</p>
        <button (click)="update(todo)">Update</button>
        <button (click)="delete(todo)">Delete</button>
      </div>
    }
  `,
  styles: [
    `
      .spinner-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        z-index: 9999;
      }
    `,
    `
      .colored-spinner circle {
        stroke: #3fb53f !important;
      }
    `,
    `
      .mat-mdc-progress-spinner::ng-deep {
        --mdc-circular-progress-active-indicator-color: #3fb53f !important;
      }
    `,
    `
      .todo-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #ccc;
      }
    `,
    `
      .todo-item p {
        width: 100%;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  public isLoading = false;

  todos = signal<Todo[]>([]);

  ngOnInit(): void {
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe((todos) => {
        this.todos.set(todos);
      });
  }

  update(todo: Todo) {
    this.isLoading = true;
    this.http
      .put<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        JSON.stringify({
          todo: todo.id,
          title: randText(),
          body: todo.body,
          userId: todo.userId,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
      .subscribe((todoUpdated: Todo) => {
        this.todos.set(
          [
            ...this.todos().filter((t) => t.id !== todoUpdated.id),
            todoUpdated,
          ].sort((a, b) => a.id - b.id),
        );
        this.isLoading = false;
      });
  }

  delete(todo: Todo) {
    this.isLoading = true;
    this.http
      .delete(`https://jsonplaceholder.typicode.com/todos/${todo.id}`)
      .subscribe(() => {
        this.todos.set(this.todos().filter((t) => t.id !== todo.id));
        this.isLoading = false;
      });
  }
}
