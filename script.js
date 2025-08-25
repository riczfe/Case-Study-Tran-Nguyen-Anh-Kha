function Product(id, name, price, image){
    // gán các thuộc tính cơ bản cho đối tượng
    this.id = id;                         // mã sản phẩm (chuỗi duy nhất)
    this.name = name;                     // tên sản phẩm
    this.price = Number(price);           // đơn giá (đổi sang số để đảm bảo tính toán)
    this.image = image || "";             // link ảnh (nếu thiếu thì để rỗng)
}

// Lớp CartItem: 1 dòng trong giỏ hàng (gồm sản phẩm + số lượng)
function CartItem(product, qty){
    this.product = product;               // tham chiếu đến đối tượng Product
    this.qty = Number(qty || 1);          // số lượng; mặc định 1 nếu không truyền
    // phương thức tính thành tiền cho dòng này
    this.subtotal = function(){
        return this.product.price * this.qty; // đơn giá * số lượng
    }
}

// ===== Dữ liệu mẫu (có hình ảnh) =====
// Mảng products là "catalog" – danh sách sản phẩm có sẵn để hiển thị
const products = [
    new Product("p1","Táo Mỹ Fuji", 35500, "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=1200&auto=format&fit=crop"),
    new Product("p2","Cam Úc", 42000, "https://farmers.org.au/wp-content/uploads/2021/04/White-Post-Note-Card-13.jpg"),
    new Product("p3","Chuối Laba", 18000, "https://www.goodprice.vn/files/imgdetail/49f1820ec3aa9b8e48eed98d28f7af0c.jpg"),
    new Product("p4","Cà rốt Đà Lạt", 16000, "https://images-handler.kamereo.vn/eyJidWNrZXQiOiJpbWFnZS1oYW5kbGVyLXByb2QiLCJrZXkiOiJzdXBwbGllci82NTQvUFJPRFVDVF9JTUFHRS9kOGEyNjYxOC02NjI5LTQ3OTItOWVhNS1kODZhYjdiOTAxZjIucG5nIiwiZWRpdHMiOnsicmVzaXplIjp7IndpZHRoIjo1MDAsImhlaWdodCI6NTAwLCJmaXQiOiJmaWxsIn19fQ=="),
    new Product("p5","Gạo ST25 (1kg)", 28000, "https://cdn-imgproxy-prod.arobid.com/arobid/image/20250213080809_h3.png"),
    new Product("p6","Sữa tươi 1L", 31000, "https://www.theealinggrocer.com/cdn/shop/products/IMG_3531_1200x.jpg?v=1638343431")
];

// Giỏ hàng là 1 mảng các CartItem
let cart = []; // ví dụ: [ CartItem(Product p1, 2), CartItem(Product p2, 1) ]

// ===== Helper DOM =====
// Hàm rút gọn lấy element theo id (viết ngắn gọn cho tiện)
const $ = (id) => document.getElementById(id);

// Hàm định dạng số tiền theo VND (ví dụ: 35500 -> 35.500 ₫)
const formatVND = (n) => new Intl.NumberFormat(
    'vi-VN',
    { style:'currency', currency:'VND', maximumFractionDigits:0 }
).format(n);

// ===== Catalog =====
// Vẽ danh sách sản phẩm ra giao diện (grid card)
function renderCatalog(list){
    // nếu không truyền danh sách lọc thì dùng toàn bộ products
    const data = list || products;
    let html = "";

    // duyệt từng sản phẩm để tạo thẻ HTML
    for(let i = 0; i < data.length; i++){
        const p = data[i];
        html += `
        <article class="card">
          <img src="${p.image}" alt="${p.name}" />
          <div class="pad">
            <h4>${p.name}</h4>
            <div class="price">${formatVND(p.price)}</div>
            <div class="row">
              <!-- ô nhập số lượng, id gắn theo mã sản phẩm để dễ lấy -->
              <input id="qty_${p.id}" type="number" min="1" value="1" aria-label="Số lượng">
              <!-- nút thêm vào giỏ gọi addToCart với id sản phẩm -->
              <button class="btn primary" onclick="addToCart('${p.id}')">Thêm vào giỏ</button>
            </div>
          </div>
        </article>`;
    }

    // nếu danh sách rỗng thì hiện thông báo, ngược lại gán html tạo ra
    $("catalog").innerHTML = html || `<p>Không tìm thấy sản phẩm phù hợp.</p>`;
}

// Tìm 1 sản phẩm trong catalog theo id (trả về Product hoặc null)
function findProductById(id){
    return products.find(p => p.id === id) || null;
}

