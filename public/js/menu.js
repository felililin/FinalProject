const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function addToCart(productId) {
    console.log(productId)
    const product = products.find(product => {
        if (product.id == productId) {
            return true
        }
        for (index in product.children) {
            if (product.children[index].id == productId) {
                return true
            }
        }
        return false
    })

    if (product.id != productId) {
        // atc with variant
        const child = product.children.find(child => child.id == productId)
        sendAddToCartRequest(child)
    } else {
        sendAddToCartRequest(product)
    }
}

function sendAddToCartRequest(product) {
    const userData = JSON.parse(localStorage.getItem('user'))
    $.ajax({
        type: 'post',
        url: "api/cart",
        headers: {"Authorization": `jwt ${userData.token}`},
        data: {
            product_id: product.id
        }
    }).done((data) => {
        alert("Product is added to your cart.")
    })
}

let products

function renderProduct(data) {
    let html = ''
    console.log(data)
    products = data

    for (index in data) {
        const product = data[index]
        if (index % 3 == 0) {
            if (html.length > 0) {
                html += `</div></section>`
            }

            html += `<section class="container-fluid product-row">
                        <div class="row justify-content-center">`
        }

        html += `
            <div class="col-lg-4">
                <div class="row justify-content-center product-card">
                    <div class="col-lg-6 p-0">
                        <img class="img-fluid" src="${product.image_url}" alt="" />
                    </div>
                    <div class="col-lg-6 product-info">
                        <h1>${product.name}</h1>
                        <p><b>${formatter.format(product.price)}</b></p>
                        <p>${product.description}</p>`
        
        if (product.children.length == 0) {
            html += `<button class="btn-primary" onclick="addToCart(${product.id})">Buy</button>`
        } else {
            for (i in product.children) {
                const child = product.children[i]
                html += `<button class="btn-primary" onclick="addToCart(${child.id})">Buy - ${child.name}</button>`
            }
        }
                        
        html += `   </div>
                </div>
            </div>
            `
    }

    html += `</div></section>`
    $("#products").html(html)
}

$(window).ready(function () {
    $.ajax({
        url: "api/product",
    }).done(function (data) {
        renderProduct(data)
    })
});

$('#selectionAll').on('click', function () {
    $.ajax({
        url: "api/product",
    }).done(function (data) {
        renderProduct(data)
    })
});

$('#selectionDrink').on('click', function () {
    $.ajax({
        url: "api/product?category_id=1",
    }).done(function (data) {
        renderProduct(data)
    })
});

$('#selectionBean').on('click', function () {
    $.ajax({
        url: "api/product?category_id=2",
    }).done(function (data) {
        renderProduct(data)
    })
});

$('#selectionMerch').on('click', function () {
    $.ajax({
        url: "api/product?category_id=3",
    }).done(function (data) {
        renderProduct(data)
    })
});

