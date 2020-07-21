package com.yilin.shopfree.dao;

import com.yilin.shopfree.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
