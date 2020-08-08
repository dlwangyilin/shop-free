import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../common/product";
import { ActivatedRoute } from '@angular/router';
import has = Reflect.has;
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list-grid.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    products: Product[] = [];
    currentCategoryId: number = 1;
    previousCategoryId: number = 1;
    searchMode: boolean = false;

    thePageNumber: number = 1;
    thePageSize: number = 5;
    theTotalElements: number = 0;

    previousKeyword: string = null;

    constructor(private productService: ProductService,
                private cartService: CartService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe(
            () => {
                this.listProducts();
            }
        );
    }

    listProducts() {
        this.searchMode = this.route.snapshot.paramMap.has('keyword');
        if (this.searchMode) {
            this.handleSearchProducts();
        } else {
            this.handleListProducts();
        }
    }

    handleListProducts() {
        // check if id param is available
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
        if (hasCategoryId) {
            // convert string to number
            this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
        } else {
            this.currentCategoryId = 1;
        }
        if (this.previousCategoryId != this.currentCategoryId) {
            this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;
        // get products for given category id
        this.productService
            .getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
            .subscribe(this.processResult());
    }

    handleSearchProducts() {
        const theKeyword: string = this.route.snapshot.paramMap.get('keyword');
        // reset page number
        if (this.previousKeyword != theKeyword) {
            this.thePageNumber = 1;
        }
        this.previousKeyword = theKeyword;
        this.productService
            .searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword)
            .subscribe(this.processResult());
    }

    processResult() {
        return data => {
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;  // spring starts from 0, but angular starts from 1
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
        }
    }

    updatePageSize(pageSize: number) {
        this.thePageSize = pageSize;
        this.thePageNumber = 1;
        this.listProducts();
    }

    addToCart(theProduct: Product) {
        const theCartItem = new CartItem(theProduct);
        this.cartService.addToCart(theCartItem);
    }
}
