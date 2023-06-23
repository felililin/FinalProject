const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

$(window).ready(function () {
    loadCart()
    loadAddress()
})

let globalAddressId = 0

const loadAddress = () => {
    const userData = JSON.parse(localStorage.getItem('user'))

    $.ajax({
        type: 'get',
        url: 'api/address',
        headers: {"Authorization": `jwt ${userData.token}`},
        success: function (response) {
            globalAddressId = response && response[0] && response[0].id
        }
    })
}

const loadCart = () => {
    const userData = JSON.parse(localStorage.getItem('user'))
    $.ajax({
        url: "api/cart",
        headers: {"Authorization": `jwt ${userData.token}`}
    }).done((data) => {
        console.log(data)
        $("#cartTotalItems").html(`${data.items.length} items`)
        $("#cartTotalAmount").html(formatter.format(data.cartTotal))
        let html = ''

        if (data.items.length == 0) {
            html = `<h4 style="text-align: center; margin-top: 16px;">Your cart is empty. Find your next favorite drink in our <a href="menu">menu</a></h4>`
        }

        for (index in data.items) {
            const item = data.items[index]

            let productName = item.name
            if (!!item.parent_name) {
                productName = `${item.parent_name} - ${productName}`
            }
            html += `<div class="row">
                        <div class="column-25">
                            <img src="${item.image_url}" alt="">
                        </div>
                        <div class="column-75">
                            <div class="column-50">
                                <h4><b>${productName}</b></h4>
                                <div class="counter">
                                    <button onclick="decreaseFromCart(${item.id})" class="btn-qty"><span style="width: 40px; text-align: center;">-</span></button>
                                    <div class="count">${item.qty}</div>
                                    <button onclick="addToCart(${item.id})" class="btn-qty"><span style="width: 40px; text-align: center;">+</span></button>
                                </div>
                            </div>
                            <div class="column-50">
                                <div class="prices">
                                    <div class="amount">${formatter.format(item.total)}</div>
                                    <div onclick="removeFromCart(${item.id})" class="remove"><u>Remove</u></div>
                                </div>
                            </div>
                        </div>
                    </div>`            
        }

        $("#cartContainer").html(html)
    })
}

function addToCart(productId) {
    const userData = JSON.parse(localStorage.getItem('user'))
    $.ajax({
        type: 'post',
        url: "api/cart",
        headers: {"Authorization": `jwt ${userData.token}`},
        data: {
            product_id: productId
        }
    }).done((data) => {
        loadCart()
    })
}

function decreaseFromCart(productId) {
    const userData = JSON.parse(localStorage.getItem('user'))
    $.ajax({
        type: 'delete',
        url: "api/cart",
        headers: {"Authorization": `jwt ${userData.token}`},
        data: {
            product_id: productId,
            remove_all: false
        }
    }).done((data) => {
        loadCart()
    })
}

function removeFromCart(productId) {
    const userData = JSON.parse(localStorage.getItem('user'))
    $.ajax({
        type: 'delete',
        url: "api/cart",
        headers: {"Authorization": `jwt ${userData.token}`},
        data: {
            product_id: productId,
            remove_all: true
        }
    }).done((data) => {
        loadCart()
    })
}

function clearCart() {
    const userData = JSON.parse(localStorage.getItem('user'))
    $.ajax({
        type: 'delete',
        url: "api/cart/all",
        headers: {"Authorization": `jwt ${userData.token}`}
    }).done((data) => {
        loadCart()
    })
}

function checkout() {
    const userData = JSON.parse(localStorage.getItem('user'))
    const pickUp = $('input[name="pickup"]:checked').val();
    if (globalAddressId == 0) {
        alert("Please set your address first.")
        return
    } else if (!pickUp) {
        alert("Please choose either you want your order to be delivered / picked up?")
        return
    }

    $.ajax({
        type: 'post',
        url: "api/checkout",
        headers: {"Authorization": `jwt ${userData.token}`},
        data: {
            "address_id": globalAddressId,
            "note": "",
            "is_pick_up": pickUp == "selfPickup" ? 1 : 0
        }
    }).done((data) => {
        alert("We received your order!")
        window.location.href = "account"
    })
}