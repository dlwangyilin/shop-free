package com.yilin.shopfree.dao;

import com.yilin.shopfree.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Expose localhost:8010/api/products/search/findByCategoryId?id=2
    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);
}
