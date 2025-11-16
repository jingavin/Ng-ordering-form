import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

type Fruit = 'Apples' | 'Peaches' | 'Pears' | 'Plums';

interface LineItem {
  name: Fruit;
  qty: number;
  unitPrice: number;
  amount: number;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  firstName = '';
  lastName = '';
  street = '';
  addrSubmitted = false;
  addressOK = false;

  fruits: Fruit[] = ['Apples', 'Peaches', 'Pears', 'Plums'];
  prices: Record<Fruit, number> = {
    Apples: 1.23,
    Peaches: 1.39,
    Pears: 1.49,
    Plums: 1.19
  };

  selectedFruit: Fruit | '' = '';
  qty: number | null = null;
  addError = '';

  items: LineItem[] = [];

  submitAddress(form: NgForm) {
    this.addrSubmitted = true;
    this.addressOK = !!form.valid;
  }

  addItem() {
    this.addError = '';

    if (!this.selectedFruit) {
      this.addError = 'Please select an item from the list.';
      return;
    }
    if (!this.qty || this.qty < 1) {
      this.addError = 'Quantity is required and must be at least 1.';
      return;
    }

    const unit = this.prices[this.selectedFruit];
    const amount = unit * this.qty;

    this.items.push({
      name: this.selectedFruit,
      qty: this.qty,
      unitPrice: unit,
      amount
    });

    this.selectedFruit = '';
    this.qty = null;
  }

  remove(i: number) {
    this.items.splice(i, 1);
  }

  subtotal(): number {
    return this.items.reduce((s, it) => s + it.amount, 0);
  }
  tax(): number {
    return this.subtotal() * 0.07;
  }
  total(): number {
    return this.subtotal() + this.tax();
  }
}