// ===== Cart =====
// Tìm vị trí (index) của 1 CartItem trong giỏ theo productId
function findCartIndexByProductId(id){
    return cart.findIndex(ci => ci.product.id === id);
}

// Thêm sản phẩm vào giỏ (Create trong CRUD của giỏ hàng)
function addToCart(productId){
    // 1) tìm product; nếu không có thì thôi
    const p = findProductById(productId);
    if(!p) return;

    // 2) lấy số lượng từ ô input tương ứng (vd: qty_p1)
    const qtyInput = $("qty_" + productId);
    let qty = Number(qtyInput ? qtyInput.value : 1);

    // 3) validate số lượng: phải là số hữu hạn và > 0
    if (!Number.isFinite(qty) || qty <= 0){
        alert("Số lượng không hợp lệ");
        return;
    }

    // 4) nếu sp đã có trong giỏ thì cộng dồn; nếu chưa có thì push dòng mới
    const idx = findCartIndexByProductId(productId);
    if (idx >= 0) {
        cart[idx].qty += qty;             // Update
    } else {
        cart.push(new CartItem(p, qty));   // Create
    }

    // 5) vẽ lại giỏ để UI cập nhật
    renderCart();
}

// Tăng/giảm số lượng (Update trong CRUD)
function increaseQty(index){
    cart[index].qty++;    // tăng 1
    renderCart();         // vẽ lại bảng giỏ
}

function decreaseQty(index){
    cart[index].qty--;    // giảm 1
    // nếu số lượng <= 0 thì xóa mục đó khỏi giỏ (Delete)
    if (cart[index].qty <= 0){
        cart.splice(index, 1);
    }
    renderCart();
}

// Xóa hẳn 1 dòng khỏi giỏ (Delete)
function removeCartItem(index){
    cart.splice(index, 1); // xóa 1 phần tử tại vị trí index
    renderCart();
}

// Xóa toàn bộ giỏ (Delete all) – có confirm để tránh bấm nhầm
function clearCart(){
    if (confirm("Xoá toàn bộ giỏ hàng?")){
        cart = [];        // đặt lại mảng giỏ hàng rỗng
        renderCart();     // vẽ lại
    }
}

// Tính tổng tiền của cả giỏ (Read tính toán)
function calcTotal(){
    // reduce cộng dồn subtotal của từng dòng
    return cart.reduce((s, it) => s + it.subtotal(), 0);
}

// Vẽ bảng giỏ hàng (Read + phản ánh Update/Delete)
function renderCart(){
    let rows = "";

    // duyệt giỏ để tạo các dòng <tr> hiển thị
    for(let i = 0; i < cart.length; i++){
        const it = cart[i];
        rows += `
          <tr>
            <td>${i + 1}</td>                                   <!-- số thứ tự -->
            <td>${it.product.name}</td>                         <!-- tên sp -->
            <td class="right">${formatVND(it.product.price)}</td><!-- đơn giá -->
            <td class="center">
              <!-- nút giảm / tăng SL: gọi decreaseQty/increaseQty theo index -->
              <button class="btn small danger" aria-label="Giảm" onclick="decreaseQty(${i})">-</button>
              ${it.qty}
              <button class="btn small" aria-label="Tăng" onclick="increaseQty(${i})">+</button>
            </td>
            <td class="right">${formatVND(it.subtotal())}</td>  <!-- thành tiền -->
            <td><button class="btn small" onclick="removeCartItem(${i})">Xoá</button></td>
          </tr>`;
    }

    // đổ HTML vào tbody
    $("cartBody").innerHTML = rows;

    // cập nhật tổng tiền và 2 badge đếm số mặt hàng
    const total = calcTotal();
    $("cartTotal").textContent = formatVND(total);     // tổng tiền
    $("cartCount").textContent = String(cart.length);  // badge trên header
    $("cartCountBottom").textContent = String(cart.length); // badge dưới panel
}

// ===== Search (Beginner friendly) =====
// Lấy input tìm kiếm
const searchInput = $("searchInput");

// Lắng nghe sự kiện gõ phím: lọc theo tên sản phẩm (không phân biệt hoa thường)
searchInput.addEventListener('input', function(){
    const q = this.value.trim().toLowerCase();
    if (!q) return renderCatalog(); // rỗng -> hiện toàn bộ
    // lọc: tên sp chứa chuỗi q
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    renderCatalog(filtered);
});

// Nút xóa ô tìm kiếm (reset về toàn bộ catalog)
function clearSearch(){
    searchInput.value = '';
    renderCatalog();
}

// ===== Boot =====
// Khi trang vừa tải xong: vẽ catalog + vẽ giỏ hàng (trạng thái ban đầu)
renderCatalog();
renderCart();
