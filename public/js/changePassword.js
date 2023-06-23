$(window).ready(function () {
    const userData = JSON.parse(localStorage.getItem('user'))
    $("#firstName").val(userData.firstName)
    $("#lastName").val(userData.lastName)
})

$("#changePasswordForm").submit((e) => {
    e.preventDefault()
    const newPassword = $("#newPassword").val()
    const confirmPassword = $("#confirmPassword").val()
    const oldPassword = $("#currentPassword").val()

    if (newPassword !== confirmPassword) {
        alert("Your password does not match!")
        return
    }

    let userData = JSON.parse(localStorage.getItem('user'))
    $.ajax({
        type: 'post',
        url: 'api/me/update-profile',
        headers: {"Authorization": `jwt ${userData.token}`},
        data: {
            first_name: $("#firstName").val(),
            last_name: $("#lastName").val(),
            current_password: oldPassword,
            new_password: newPassword,
        },
        success: function (response) {
            if (response.is_success) {
                userData.firstName = $("#firstName").val()
                userData.lastName = $("#lastName").val()
                localStorage.setItem('user', JSON.stringify(userData));

                alert("Your profile has been updated.")
                $("#changePasswordForm").trigger("reset")
            } else {
                alert(response.error_message)
            }
        }
    });
})