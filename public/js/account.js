const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

$(window).ready(function () {
    const user = JSON.parse(localStorage.getItem('user'))
    $("#user_name").html(`${user.firstName || ""} ${user.lastName || ""}`)
    $("#user_email").html(user.email)

    const userData = JSON.parse(localStorage.getItem('user'))
    $.ajax({
        url: "api/orders",
        headers: {"Authorization": `jwt ${userData.token}`}
    }).done((data) => {
        let html = ''
        for (index in data) {
            const order = data[index]

            html += `<div class="card">
                        <div class="container">
                            <div class="column-25">
                                <img src="${order.items[0].image_url}" alt="">
                            </div>
                            <div class="column-75" style="text-align: left;">
                                <h4><b>#${order.id} - ${getOrderDisplayName(order.items)}</b></h4>
                                <p>${getOrderTime(order.created)}</p>
                                <p>Total: ${formatter.format(order.total)}</p>
                                <p>Delivery Detail: ${getDeliveryDetail(order)}</p>
                                <p>Order Status: ${order.status}</p>
                            </div>
                        </div>
                    </div>`
        }

        $("#currentPurchaseContainer").html(html)
    })
})

function getOrderTime(rawTime) {
    const unix = Date.parse(rawTime)
    const date = new Date(unix)

    return `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`
}

function getDeliveryDetail(order) {
    if (order.isPickUp) {
        return "Store Pick-Up"
    } else {
        return order.address.address_line
    }
}

function getOrderDisplayName(products) {
    if (products.length == 1) {
        return getProductDisplayName(products[0])
    } else {
        const productName = getProductDisplayName(products[0])
        return `${productName} and other ${products.length - 1} items`
    }
}

function getProductDisplayName(product) {
    if (!!product.parent_name) {
        return `${product.parent_name} - ${product.name}`
    }
    return product.name
}