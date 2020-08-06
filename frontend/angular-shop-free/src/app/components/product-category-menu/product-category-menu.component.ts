import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[];
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.listProductService();
  }

  listProductService() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log(data);
        this.productCategories = data;
      }
    );
  }

}
