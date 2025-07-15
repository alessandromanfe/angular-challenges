import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { CardType } from '../../model/card.model';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'app-card',
  template: `
    <div
      class="flex w-fit flex-col gap-3 rounded-md border-2 border-black p-4"
      [class]="customClass()">
      <!--
      @if (type() === CardType.TEACHER) {
        <img ngSrc="assets/img/teacher.png" width="200" height="200" />
      }
      @if (type() === CardType.STUDENT) {
        <img ngSrc="assets/img/student.webp" width="200" height="200" />
      }
      -->

      <img ngSrc="{{ imagePath() }}" width="200" height="200" />

      <section>
        @for (item of list(); track item) {
          <app-list-item
            [name]="item.firstName ? item.firstName : item.name"
            [id]="item.id"
            [type]="type()"
            (deleteItem)="deleteItem($event)"></app-list-item>
        }
      </section>

      <button
        class="rounded-sm border border-blue-500 bg-blue-300 p-2"
        (click)="addNewItem()">
        Add
      </button>
    </div>
  `,
  imports: [ListItemComponent, NgOptimizedImage, NgTemplateOutlet],
})
export class CardComponent {
  //private teacherStore = inject(TeacherStore);
  //private studentStore = inject(StudentStore);
  addItem = output<void>();
  delete = output<number>();
  //storeType = input();
  //cardType = input.required<CardType>();
  //private cardStore = inject(this.storeType);
  imagePath = input.required<string>();

  readonly list = input<any[] | null>(null);
  readonly type = input.required<CardType>();
  readonly customClass = input('');

  CardType = CardType;

  addNewItem() {
    this.addItem.emit();
    /*
    if (type === CardType.TEACHER) {
      this.teacherStore.addOne(randTeacher());
    } else if (type === CardType.STUDENT) {
      this.studentStore.addOne(randStudent());
    }
    */
  }
  deleteItem(id: number) {
    this.delete.emit(id);
  }
}
