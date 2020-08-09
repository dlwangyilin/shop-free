import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    cartItems: CartItem[] = [];
    totalPrice: Subject<number> = new Subject<number>();
    totalQuantity: Subject<number> = new Subject<number>();

    constructor() {
    }

    addToCart(theCartItem: CartItem) {
// check if we already have the item in out cart
        let alreadyExistsInCart = false;
        let existingCartItem: CartItem = undefined;
        if (this.cartItems.length > 0) {
            existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id);
            alreadyExistsInCart = (existingCartItem != undefined);
        }
        if (alreadyExistsInCart) {
            existingCartItem.quantity++;
        } else {
            this.cartItems.push(theCartItem);
        }

// compute price and quantity
        this.computeCartTotals();
    }

    computeCartTotals() {
        let totalPriceValue = 0;
        let totalQuantityValue = 0;
        for (let currentCartItem of this.cartItems) {
            totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantityValue += currentCartItem.quantity;
        }
        // publish new values.
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        this.logCartData(totalPriceValue, totalQuantityValue);
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log('Contents of the cart');
        for (let tempCartItem of this.cartItems) {
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
            console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}`);
        }
        console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === theCartItem.id);
    // if found, remove the item form the array
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
