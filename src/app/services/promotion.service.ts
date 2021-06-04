import { PROMOTIONS } from '../shared/promotions';
import { Promotion } from '../shared/promotion';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Promotion[] {
    return PROMOTIONS;
  }

  getPromotion(id: string): Promotion {
    return this.getPromotions().find((promotion) => promotion.id === id);
  }

  getFeaturedPromotion(): Promotion {
    return this.getPromotions().find((promotion) => promotion.featured);
  }
}
