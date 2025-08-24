// ===== OOP căn bản =====
function Product(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = Number(price);
}

function CartItem(product, qty) {
    this.product = product;
    this.qty = Number(qty || 1);
    this.subtotal = function() {
        return this.product.price * this.qty;
    }
}

// ===== DỮ LIỆU =====
var products = [
    new Product("p1","Táo Mỹ",35.5),
    new Product("p2","Cam Úc",42.0),
    new Product("p3","Chuối Laba",18.0),
    new Product("p4","Cà rốt",16.0),
    new Product("p5","Gạo ST25 (1kg)",28.0),
    new Product("p6","Sữa tươi 1L",31.0)
];

var cart = []; // mảng CartItem

// ===== TIỆN ÍCH DOM =====
function $(id){ return document.getElementById(id); }

// ===== CATALOG =====
function renderCatalog(){
    var html = "";
    for (var i=0; i<products.length; i++){
        var p = products[i];
        html += "<div class='card'>"
            +    "<h4>"+ p.name +"</h4>"
            +    "<div class='price'>"+ p.price.toFixed(2) +" <span class='unit'>đ</span></div>"
            +    "<div class='row'>"
            +      "<input id='qty_"+ p.id +"' type='number' min='1' value='1'>"
            +      "<button onclick=\"addToCart('"+ p.id +"')\">Thêm vào giỏ</button>"
            +    "</div>"
            +  "</div>";
    }
    $("catalog").innerHTML = html;
}

function findProductById(id){
    for (var i=0; i<products.length; i++){
        if (products[i].id === id) return products[i];
    }
    return null;
}

// ===== CART =====
function findCartIndexByProductId(id){
    for (var i=0; i<cart.length; i++){
        if (cart[i].product.id === id) return i;
    }
    return -1;
}

function addToCart(productId){
    var p = findProductById(productId);
    if (!p) return;

    var qtyInput = $("qty_" + productId);
    var qty = Number(qtyInput ? qtyInput.value : 1);
    if (isNaN(qty) || qty <= 0) { alert("Số lượng không hợp lệ"); return; }

    var idx = findCartIndexByProductId(productId);
    if (idx >= 0) {
        cart[idx].qty = cart[idx].qty + qty;
    } else {
        cart.push(new CartItem(p, qty));
    }
    renderCart();
}

function increaseQty(index){
    cart[index].qty = cart[index].qty + 1;
    renderCart();
}

function decreaseQty(index){
    cart[index].qty = cart[index].qty - 1;
    if (cart[index].qty <= 0){
        cart.splice(index, 1);
    }
    renderCart();
}

function removeCartItem(index){
    cart.splice(index, 1);
    renderCart();
}

function clearCart(){
    if (!confirm("Xoá toàn bộ giỏ hàng?")) return;
    cart = [];
    renderCart();
}

function calcTotal(){
    var s = 0;
    for (var i=0; i<cart.length; i++){
        s = s + cart[i].subtotal();
    }
    return s;
}

function renderCart(){
    var html = "";
    for (var i=0; i<cart.length; i++){
        var it = cart[i];
        html += "<tr>"
            +   "<td>"+ (i+1) +"</td>"
            +   "<td>"+ it.product.name +"</td>"
            +   "<td class='right'>"+ it.product.price.toFixed(2) +"</td>"
            +   "<td class='center'>"
            +     "<button class='small danger' onclick='decreaseQty("+i+")'>-</button> "
            +     it.qty
            +     " <button class='small' onclick='increaseQty("+i+")'>+</button>"
            +   "</td>"
            +   "<td class='right'>"+ it.subtotal().toFixed(2) +"</td>"
            +   "<td><button class='small ghost' onclick='removeCartItem("+i+")'>Xoá</button></td>"
            + "</tr>";
    }
    $("cartBody").innerHTML = html;
    $("cartTotal").textContent = calcTotal().toFixed(2);
    $("cartCount").textContent = String(cart.length);
}

function checkout(){
    if (cart.length === 0){ alert("Giỏ đang trống."); return; }
    var total = calcTotal().toFixed(2);
    alert("Thanh toán thành công!\nTổng: " + total + " đ");
    cart = [];
    renderCart();
}

// ===== BOOT =====
renderCatalog();
renderCart();
