import { Comment } from './../shared/comment';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from './../services/dish.service';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;

  formErrors = {
    author: '',
    comment: '',
  };

  validationMessages = {
    author: {
      required: 'Name is required.',
      minlength: 'Name must be at least 2 characters long.',
    },
    comment: {
      required: 'Comment is required.',
      minlength: 'Comment must be at least 2 characters long.',
    }
  };
  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.dishService.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(
      switchMap((params: Params) => this.dishService.getDish(params.id))
    ).subscribe(dish => {
      this.dish = dish;
      this.setPrevNext(dish.id);
    });
    this.createForm();
  }

  createForm(): void {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
      rating: [5, [Validators.required]],
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation messages
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && control.invalid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key];
            }
          }
        }
      }
    }
    if (form.valid) {
      const values = this.commentForm.value;
      this.comment = {
        comment: values.comment,
        author: values.author,
        rating: values.rating,
        date: new Date().toString()
      };
    } else {
      this.comment = null;
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    this.dish.comments.push(this.comment);
    this.comment = null;
    this.commentForm.reset({ rating: 5 });
  }
}
