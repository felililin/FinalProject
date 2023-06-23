$(window).ready(function () {
    let userData = JSON.parse(localStorage.getItem('user'))

    $.ajax({
        type: 'get',
        url: 'api/address',
        headers: {"Authorization": `jwt ${userData.token}`},
        success: function (response) {
            if (response && response[0]) {
                const address = response[0]
                $("#alias").val(address.alias)
                $("#phoneNumber").val(address.phone_number)
                $("#addressLine").val(address.address_line)
                $("#postalCode").val(address.postal_code)
            }
        }
    })
})

$("#setAddressForm").submit((e) => {
    e.preventDefault()

    const alias = $("#alias").val()
    const phone = $("#phoneNumber").val()
    const address = $("#addressLine").val()
    const postalCode = $("#postalCode").val()

    let userData = JSON.parse(localStorage.getItem('user'))

    $.ajax({
        type: 'post',
        url: 'api/address',
        headers: {"Authorization": `jwt ${userData.token}`},
        data: {
            "alias": alias,
            "phone_number": phone,
            "address_line": address,
            "postal_code": postalCode
        },
        success: function (response) {
            alert("Your address has been saved.")
            window.location.href = "account"
        }
    });
})