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
  template: `
  <section class="p-4" style="max-width: 640px">
    <form #addrForm="ngForm" (ngSubmit)="submitAddress(addrForm)" novalidate>
      <div>
        <label>First Name</label><br />
        <input
          type="text"
          name="firstName"
          [(ngModel)]="firstName"
          required
          pattern="^[A-Za-z']+$"
          #firstNameCtrl="ngModel" />
        <div class="err" *ngIf="addrSubmitted && firstNameCtrl.invalid">
          <small *ngIf="firstNameCtrl.errors?.['required']">Value required.</small>
          <small *ngIf="firstNameCtrl.errors?.['pattern']">Letters and apostrophes only.</small>
        </div>
      </div>

      <div class="mt">
        <label>Last Name</label><br />
        <input
          type="text"
          name="lastName"
          [(ngModel)]="lastName"
          required
          pattern="^[A-Za-z']+$"
          #lastNameCtrl="ngModel" />
        <div class="err" *ngIf="addrSubmitted && lastNameCtrl.invalid">
          <small *ngIf="lastNameCtrl.errors?.['required']">Value required.</small>
          <small *ngIf="lastNameCtrl.errors?.['pattern']">Letters and apostrophes only.</small>
        </div>
      </div>

      <div class="mt">
        <label>Street Address</label><br />
        <input
          type="text"
          name="street"
          [(ngModel)]="street"
          required
          #streetCtrl="ngModel" />
        <div class="err" *ngIf="addrSubmitted && streetCtrl.invalid">
          <small>Street address is required.</small>
        </div>
      </div>

      <button class="mt" type="submit">Submit Address</button>
    </form>

    <p class="mt" *ngIf="addressOK">
      <span>Order for {{ firstName }} {{ lastName }} at {{ street }}.</span>
    </p>

    <hr class="mt" />

    <div class="row">
      <div>
        <label>Add Item</label><br />
        <select [(ngModel)]="selectedFruit" name="fruitSelect">
          <option value="" selected disabled>-- Select an item --</option>
          <option *ngFor="let f of fruits" [ngValue]="f">{{ f }}</option>
        </select>
      </div>

      <div class="qtyCol">
        <label>Qty</label><br />
        <input type="number" min="1" step="1"
               [(ngModel)]="qty"
               name="qtyInput" />
      </div>

      <div class="btnCol">
        <button type="button" (click)="addItem()">Add Item</button>
      </div>
    </div>

    <div class="err mt" *ngIf="addError">
      <small>{{ addError }}</small>
    </div>

    <table class="mt" *ngIf="items.length > 0" border="0" style="width:100%">
      <thead>
        <tr>
          <th style="text-align:left;">Item</th>
          <th style="text-align:right;">Qty</th>
          <th style="text-align:right;">Unit Price</th>
          <th style="text-align:right;">Amount</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let it of items; let i = index">
          <td>{{ it.name }}</td>
          <td style="text-align:right;">{{ it.qty }}</td>
          <td style="text-align:right;">{{ it.unitPrice | currency:'USD':'symbol':'1.2-2' }}</td>
          <td style="text-align:right;">{{ it.amount | currency:'USD':'symbol':'1.2-2' }}</td>
          <td><a href (click)="remove(i); $event.preventDefault()">Delete</a></td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align:right;">Subtotal</td>
          <td style="text-align:right;">{{ subtotal() | currency:'USD':'symbol':'1.2-2' }}</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="3" style="text-align:right;">Taxes 7%</td>
          <td style="text-align:right;">{{ tax() | currency:'USD':'symbol':'1.2-2' }}</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="3" style="text-align:right; font-weight:600;">Total</td>
          <td style="text-align:right; font-weight:600;">{{ total() | currency:'USD':'symbol':'1.2-2' }}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  </section>
  `,
  styles: [`
    .mt { margin-top: 12px; }
    .row { display: flex; align-items: end; gap: 12px; }
    .qtyCol { width: 120px; }
    .btnCol { }
    .err { color: #b00020; }
    button { padding: 6px 10px; }
    select, input { width: 100%; max-width: 260px; }
    th, td { padding: 4px 0; }
  `]
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

