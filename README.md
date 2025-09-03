# Case Study Tran Nguyen Anh Kha

# 🛒 Supermarket

Case study **Module 1** – xây dựng một ứng dụng siêu thị online cơ bản bằng **HTML + CSS + JavaScript**.  
Mục tiêu: rèn luyện tư duy **OOP trong JavaScript** và thực hành **CRUD** trên giỏ hàng.

---

## ✨ Tính năng chính

- **Catalog sản phẩm** hiển thị dưới dạng thẻ (card grid).
- **Tìm kiếm sản phẩm** theo tên (Search bar).
- **Giỏ hàng (Cart)** với đầy đủ CRUD:
  - Create: thêm sản phẩm mới vào giỏ
  - Read: hiển thị danh sách giỏ hàng và tổng tiền
  - Update: tăng/giảm số lượng, cộng dồn khi thêm cùng sản phẩm
  - Delete: xóa 1 dòng hoặc xóa toàn bộ giỏ
- **Tính tổng tiền** và cập nhật badge số lượng trong header/footer.
- **Responsive** cơ bản (hoạt động tốt trên mobile/desktop).

---

## 🧩 Cấu trúc dự án

index.html → giao diện chính
styles.css → style (CSS, responsive)
script.js → logic CRUD, render UI
README.md → tài liệu (file này)


---

## 🛠️ Mô hình dữ liệu (OOP)

- `Product` → đối tượng sản phẩm (id, name, price, image).
- `CartItem` → một dòng trong giỏ hàng (product + qty + subtotal).
- `products[]` → mảng catalog (tĩnh, dữ liệu mẫu).
- `cart[]` → mảng giỏ hàng (ban đầu rỗng, sẽ thay đổi theo CRUD).

---

## 🔄 CRUD Implementation

### Catalog (Product)
- **Read (R)**: `renderCatalog(list)` hiển thị toàn bộ sản phẩm hoặc kết quả tìm kiếm.
- **Search**: lọc `products[]` theo tên, gọi lại `renderCatalog(filtered)`.

> 📌 Catalog **chưa có** Create/Update/Delete vì đang dùng dữ liệu mẫu tĩnh.

### Cart (CartItem)
- **Create (C)**: `addToCart(productId)` – thêm mới sản phẩm chưa có vào `cart[]`.
- **Read (R)**: `renderCart()` – in bảng giỏ hàng, tổng tiền, badge số lượng.
- **Update (U)**:
  - `addToCart(productId)` – cộng dồn nếu sản phẩm đã có.
  - `increaseQty(index)` / `decreaseQty(index)` – tăng/giảm số lượng.
- **Delete (D)**:
  - `removeCartItem(index)` – xóa 1 dòng.
  - `clearCart()` – xóa toàn bộ giỏ (có confirm).
  - `decreaseQty(index)` – nếu qty ≤ 0 thì xóa luôn dòng đó.

---

## 📊 Luồng dữ liệu (flow)

[User Action]

↓

[CRUD Function] (addToCart, increaseQty, removeCartItem, ...)

↓ 

[Render Function] (renderCart / renderCatalog) (cập nhật mảng cart[])

↓

[HTML Updated] (#catalog, #cartBody, #cartTotal, #cartCount, ...)


---

## 💾 Bonus: Lưu giỏ hàng với localStorage

Để giỏ hàng không mất khi reload trang:

```js
// Load cart từ localStorage khi khởi động
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
renderCart();

// Hàm saveCart – gọi sau mỗi CRUD
function saveCart(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Ví dụ: trong addToCart, increaseQty, removeCartItem...
cart.push(new CartItem(p, qty));
saveCart();
renderCart();
```

📷 Screenshot (demo)
![Trang chủ](Screenshots/1.png)
![Catalog](Screenshots/2.png)
![Giỏ hàng](Screenshots/3.png)
![Responsive](Screenshots/4.png)
👨‍💻 Tác giả

Trần Nguyễn Anh Kha

Case study Module 1 – CodeGym Bootcamp
